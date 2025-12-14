// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/EnergyToken.sol";

contract GrantRoleScript is Script {
    function run() external {
        // Read account address from environment or use a hardcoded default for demo purpose
        // Here we grant role to Account #1 (test account) 
        address accountToGrant = vm.envOr("GRANT_TO", address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8));
        address energyTokenAddress = vm.envAddress("ENERGY_TOKEN_ADDRESS");
        
        // If not set in env, use the known address from previous deployment
        if (energyTokenAddress == address(0)) {
            energyTokenAddress = 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512;
        }

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        if (deployerPrivateKey == 0) {
             // Fallback to Anvil Account #0 private key default
             deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        }

        vm.startBroadcast(deployerPrivateKey);

        EnergyToken energyToken = EnergyToken(energyTokenAddress);
        bytes32 ORACLE_ROLE = keccak256("ORACLE_ROLE");
        
        console.log("Granting ORACLE_ROLE to:", accountToGrant);
        energyToken.grantRole(ORACLE_ROLE, accountToGrant);
        
        vm.stopBroadcast();
        
        console.log("Role Granted Successfully!");
    }
}
