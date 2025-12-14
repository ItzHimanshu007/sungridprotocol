// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title SmartMeterRegistry
 * @notice Registry for verified smart meters and reading submissions
 */
contract SmartMeterRegistry is AccessControl {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    struct SmartMeter {
        uint256 meterId;
        address owner;
        bytes32 hardwareHash;
        uint256 gridZone;
        uint256 registeredAt;
        uint256 lastReading;
        uint256 totalProduced;
        uint256 totalConsumed;
        bool isActive;
    }

    struct MeterReading {
        uint256 meterId;
        uint256 kWhProduced;
        uint256 kWhConsumed;
        uint256 timestamp;
        bytes signature;
    }

    // Meter ID => Smart Meter details
    mapping(uint256 => SmartMeter) public meters;
    
    // Owner address => Meter IDs
    mapping(address => uint256[]) public ownerMeters;
    
    // Hardware hash => is registered
    mapping(bytes32 => bool) public registeredHardware;
    
    // Meter ID => last reading timestamp
    mapping(uint256 => uint256) public lastReadingTime;
    
    // Minimum time between readings (5 minutes)
    uint256 public constant MIN_READING_INTERVAL = 5 minutes;
    
    // Counter for meter IDs
    uint256 private _meterCounter;

    event MeterRegistered(uint256 indexed meterId, address indexed owner, uint256 gridZone);
    event MeterDeactivated(uint256 indexed meterId);
    event ReadingSubmitted(uint256 indexed meterId, uint256 produced, uint256 consumed, uint256 timestamp);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REGISTRAR_ROLE, msg.sender);
    }

    /**
     * @notice Register a new smart meter
     * @param owner Address of meter owner
     * @param hardwareHash Unique hardware identifier hash
     * @param gridZone Geographic zone
     */
    function registerMeter(
        address owner,
        bytes32 hardwareHash,
        uint256 gridZone
    ) external onlyRole(REGISTRAR_ROLE) returns (uint256) {
        require(owner != address(0), "SmartMeterRegistry: Invalid owner");
        require(!registeredHardware[hardwareHash], "SmartMeterRegistry: Hardware already registered");
        require(gridZone > 0, "SmartMeterRegistry: Invalid grid zone");

        _meterCounter++;
        uint256 meterId = _meterCounter;

        meters[meterId] = SmartMeter({
            meterId: meterId,
            owner: owner,
            hardwareHash: hardwareHash,
            gridZone: gridZone,
            registeredAt: block.timestamp,
            lastReading: 0,
            totalProduced: 0,
            totalConsumed: 0,
            isActive: true
        });

        ownerMeters[owner].push(meterId);
        registeredHardware[hardwareHash] = true;

        emit MeterRegistered(meterId, owner, gridZone);
        
        return meterId;
    }

    /**
     * @notice Submit a meter reading
     * @param reading Meter reading data
     */
    function submitReading(
        MeterReading calldata reading
    ) external onlyRole(ORACLE_ROLE) returns (uint256 netProduction) {
        SmartMeter storage meter = meters[reading.meterId];
        
        require(meter.isActive, "SmartMeterRegistry: Meter not active");
        require(
            reading.timestamp > lastReadingTime[reading.meterId],
            "SmartMeterRegistry: Stale reading"
        );
        require(
            reading.timestamp <= block.timestamp,
            "SmartMeterRegistry: Future reading"
        );
        require(
            block.timestamp - lastReadingTime[reading.meterId] >= MIN_READING_INTERVAL || 
            lastReadingTime[reading.meterId] == 0,
            "SmartMeterRegistry: Reading too frequent"
        );

        // Verify signature (optional, for hardware-signed readings)
        if (reading.signature.length > 0) {
            require(
                verifyReadingSignature(reading, meter.hardwareHash),
                "SmartMeterRegistry: Invalid signature"
            );
        }

        // Calculate net production since last reading
        uint256 previousProduced = meter.totalProduced;
        
        require(reading.kWhProduced >= previousProduced, "SmartMeterRegistry: Invalid production value");
        
        netProduction = reading.kWhProduced - previousProduced;

        // Update meter state
        meter.totalProduced = reading.kWhProduced;
        meter.totalConsumed = reading.kWhConsumed;
        meter.lastReading = reading.timestamp;
        lastReadingTime[reading.meterId] = block.timestamp;

        emit ReadingSubmitted(reading.meterId, reading.kWhProduced, reading.kWhConsumed, reading.timestamp);
        
        return netProduction;
    }

    /**
     * @notice Verify hardware signature on reading
     */
    function verifyReadingSignature(
        MeterReading calldata reading,
        bytes32 hardwareHash
    ) public pure returns (bool) {
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                reading.meterId,
                reading.kWhProduced,
                reading.kWhConsumed,
                reading.timestamp
            )
        );
        
        bytes32 ethSignedHash = messageHash.toEthSignedMessageHash();
        address recoveredSigner = ethSignedHash.recover(reading.signature);
        
        // Verify recovered address matches expected hardware identity
        return keccak256(abi.encodePacked(recoveredSigner)) == hardwareHash;
    }

    /**
     * @notice Deactivate a meter
     */
    function deactivateMeter(uint256 meterId) external onlyRole(REGISTRAR_ROLE) {
        require(meters[meterId].isActive, "SmartMeterRegistry: Already inactive");
        meters[meterId].isActive = false;
        emit MeterDeactivated(meterId);
    }

    /**
     * @notice Transfer meter ownership
     */
    function transferMeterOwnership(
        uint256 meterId, 
        address newOwner
    ) external {
        SmartMeter storage meter = meters[meterId];
        require(meter.owner == msg.sender, "SmartMeterRegistry: Not owner");
        require(newOwner != address(0), "SmartMeterRegistry: Invalid new owner");
        
        meter.owner = newOwner;
        ownerMeters[newOwner].push(meterId);
    }

    // View functions
    function getMeter(uint256 meterId) external view returns (SmartMeter memory) {
        return meters[meterId];
    }

    function getOwnerMeters(address owner) external view returns (uint256[] memory) {
        return ownerMeters[owner];
    }

    function isMeterActive(uint256 meterId) external view returns (bool) {
        return meters[meterId].isActive;
    }

    function getMeterOwner(uint256 meterId) external view returns (address) {
        return meters[meterId].owner;
    }

    function getMeterGridZone(uint256 meterId) external view returns (uint256) {
        return meters[meterId].gridZone;
    }
}
