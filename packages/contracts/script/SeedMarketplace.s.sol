// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/EnergyToken.sol";
import "../src/Marketplace.sol";

contract SeedMarketplaceScript is Script {
    function run() external {
        // Addresses from web/lib/contracts.ts
        address energyTokenAddress = 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512;
        address marketplaceAddress = 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9;

        EnergyToken energyToken = EnergyToken(energyTokenAddress);
        Marketplace marketplace = Marketplace(payable(marketplaceAddress));

        // Define actors
        uint256 deployerKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80; // Account 0
        
        uint256 seller1Key = 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d; // Account 1
        address seller1 = vm.addr(seller1Key);
        
        uint256 seller2Key = 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a; // Account 2
        address seller2 = vm.addr(seller2Key);
        
        uint256 seller3Key = 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6; // Account 3
        address seller3 = vm.addr(seller3Key);

        console.log("Seeding Marketplace via script...");

        // 1. Admin/Oracle Setup: Register producers and Mint Energy
        vm.startBroadcast(deployerKey);
        
        // Grant ORACLE_ROLE to deployer so it can mint
        energyToken.grantRole(keccak256("ORACLE_ROLE"), vm.addr(deployerKey));

        console.log("Registering producers...");
        if (!energyToken.isVerifiedProducer(seller1)) energyToken.registerProducer(seller1, 101);
        if (!energyToken.isVerifiedProducer(seller2)) energyToken.registerProducer(seller2, 102);
        if (!energyToken.isVerifiedProducer(seller3)) energyToken.registerProducer(seller3, 103);

        console.log("Minting for Sellers...");
        uint256 id1 = energyToken.mintEnergy(seller1, 50 * 1e18, 1, "ipfs://QmTest1");
        uint256 id2 = energyToken.mintEnergy(seller2, 120 * 1e18, 2, "ipfs://QmTest2");
        uint256 id3 = energyToken.mintEnergy(seller3, 75 * 1e18, 1, "ipfs://QmTest3");
        
        vm.stopBroadcast();

        // 2. Seller 1 Actions
        vm.startBroadcast(seller1Key);
        console.log("Listing Seller 1...");
        if (!energyToken.isApprovedForAll(seller1, marketplaceAddress)) {
            energyToken.setApprovalForAll(marketplaceAddress, true);
        }
        marketplace.createListing(id1, 50 * 1e18, 0.0001 ether, 7 days);
        vm.stopBroadcast();

        // 3. Seller 2 Actions
        vm.startBroadcast(seller2Key);
        console.log("Listing Seller 2...");
         if (!energyToken.isApprovedForAll(seller2, marketplaceAddress)) {
            energyToken.setApprovalForAll(marketplaceAddress, true);
        }
        marketplace.createListing(id2, 100 * 1e18, 0.00015 ether, 14 days);
        vm.stopBroadcast();

        // 4. Seller 3 Actions
        vm.startBroadcast(seller3Key);
        console.log("Listing Seller 3...");
         if (!energyToken.isApprovedForAll(seller3, marketplaceAddress)) {
            energyToken.setApprovalForAll(marketplaceAddress, true);
        }
        marketplace.createListing(id3, 75 * 1e18, 0.00012 ether, 2 days);
        vm.stopBroadcast();

        console.log("Marketplace Seeded Successfully!");
    }
}
