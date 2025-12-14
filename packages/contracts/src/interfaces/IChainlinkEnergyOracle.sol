// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IChainlinkEnergyOracle
 * @notice Interface for ChainlinkEnergyOracle contract
 */
interface IChainlinkEnergyOracle {
    struct MeterReading {
        uint256 energyProduced; // in kWh (18 decimals)
        uint256 timestamp;
        uint256 transmissionLoss; // percentage in basis points
        bytes32 dataHash;
        bool verified;
    }

    // Events
    event MeterReadingSubmitted(
        address indexed producer,
        uint256 energyProduced,
        uint256 transmissionLoss,
        uint256 timestamp
    );
    event MeterReadingVerified(address indexed producer, uint256 readingIndex);
    event TransmissionLossUpdated(uint256 indexed zone, uint256 lossRate);

    // View functions
    function calculateNetEnergy(uint256 grossEnergy, uint256 gridZone)
        external
        view
        returns (uint256 netEnergy);

    function getLatestEthUsdPrice()
        external
        view
        returns (uint256 price, uint8 decimals);

    function getLatestUsdcUsdPrice()
        external
        view
        returns (uint256 price, uint8 decimals);

    function convertEthToUsdc(uint256 ethAmount)
        external
        view
        returns (uint256 usdcAmount);

    function convertUsdcToEth(uint256 usdcAmount)
        external
        view
        returns (uint256 ethAmount);

    function getMeterReadings(address producer)
        external
        view
        returns (MeterReading[] memory);

    function getLatestVerifiedReading(address producer)
        external
        view
        returns (MeterReading memory reading, bool found);

    function zoneTransmissionLoss(uint256 zone) external view returns (uint256);

    function totalEnergyProduced(address producer) external view returns (uint256);

    function verifiedEnergyProduced(address producer) external view returns (uint256);

    // State-changing functions
    function submitMeterReading(
        uint256 energyProduced,
        uint256 gridZone,
        bytes32 dataHash
    ) external;

    function verifyMeterReading(address producer, uint256 readingIndex) external;

    function updateTransmissionLoss(uint256 gridZone, uint256 lossRate) external;
}
