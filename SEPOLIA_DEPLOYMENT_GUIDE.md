# 🚀 Sepolia Testnet Deployment Guide

## Prerequisites

Before deploying, you need:
1. ✅ Foundry installed
2. ⚠️  Alchemy or Infura RPC URL
3. ⚠️  Private key with Sepolia ETH
4. ⚠️  Etherscan API key (optional, for verification)

## Step 1: Get Alchemy RPC URL

### Option A: Alchemy (Recommended)

1. **Visit**: https://alchemy.com
2. **Sign up** for free account
3. **Create a new app**:
   - App name: `SunGrid Protocol`
   - Chain: `Ethereum`
   - Network: `Ethereum Sepolia`
4. **Copy your API Key** from the dashboard
5. **Your RPC URL will be**:
   ```
   https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   ```

### Option B: Infura

1. **Visit**: https://infura.io
2. **Sign up** for free account
3. **Create new project**: `SunGrid Protocol`
4. **Select**: Ethereum → Sepolia
5. **Copy your endpoint**:
   ```
   https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   ```

## Step 2: Get Sepolia Testnet ETH

You need Sepolia ETH to deploy contracts (gas fees).

**Faucets**:
1. **Alchemy Sepolia Faucet**: https://sepoliafaucet.com/
2. **Infura Sepolia Faucet**: https://www.infura.io/faucet/sepolia
3. **QuickNode Faucet**: https://faucet.quicknode.com/ethereum/sepolia

**Amount needed**: ~0.1 Sepolia ETH (should be enough for all deployments)

## Step 3: Setup Environment Variables

Create or update `.env` file in `packages/contracts/`:

```bash
cd packages/contracts
```

Create `.env` file:

```env
# Private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Sepolia RPC URL
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Optional: Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key
```

⚠️ **IMPORTANT**: 
- Never commit your `.env` file
- Never share your private key
- Use a test wallet, not your main wallet

## Step 4: Update Foundry Config

Update `foundry.toml` to use your Sepolia RPC:

```toml
[rpc_endpoints]
local = "http://127.0.0.1:8545"
sepolia = "${SEPOLIA_RPC_URL}"
```

## Step 5: Deploy to Sepolia

Run the deployment script:

```bash
# Make sure you're in packages/contracts
cd packages/contracts

# Deploy to Sepolia
forge script script/DeployWithChainlink.s.sol:DeployWithChainlink \
    --rpc-url sepolia \
    --broadcast \
    --verify \
    -vvvv
```

**What this does**:
- `--rpc-url sepolia`: Uses Sepolia network
- `--broadcast`: Actually sends transactions
- `--verify`: Verifies contracts on Etherscan (optional)
- `-vvvv`: Verbose output for debugging

## Step 6: Save Contract Addresses

After deployment completes, you'll see output like:

```
=== DEPLOYMENT SUMMARY ===
Network Chain ID: 11155111
Network: Ethereum Sepolia

Core Contracts:
- EnergyToken: 0xAbC...123
- Marketplace: 0xDeF...456
- PricingOracle: 0x123...789
- SmartMeterRegistry: 0x456...abc
- ChainlinkEnergyOracle: 0x789...def

Chainlink Price Feeds:
- ETH/USD: 0x694AA1769357215DE4FAC081bf1f309aDC325306
- USDC/USD: 0xA2F78ab2355fe2f98ebD1664360953E6a60f164c
=========================
```

**SAVE THESE ADDRESSES!** You'll need them for:
1. Vercel environment variables
2. Frontend configuration
3. Future interactions

The addresses will also be saved to `deployments.json`.

## Step 7: Verify Deployment

Check your contracts on Sepolia Etherscan:

```
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
```

You should see:
- ✅ Contract creation transaction
- ✅ Contract code (if verified)
- ✅ Constructor arguments

## Troubleshooting

### "Insufficient funds for gas"
- Get more Sepolia ETH from faucets
- Check your wallet has funds: `cast balance YOUR_ADDRESS --rpc-url sepolia`

### "Failed to get EIP-1559 fees"
- Add `--legacy` flag to use legacy gas pricing
- Or wait and retry (network might be congested)

### "Script failed"
- Check your PRIVATE_KEY is correct (no 0x prefix)
- Ensure SEPOLIA_RPC_URL is accessible
- Try with `-vvvv` flag for detailed logs

### "Contract verification failed"
- Verification can fail but deployment succeeds
- You can verify manually later on Etherscan
- Not critical for functionality

## Next Steps

After successful deployment:
1. ✅ Save all contract addresses
2. ✅ Configure Vercel environment variables
3. ✅ Update frontend configuration
4. ✅ Deploy to Vercel
5. ✅ Test the production application

## Alternative: Deploy to Base Sepolia

If you prefer Base Sepolia (cheaper gas):

1. **Get Base Sepolia RPC**: 
   - Alchemy: Create app on "Base Sepolia"
   - Or use public: `https://sepolia.base.org`

2. **Get Base Sepolia ETH**:
   - Bridge: https://bridge.base.org/
   - Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

3. **Deploy**:
   ```bash
   forge script script/DeployWithChainlink.s.sol:DeployWithChainlink \
       --rpc-url baseSepolia \
       --broadcast \
       -vvvv
   ```

Your deployment script already supports Base Sepolia!
