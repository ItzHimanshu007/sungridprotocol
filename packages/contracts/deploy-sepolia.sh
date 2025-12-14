#!/bin/bash

# SunGrid Protocol - Sepolia Deployment Script
# This script deploys all contracts to Sepolia testnet

set -e  # Exit on error

echo "🚀 SunGrid Protocol - Sepolia Deployment"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the contracts directory
if [ ! -f "foundry.toml" ]; then
    echo "${RED}Error: Please run this script from the packages/contracts directory${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "${RED}Error: .env file not found!${NC}"
    echo "${YELLOW}Please create a .env file based on .env.example${NC}"
    echo ""
    echo "Required variables:"
    echo "  - PRIVATE_KEY"
    echo "  - SEPOLIA_RPC_URL"
    echo "  - ETHERSCAN_API_KEY (optional)"
    exit 1
fi

# Load environment variables
source .env

# Check if PRIVATE_KEY is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "${RED}Error: PRIVATE_KEY not set in .env file${NC}"
    exit 1
fi

# Check if SEPOLIA_RPC_URL is set
if [ -z "$SEPOLIA_RPC_URL" ]; then
    echo "${RED}Error: SEPOLIA_RPC_URL not set in .env file${NC}"
    exit 1
fi

echo "${GREEN}✓ Environment variables loaded${NC}"
echo ""

# Get deployer address
DEPLOYER=$(cast wallet address --private-key $PRIVATE_KEY)
echo "Deployer address: $DEPLOYER"
echo ""

# Check balance
echo "Checking Sepolia ETH balance..."
BALANCE=$(cast balance $DEPLOYER --rpc-url sepolia)
BALANCE_ETH=$(cast --to-unit $BALANCE ether)
echo "Balance: ${BALANCE_ETH} ETH"
echo ""

# Warn if balance is low
if (( $(echo "$BALANCE_ETH < 0.05" | bc -l) )); then
    echo "${YELLOW}⚠️  Warning: Low balance detected!${NC}"
    echo "${YELLOW}   You may not have enough ETH to deploy all contracts.${NC}"
    echo "${YELLOW}   Get more from: https://sepoliafaucet.com/${NC}"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build contracts
echo "${YELLOW}Building contracts...${NC}"
forge build

if [ $? -ne 0 ]; then
    echo "${RED}Build failed!${NC}"
    exit 1
fi

echo "${GREEN}✓ Build successful${NC}"
echo ""

# Deploy contracts
echo "${YELLOW}Deploying to Sepolia...${NC}"
echo "This may take a few minutes..."
echo ""

forge script script/DeployWithChainlink.s.sol:DeployWithChainlink \
    --rpc-url sepolia \
    --broadcast \
    --verify \
    -vvv

DEPLOY_STATUS=$?

echo ""
if [ $DEPLOY_STATUS -eq 0 ]; then
    echo "${GREEN}✅ Deployment successful!${NC}"
    echo ""
    
    # Check if deployments.json was created
    if [ -f "deployments.json" ]; then
        echo "${GREEN}Contract addresses saved to deployments.json${NC}"
        echo ""
        echo "Deployment Summary:"
        echo "==================="
        cat deployments.json | jq '.'
        echo ""
        
        # Extract addresses for easy copying
        echo "Environment Variables for Vercel:"
        echo "=================================="
        echo "NEXT_PUBLIC_CHAIN_ID=11155111"
        echo "NEXT_PUBLIC_RPC_URL=$SEPOLIA_RPC_URL"
        ENERGY_TOKEN=$(cat deployments.json | jq -r '.EnergyToken')
        MARKETPLACE=$(cat deployments.json | jq -r '.Marketplace')
        PRICING_ORACLE=$(cat deployments.json | jq -r '.PricingOracle')
        CHAINLINK_ORACLE=$(cat deployments.json | jq -r '.ChainlinkEnergyOracle')
        echo "NEXT_PUBLIC_ENERGY_TOKEN_ADDRESS=$ENERGY_TOKEN"
        echo "NEXT_PUBLIC_MARKETPLACE_ADDRESS=$MARKETPLACE"
        echo "NEXT_PUBLIC_PRICING_ORACLE_ADDRESS=$PRICING_ORACLE"
        echo "NEXT_PUBLIC_CHAINLINK_ORACLE_ADDRESS=$CHAINLINK_ORACLE"
        echo ""
        
        # Create a file with env vars for easy import
        cat > deployment-env-vars.txt << EOF
# Add these to your Vercel project environment variables
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=$SEPOLIA_RPC_URL
NEXT_PUBLIC_ENERGY_TOKEN_ADDRESS=$ENERGY_TOKEN
NEXT_PUBLIC_MARKETPLACE_ADDRESS=$MARKETPLACE
NEXT_PUBLIC_PRICING_ORACLE_ADDRESS=$PRICING_ORACLE
NEXT_PUBLIC_CHAINLINK_ORACLE_ADDRESS=$CHAINLINK_ORACLE
EOF
        
        echo "${GREEN}✓ Environment variables saved to deployment-env-vars.txt${NC}"
        echo ""
        
        echo "Next steps:"
        echo "1. Copy the environment variables above"
        echo "2. Add them to your Vercel project"
        echo "3. Deploy to Vercel: vercel --prod"
    else
        echo "${YELLOW}Warning: deployments.json not found${NC}"
        echo "Check the deployment logs above for contract addresses"
    fi
else
    echo "${RED}❌ Deployment failed!${NC}"
    echo "${YELLOW}Check the error messages above${NC}"
    echo ""
    echo "Common issues:"
    echo "- Insufficient balance (get more from https://sepoliafaucet.com/)"
    echo "- Network congestion (try again later)"
    echo "- RPC URL issues (check your Alchemy/Infura URL)"
    exit 1
fi
