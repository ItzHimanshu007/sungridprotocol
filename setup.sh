#!/bin/bash

# SunGrid Protocol - Complete Setup Script
# This script will:
# 1. Start Anvil (local blockchain)
# 2. Deploy smart contracts
# 3. Update contract addresses
# 4. Run database migrations
# 5. Seed database
# 6. Start API server

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 SunGrid Protocol Setup${NC}\n"

# Step 1: Check if Anvil is running
echo -e "${BLUE}Step 1: Checking Anvil...${NC}"
if lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✓ Anvil is already running on port 8545${NC}"
else
    echo -e "${RED}✗ Anvil is not running${NC}"
    echo -e "${BLUE}Starting Anvil in background...${NC}"
    anvil > logs/anvil.log 2>&1 &
    echo $! > logs/anvil.pid
    sleep 3
    echo -e "${GREEN}✓ Anvil started${NC}"
fi

# Step 2: Deploy Smart Contracts
echo -e "\n${BLUE}Step 2: Deploying Smart Contracts...${NC}"
cd packages/contracts
forge build
forge script script/Deploy.s.sol:DeployScript --fork-url http://127.0.0.1:8545 --broadcast --legacy

# Extract deployed addresses
echo -e "${GREEN}✓ Contracts deployed${NC}"

# Step 3: Update .env with contract addresses
echo -e "\n${BLUE}Step 3: Extracting contract addresses...${NC}"
BROADCAST_FILE=$(find broadcast -name "*.json" | grep "8545" | head -1)

if [ -f "$BROADCAST_FILE" ]; then
    PRICING_ORACLE=$(jq -r '.transactions[0].contractAddress' "$BROADCAST_FILE")
    ENERGY_TOKEN=$(jq -r '.transactions[1].contractAddress' "$BROADCAST_FILE")
    METER_REGISTRY=$(jq -r '.transactions[2].contractAddress' "$BROADCAST_FILE")
    MARKETPLACE=$(jq -r '.transactions[3].contractAddress' "$BROADCAST_FILE")
    
    echo "PricingOracle: $PRICING_ORACLE"
    echo "EnergyToken: $ENERGY_TOKEN"
    echo "SmartMeterRegistry: $METER_REGISTRY"
    echo "Marketplace: $MARKETPLACE"
    
    # Update API .env
    cd ../../apps/api
    sed -i '' "s/PRICING_ORACLE_ADDRESS=\".*\"/PRICING_ORACLE_ADDRESS=\"$PRICING_ORACLE\"/" .env
    sed -i '' "s/ENERGY_TOKEN_ADDRESS=\".*\"/ENERGY_TOKEN_ADDRESS=\"$ENERGY_TOKEN\"/" .env
    sed -i '' "s/SMART_METER_REGISTRY_ADDRESS=\".*\"/SMART_METER_REGISTRY_ADDRESS=\"$METER_REGISTRY\"/" .env
    sed -i '' "s/MARKETPLACE_ADDRESS=\".*\"/MARKETPLACE_ADDRESS=\"$MARKETPLACE\"/" .env
    
    echo -e "${GREEN}✓ Contract addresses updated in .env${NC}"
    cd ../..
else
    echo -e "${RED}✗ Could not find broadcast file${NC}"
    exit 1
fi

# Step 4: Update frontend contracts.ts
echo -e "\n${BLUE}Step 4: Updating frontend contract addresses...${NC}"
cat > apps/web/lib/contracts.ts << EOF
import EnergyTokenABI from './abi/EnergyToken.json';
import MarketplaceABI from './abi/Marketplace.json';
import PricingOracleABI from './abi/PricingOracle.json';

// Contract addresses for local Anvil deployment
export const CONTRACTS = {
    EnergyToken: '$ENERGY_TOKEN',
    Marketplace: '$MARKETPLACE',
    PricingOracle: '$PRICING_ORACLE',
    SmartMeterRegistry: '$METER_REGISTRY',
} as const;

// ABIs
export const ABIS = {
    EnergyToken: EnergyTokenABI,
    Marketplace: MarketplaceABI,
    PricingOracle: PricingOracleABI,
};

// Chain configuration
export const CHAIN_ID = 31337; // Anvil local chain
export const RPC_URL = 'http://127.0.0.1:8545';
EOF

echo -e "${GREEN}✓ Frontend contracts updated${NC}"

# Step 5: Database Setup
echo -e "\n${BLUE}Step 5: Setting up database...${NC}"
cd apps/api

# Check if PostgreSQL is running
if pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PostgreSQL is running${NC}"
    
    # Run migrations
    echo "Running Prisma migrations..."
    npx prisma migrate dev --name init
    
    # Generate Prisma client
    echo "Generating Prisma client..."
    npx prisma generate
    
    # Seed database
    echo "Seeding database..."
    npx ts-node prisma/seed.ts
    
    echo -e "${GREEN}✓ Database setup complete${NC}"
else
    echo -e "${RED}✗ PostgreSQL is not running${NC}"
    echo "Please start PostgreSQL with: brew services start postgresql@15"
    echo "Or use Docker: docker-compose up -d"
fi

cd ../..

echo -e "\n${GREEN}🎉 Setup Complete!${NC}"
echo -e "\nNext steps:"
echo -e "1. Start API server: ${BLUE}cd apps/api && npm run dev${NC}"
echo -e "2. Web app is already running at: ${BLUE}http://localhost:3000${NC}"
echo -e "\nUseful commands:"
echo -e "- View Anvil logs: ${BLUE}tail -f logs/anvil.log${NC}"
echo -e "- Stop Anvil: ${BLUE}kill \$(cat logs/anvil.pid)${NC}"
