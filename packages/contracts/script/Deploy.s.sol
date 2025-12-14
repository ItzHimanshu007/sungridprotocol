// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/EnergyToken.sol";
import "../src/Marketplace.sol";
import "../src/PricingOracle.sol";
import "../src/SmartMeterRegistry.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy PricingOracle
        PricingOracle pricingOracle = new PricingOracle();
        console.log("PricingOracle deployed at:", address(pricingOracle));

        // Deploy EnergyToken
        EnergyToken energyToken = new EnergyToken("ipfs://sungrid-metadata/");
        console.log("EnergyToken deployed at:", address(energyToken));

        // Deploy SmartMeterRegistry
        SmartMeterRegistry meterRegistry = new SmartMeterRegistry();
        console.log("SmartMeterRegistry deployed at:", address(meterRegistry));

        // Deploy Marketplace
        Marketplace marketplace = new Marketplace(
            address(energyToken),
            address(pricingOracle)
        );
        console.log("Marketplace deployed at:", address(marketplace));

        // Setup roles
        bytes32 ORACLE_ROLE = keccak256("ORACLE_ROLE");
        bytes32 MARKETPLACE_ROLE = keccak256("MARKETPLACE_ROLE");
        
        energyToken.grantRole(MARKETPLACE_ROLE, address(marketplace));
        
        vm.stopBroadcast();

        // Log deployment summary
        console.log("\n=== Deployment Summary ===");
        console.log("Network:", block.chainid);
        console.log("PricingOracle:", address(pricingOracle));
        console.log("EnergyToken:", address(energyToken));
        console.log("SmartMeterRegistry:", address(meterRegistry));
        console.log("Marketplace:", address(marketplace));
    }
}
