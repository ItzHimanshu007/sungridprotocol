// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title PricingOracle
 * @notice Dynamic pricing engine for energy marketplace
 */
contract PricingOracle is AccessControl {
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    // Grid zone => demand level (10000 = 1x, 15000 = 1.5x)
    mapping(uint256 => uint256) public zoneDemandMultiplier;
    
    // Grid zone => supply level
    mapping(uint256 => uint256) public zoneSupply;
    
    // Time slot => multiplier (for time-based pricing)
    mapping(uint256 => uint256) public timeMultipliers;
    
    // Base multiplier (10000 = 1x)
    uint256 public constant BASE_MULTIPLIER = 10000;
    
    // Price bounds
    uint256 public minMultiplier = 5000;  // 0.5x
    uint256 public maxMultiplier = 30000; // 3x
    
    // Last update timestamps
    mapping(uint256 => uint256) public lastZoneUpdate;

    event DemandUpdated(uint256 indexed zone, uint256 newMultiplier);
    event SupplyUpdated(uint256 indexed zone, uint256 newSupply);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPDATER_ROLE, msg.sender);
        
        // Initialize default time multipliers
        // Peak hours: 6PM-9PM (18:00-21:00)
        for (uint256 i = 18; i <= 21; i++) {
            timeMultipliers[i] = 13000; // 1.3x
        }
        
        // Off-peak: 11PM-6AM (23:00-06:00)
        for (uint256 i = 23; i <= 24; i++) {
            timeMultipliers[i] = 7000; // 0.7x
        }
        for (uint256 i = 0; i <= 6; i++) {
            timeMultipliers[i] = 7000; // 0.7x
        }
    }

    /**
     * @notice Calculate dynamic price based on zone and time
     * @param basePrice Base price set by seller
     * @param gridZone Geographic zone
     * @return Final calculated price
     */
    function calculateDynamicPrice(
        uint256 basePrice,
        uint256 gridZone
    ) external view returns (uint256) {
        uint256 demandMult = getDemandMultiplier(gridZone);
        uint256 timeMult = getTimeMultiplier();
        uint256 supplyMult = getSupplyMultiplier(gridZone);
        
        // Combined multiplier: (demand * time * supply) / BASE^2
        uint256 combinedMultiplier = (demandMult * timeMult * supplyMult) / (BASE_MULTIPLIER * BASE_MULTIPLIER);
        
        // Apply bounds
        if (combinedMultiplier < minMultiplier) {
            combinedMultiplier = minMultiplier;
        } else if (combinedMultiplier > maxMultiplier) {
            combinedMultiplier = maxMultiplier;
        }
        
        return (basePrice * combinedMultiplier) / BASE_MULTIPLIER;
    }

    /**
     * @notice Get demand multiplier for a zone
     */
    function getDemandMultiplier(uint256 gridZone) public view returns (uint256) {
        uint256 mult = zoneDemandMultiplier[gridZone];
        return mult > 0 ? mult : BASE_MULTIPLIER;
    }

    /**
     * @notice Get time-based multiplier based on current hour
     */
    function getTimeMultiplier() public view returns (uint256) {
        uint256 hour = (block.timestamp / 1 hours) % 24;
        uint256 mult = timeMultipliers[hour];
        return mult > 0 ? mult : BASE_MULTIPLIER;
    }

    /**
     * @notice Get supply-based multiplier (high supply = lower price)
     */
    function getSupplyMultiplier(uint256 gridZone) public view returns (uint256) {
        uint256 supply = zoneSupply[gridZone];
        
        if (supply == 0) return BASE_MULTIPLIER;
        
        // Higher supply = lower multiplier
        if (supply > 1000 ether) return 8000;  // 0.8x for abundant supply
        if (supply > 500 ether) return 9000;   // 0.9x
        if (supply < 100 ether) return 12000;  // 1.2x for low supply
        
        return BASE_MULTIPLIER;
    }

    /**
     * @notice Update demand multiplier for a zone
     */
    function updateZoneDemand(
        uint256 gridZone, 
        uint256 multiplier
    ) external onlyRole(UPDATER_ROLE) {
        require(multiplier >= minMultiplier && multiplier <= maxMultiplier, "PricingOracle: Invalid multiplier");
        
        zoneDemandMultiplier[gridZone] = multiplier;
        lastZoneUpdate[gridZone] = block.timestamp;
        
        emit DemandUpdated(gridZone, multiplier);
    }

    /**
     * @notice Update supply level for a zone
     */
    function updateZoneSupply(
        uint256 gridZone, 
        uint256 supply
    ) external onlyRole(UPDATER_ROLE) {
        zoneSupply[gridZone] = supply;
        emit SupplyUpdated(gridZone, supply);
    }

    /**
     * @notice Batch update multiple zones
     */
    function batchUpdateDemand(
        uint256[] calldata zones,
        uint256[] calldata multipliers
    ) external onlyRole(UPDATER_ROLE) {
        require(zones.length == multipliers.length, "PricingOracle: Length mismatch");
        
        for (uint256 i = 0; i < zones.length; i++) {
            zoneDemandMultiplier[zones[i]] = multipliers[i];
            lastZoneUpdate[zones[i]] = block.timestamp;
            emit DemandUpdated(zones[i], multipliers[i]);
        }
    }

    /**
     * @notice Update time multiplier for specific hour
     */
    function setTimeMultiplier(
        uint256 hour, 
        uint256 multiplier
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(hour < 24, "PricingOracle: Invalid hour");
        require(multiplier >= minMultiplier && multiplier <= maxMultiplier, "PricingOracle: Invalid multiplier");
        
        timeMultipliers[hour] = multiplier;
    }

    /**
     * @notice Set price bounds
     */
    function setPriceBounds(
        uint256 _minMultiplier, 
        uint256 _maxMultiplier
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_minMultiplier < _maxMultiplier, "PricingOracle: Invalid bounds");
        minMultiplier = _minMultiplier;
        maxMultiplier = _maxMultiplier;
    }

    /**
     * @notice Get current pricing info for a zone
     */
    function getZonePricingInfo(uint256 gridZone) external view returns (
        uint256 demandMultiplier,
        uint256 timeMultiplier,
        uint256 supplyMultiplier,
        uint256 combinedMultiplier
    ) {
        demandMultiplier = getDemandMultiplier(gridZone);
        timeMultiplier = getTimeMultiplier();
        supplyMultiplier = getSupplyMultiplier(gridZone);
        combinedMultiplier = (demandMultiplier * timeMultiplier * supplyMultiplier) / (BASE_MULTIPLIER * BASE_MULTIPLIER);
    }
}
