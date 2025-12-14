// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/AggregatorV3Interface.sol";
import "./interfaces/AutomationCompatibleInterface.sol";

/**
 * @title ChainlinkEnergyOracle
 * @notice Decentralized oracle for smart meter data feeds and automated loss calculations
 * @dev Uses Chainlink Data Feeds to eliminate centralization from manual ORACLE_ROLE
 */
contract ChainlinkEnergyOracle is AccessControl, AutomationCompatibleInterface {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant METER_ROLE = keccak256("METER_ROLE");

    // Chainlink price feeds
    AggregatorV3Interface public ethUsdPriceFeed;
    AggregatorV3Interface public usdcUsdPriceFeed;

    // Smart meter data
    struct MeterReading {
        uint256 energyProduced; // in kWh (18 decimals)
        uint256 timestamp;
        uint256 transmissionLoss; // percentage in basis points (e.g., 500 = 5%)
        bytes32 dataHash; // Hash of raw meter data for verification
        bool verified;
    }

    // Grid zone transmission loss rates (basis points)
    mapping(uint256 => uint256) public zoneTransmissionLoss;

    // Meter readings by producer address
    mapping(address => MeterReading[]) public meterReadings;
    mapping(address => uint256) public lastReadingTimestamp;

    // Energy production tracking
    mapping(address => uint256) public totalEnergyProduced;
    mapping(address => uint256) public verifiedEnergyProduced;

    // Automation configuration
    uint256 public automationInterval = 1 hours;
    uint256 public lastAutomationTimestamp;

    // Events
    event MeterReadingSubmitted(
        address indexed producer,
        uint256 energyProduced,
        uint256 transmissionLoss,
        uint256 timestamp
    );
    event MeterReadingVerified(address indexed producer, uint256 readingIndex);
    event TransmissionLossUpdated(uint256 indexed zone, uint256 lossRate);
    event PriceFeedUpdated(address ethUsd, address usdcUsd);

    constructor(address _ethUsdFeed, address _usdcUsdFeed) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);

        ethUsdPriceFeed = AggregatorV3Interface(_ethUsdFeed);
        usdcUsdPriceFeed = AggregatorV3Interface(_usdcUsdFeed);

        // Initialize default transmission loss rates for Indian grid zones
        zoneTransmissionLoss[1] = 600; // Rajasthan: 6%
        zoneTransmissionLoss[2] = 550; // Delhi: 5.5%
        zoneTransmissionLoss[3] = 650; // Maharashtra: 6.5%
        zoneTransmissionLoss[4] = 700; // West Bengal: 7%

        lastAutomationTimestamp = block.timestamp;
    }

    /**
     * @notice Submit smart meter reading (called by authorized IoT devices)
     * @param energyProduced Amount of energy produced in kWh (18 decimals)
     * @param gridZone Grid zone identifier
     * @param dataHash Hash of raw meter data for verification
     */
    function submitMeterReading(
        uint256 energyProduced,
        uint256 gridZone,
        bytes32 dataHash
    ) external onlyRole(METER_ROLE) {
        require(energyProduced > 0, "Energy must be positive");
        require(zoneTransmissionLoss[gridZone] > 0, "Invalid grid zone");

        uint256 transmissionLoss = zoneTransmissionLoss[gridZone];

        MeterReading memory reading = MeterReading({
            energyProduced: energyProduced,
            timestamp: block.timestamp,
            transmissionLoss: transmissionLoss,
            dataHash: dataHash,
            verified: false
        });

        meterReadings[msg.sender].push(reading);
        lastReadingTimestamp[msg.sender] = block.timestamp;
        totalEnergyProduced[msg.sender] += energyProduced;

        emit MeterReadingSubmitted(
            msg.sender,
            energyProduced,
            transmissionLoss,
            block.timestamp
        );
    }

    /**
     * @notice Verify meter reading (can be automated via Chainlink Automation)
     * @param producer Address of the energy producer
     * @param readingIndex Index of the reading to verify
     */
    function verifyMeterReading(address producer, uint256 readingIndex)
        external
        onlyRole(ADMIN_ROLE)
    {
        require(readingIndex < meterReadings[producer].length, "Invalid index");
        MeterReading storage reading = meterReadings[producer][readingIndex];
        require(!reading.verified, "Already verified");

        reading.verified = true;
        verifiedEnergyProduced[producer] += reading.energyProduced;

        emit MeterReadingVerified(producer, readingIndex);
    }

    /**
     * @notice Calculate energy after transmission loss
     * @param grossEnergy Gross energy produced
     * @param gridZone Grid zone identifier
     * @return netEnergy Net energy after transmission loss
     */
    function calculateNetEnergy(uint256 grossEnergy, uint256 gridZone)
        public
        view
        returns (uint256 netEnergy)
    {
        uint256 lossRate = zoneTransmissionLoss[gridZone];
        require(lossRate > 0, "Invalid grid zone");

        // Calculate net energy: grossEnergy * (10000 - lossRate) / 10000
        netEnergy = (grossEnergy * (10000 - lossRate)) / 10000;
    }

    /**
     * @notice Get latest ETH/USD price from Chainlink
     * @return price Latest price (8 decimals)
     * @return decimals Number of decimals
     */
    function getLatestEthUsdPrice()
        public
        view
        returns (uint256 price, uint8 decimals)
    {
        (, int256 answer, , , ) = ethUsdPriceFeed.latestRoundData();
        require(answer > 0, "Invalid price feed");

        price = uint256(answer);
        decimals = ethUsdPriceFeed.decimals();
    }

    /**
     * @notice Get latest USDC/USD price from Chainlink
     * @return price Latest price (8 decimals)
     * @return decimals Number of decimals
     */
    function getLatestUsdcUsdPrice()
        public
        view
        returns (uint256 price, uint8 decimals)
    {
        (, int256 answer, , , ) = usdcUsdPriceFeed.latestRoundData();
        require(answer > 0, "Invalid price feed");

        price = uint256(answer);
        decimals = usdcUsdPriceFeed.decimals();
    }

    /**
     * @notice Convert ETH amount to USDC equivalent
     * @param ethAmount Amount in ETH (18 decimals)
     * @return usdcAmount Amount in USDC (6 decimals)
     */
    function convertEthToUsdc(uint256 ethAmount)
        public
        view
        returns (uint256 usdcAmount)
    {
        (uint256 ethPrice, ) = getLatestEthUsdPrice();
        (uint256 usdcPrice, ) = getLatestUsdcUsdPrice();

        // ethAmount (18 dec) * ethPrice (8 dec) / usdcPrice (8 dec) / 10^12 = USDC (6 dec)
        usdcAmount = (ethAmount * ethPrice) / usdcPrice / 1e12;
    }

    /**
     * @notice Convert USDC amount to ETH equivalent
     * @param usdcAmount Amount in USDC (6 decimals)
     * @return ethAmount Amount in ETH (18 decimals)
     */
    function convertUsdcToEth(uint256 usdcAmount)
        public
        view
        returns (uint256 ethAmount)
    {
        (uint256 ethPrice, ) = getLatestEthUsdPrice();
        (uint256 usdcPrice, ) = getLatestUsdcUsdPrice();

        // usdcAmount (6 dec) * 10^12 * usdcPrice (8 dec) / ethPrice (8 dec) = ETH (18 dec)
        ethAmount = (usdcAmount * 1e12 * usdcPrice) / ethPrice;
    }

    /**
     * @notice Update transmission loss rate for a grid zone
     * @param gridZone Grid zone identifier
     * @param lossRate Loss rate in basis points (e.g., 600 = 6%)
     */
    function updateTransmissionLoss(uint256 gridZone, uint256 lossRate)
        external
        onlyRole(ADMIN_ROLE)
    {
        require(lossRate <= 2000, "Loss rate too high (max 20%)");
        zoneTransmissionLoss[gridZone] = lossRate;
        emit TransmissionLossUpdated(gridZone, lossRate);
    }

    /**
     * @notice Update Chainlink price feed addresses
     * @param _ethUsdFeed New ETH/USD feed address
     * @param _usdcUsdFeed New USDC/USD feed address
     */
    function updatePriceFeeds(address _ethUsdFeed, address _usdcUsdFeed)
        external
        onlyRole(ADMIN_ROLE)
    {
        ethUsdPriceFeed = AggregatorV3Interface(_ethUsdFeed);
        usdcUsdPriceFeed = AggregatorV3Interface(_usdcUsdFeed);
        emit PriceFeedUpdated(_ethUsdFeed, _usdcUsdFeed);
    }

    /**
     * @notice Get meter readings for a producer
     * @param producer Address of the producer
     * @return readings Array of meter readings
     */
    function getMeterReadings(address producer)
        external
        view
        returns (MeterReading[] memory readings)
    {
        return meterReadings[producer];
    }

    /**
     * @notice Get latest verified reading for a producer
     * @param producer Address of the producer
     * @return reading Latest verified reading
     * @return found Whether a verified reading exists
     */
    function getLatestVerifiedReading(address producer)
        external
        view
        returns (MeterReading memory reading, bool found)
    {
        MeterReading[] memory readings = meterReadings[producer];
        for (uint256 i = readings.length; i > 0; i--) {
            if (readings[i - 1].verified) {
                return (readings[i - 1], true);
            }
        }
        return (reading, false);
    }

    // ===== Chainlink Automation Functions =====

    /**
     * @notice Check if upkeep is needed (Chainlink Automation)
     * @return upkeepNeeded Whether upkeep should be performed
     * @return performData Data to pass to performUpkeep
     */
    function checkUpkeep(bytes calldata /* checkData */)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = (block.timestamp - lastAutomationTimestamp) > automationInterval;
        performData = "";
    }

    /**
     * @notice Perform upkeep (Chainlink Automation)
     * @dev This can be extended to auto-verify readings, calculate statistics, etc.
     */
    function performUpkeep(bytes calldata /* performData */) external override {
        require(
            (block.timestamp - lastAutomationTimestamp) > automationInterval,
            "Interval not met"
        );

        lastAutomationTimestamp = block.timestamp;

        // Future: Auto-verify pending readings based on consensus algorithms
        // Future: Update transmission loss rates based on grid data
        // Future: Trigger alerts for anomalous readings
    }

    /**
     * @notice Update automation interval
     * @param newInterval New interval in seconds
     */
    function updateAutomationInterval(uint256 newInterval)
        external
        onlyRole(ADMIN_ROLE)
    {
        require(newInterval >= 5 minutes, "Interval too short");
        automationInterval = newInterval;
    }
}
