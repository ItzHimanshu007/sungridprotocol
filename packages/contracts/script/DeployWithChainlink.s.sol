// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/EnergyToken.sol";
import "../src/Marketplace.sol";
import "../src/PricingOracle.sol";
import "../src/SmartMeterRegistry.sol";
import "../src/ChainlinkEnergyOracle.sol";
import "../src/mocks/MockV3Aggregator.sol";

/**
 * @title DeployWithChainlink
 * @notice Deployment script with Chainlink oracle integration
 * @dev Deploys mock price feeds for Anvil, real feeds for production networks
 */
contract DeployWithChainlink is Script {
    // Chainlink Price Feed addresses
    // Ethereum Sepolia Testnet
    address constant SEPOLIA_ETH_USD = 0x694AA1769357215DE4FAC081bf1f309aDC325306;
    address constant SEPOLIA_USDC_USD = 0xA2F78ab2355fE2f98ebD4664360953E6a60f164c;
    
    // Base Mainnet
    address constant BASE_ETH_USD = 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70;
    address constant BASE_USDC_USD = 0x7e860098F58bBFC8648a4311b374B1D669a2bc6B;
    
    // Base Sepolia Testnet
    address constant BASE_SEPOLIA_ETH_USD = 0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1;
    address constant BASE_SEPOLIA_USDC_USD = 0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        uint256 chainId = block.chainid;
        
        vm.startBroadcast(deployerPrivateKey);

        address ethUsdFeed;
        address usdcUsdFeed;

        // Determine network and use appropriate price feeds
        if (chainId == 31337) {
            // Anvil local network - deploy mocks
            console.log("Deploying on Anvil - Creating mock price feeds...");
            
            // ETH/USD = $2,250 (8 decimals for Chainlink)
            MockV3Aggregator mockEthUsd = new MockV3Aggregator(
                8,
                225000000000, // $2,250.00
                "ETH/USD"
            );
            
            // USDC/USD = $1.00 (8 decimals)
            MockV3Aggregator mockUsdcUsd = new MockV3Aggregator(
                8,
                100000000, // $1.00
                "USDC/USD"
            );
            
            ethUsdFeed = address(mockEthUsd);
            usdcUsdFeed = address(mockUsdcUsd);
            
            console.log("Mock ETH/USD Feed:", ethUsdFeed);
            console.log("Mock USDC/USD Feed:", usdcUsdFeed);
            
        } else if (chainId == 11155111) {
            // Ethereum Sepolia Testnet
            console.log("Deploying on Ethereum Sepolia - Using testnet Chainlink feeds...");
            ethUsdFeed = SEPOLIA_ETH_USD;
            usdcUsdFeed = SEPOLIA_USDC_USD;
            
        } else if (chainId == 8453) {
            // Base Mainnet
            console.log("Deploying on Base Mainnet - Using real Chainlink feeds...");
            ethUsdFeed = BASE_ETH_USD;
            usdcUsdFeed = BASE_USDC_USD;
            
        } else if (chainId == 84532) {
            // Base Sepolia Testnet
            console.log("Deploying on Base Sepolia - Using testnet Chainlink feeds...");
            ethUsdFeed = BASE_SEPOLIA_ETH_USD;
            usdcUsdFeed = BASE_SEPOLIA_USDC_USD;
            
        } else {
            revert("Unsupported network - add price feeds for this chain");
        }

        // Deploy PricingOracle
        PricingOracle pricingOracle = new PricingOracle();
        console.log("PricingOracle deployed at:", address(pricingOracle));

        // Deploy ChainlinkEnergyOracle
        ChainlinkEnergyOracle chainlinkOracle = new ChainlinkEnergyOracle(
            ethUsdFeed,
            usdcUsdFeed
        );
        console.log("ChainlinkEnergyOracle deployed at:", address(chainlinkOracle));

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
        bytes32 METER_ROLE = keccak256("METER_ROLE");
        bytes32 ADMIN_ROLE = keccak256("ADMIN_ROLE");
        
        // Grant roles
        energyToken.grantRole(MARKETPLACE_ROLE, address(marketplace));
        
        // Grant ChainlinkOracle the ORACLE_ROLE on EnergyToken for automated minting
        energyToken.grantRole(ORACLE_ROLE, address(chainlinkOracle));
        
        // For testing: grant deployer METER_ROLE to submit readings
        chainlinkOracle.grantRole(METER_ROLE, msg.sender);
        
        console.log("\nRoles configured:");
        console.log("- Marketplace can update EnergyToken reputation");
        console.log("- ChainlinkOracle can mint energy tokens");
        console.log("- Deployer can submit meter readings (for testing)");
        
        vm.stopBroadcast();

        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Network Chain ID:", chainId);
        console.log("Network:", getNetworkName(chainId));
        console.log("\nCore Contracts:");
        console.log("- EnergyToken:", address(energyToken));
        console.log("- Marketplace:", address(marketplace));
        console.log("- PricingOracle:", address(pricingOracle));
        console.log("- SmartMeterRegistry:", address(meterRegistry));
        console.log("- ChainlinkEnergyOracle:", address(chainlinkOracle));
        console.log("\nChainlink Price Feeds:");
        console.log("- ETH/USD:", ethUsdFeed);
        console.log("- USDC/USD:", usdcUsdFeed);
        console.log("\n=========================");
        
        // Write key addresses for frontend (simplified to avoid stack too deep)
        _writeDeploymentFile(
            chainId,
            address(energyToken),
            address(marketplace),
            address(pricingOracle),
            address(meterRegistry),
            address(chainlinkOracle),
            ethUsdFeed,
            usdcUsdFeed
        );
        
        console.log("\nContract addresses saved to deployments.json");
    }

    function _writeDeploymentFile(
        uint256 chainId,
        address energyToken,
        address marketplace,
        address pricingOracle,
        address meterRegistry,
        address chainlinkOracle,
        address ethUsdFeed,
        address usdcUsdFeed
    ) internal {
        string memory json = string(abi.encodePacked(
            '{"chainId":', vm.toString(chainId), ','
        ));
        json = string(abi.encodePacked(
            json,
            '"EnergyToken":"', vm.toString(energyToken), '",'
        ));
        json = string(abi.encodePacked(
            json,
            '"Marketplace":"', vm.toString(marketplace), '",'
        ));
        json = string(abi.encodePacked(
            json,
            '"PricingOracle":"', vm.toString(pricingOracle), '",'
        ));
        json = string(abi.encodePacked(
            json,
            '"SmartMeterRegistry":"', vm.toString(meterRegistry), '",'
        ));
        json = string(abi.encodePacked(
            json,
            '"ChainlinkEnergyOracle":"', vm.toString(chainlinkOracle), '",'
        ));
        json = string(abi.encodePacked(
            json,
            '"ChainlinkFeeds":{"ETH_USD":"', vm.toString(ethUsdFeed), '",'
        ));
        json = string(abi.encodePacked(
            json,
            '"USDC_USD":"', vm.toString(usdcUsdFeed), '"}}'
        ));
        
        vm.writeFile("deployments.json", json);
    }

    function getNetworkName(uint256 chainId) internal pure returns (string memory) {
        if (chainId == 31337) return "Anvil (Local)";
        if (chainId == 11155111) return "Ethereum Sepolia Testnet";
        if (chainId == 8453) return "Base Mainnet";
        if (chainId == 84532) return "Base Sepolia Testnet";
        if (chainId == 1) return "Ethereum Mainnet";
        return "Unknown";
    }
}
