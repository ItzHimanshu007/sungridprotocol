# 🚨 CRITICAL: Pre-Deployment Checklist

## Current Status
Your application is configured for LOCAL DEVELOPMENT with Anvil blockchain.

## ⚠️ Before Deploying to Vercel

### Option A: Deploy with Testnet (Recommended for Testing)

1. **Get a Sepolia RPC URL:**
   - Sign up at https://alchemy.com or https://infura.io
   - Create a new app for Sepolia testnet
   - Copy your API URL (e.g., `https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY`)

2. **Get Sepolia testnet ETH:**
   - Visit https://sepoliafaucet.com/
   - Fund your wallet with test ETH

3. **Deploy contracts to Sepolia:**
   - Update `packages/contracts/.env` with your Sepolia RPC URL
   - Deploy: `cd packages/contracts && npx hardhat run scripts/deploy.js --network sepolia`
   - Save all contract addresses

4. **Deploy to Vercel with environment variables:**
   ```bash
   vercel --prod
   ```
   Then add these environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_CHAIN_ID=11155111`
   - `NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY`
   - `NEXT_PUBLIC_ENERGY_TOKEN_ADDRESS=<deployed address>`
   - `NEXT_PUBLIC_MARKETPLACE_ADDRESS=<deployed address>`
   - `NEXT_PUBLIC_PRICING_ORACLE_ADDRESS=<deployed address>`
   - `NEXT_PUBLIC_CHAINLINK_ORACLE_ADDRESS=<deployed address>`

### Option B: Deploy Demo Version (Read-Only)

If you want to deploy a demo version that shows the UI but doesn't interact with blockchain:

1. Set environment variables to use Sepolia mainnet (read-only):
   ```
   NEXT_PUBLIC_CHAIN_ID=11155111
   NEXT_PUBLIC_RPC_URL=https://rpc.sepolia.org
   NEXT_PUBLIC_ENERGY_TOKEN_ADDRESS=0x0000000000000000000000000000000000000000
   NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x0000000000000000000000000000000000000000
   ```

2. Deploy: `vercel --prod`

This will show a non-functional demo (wallet connection will fail)

### Option C: Use Localhost RPC (NOT RECOMMENDED)

⚠️ This won't work because Vercel servers can't access your local Anvil instance.

## Next Steps

Choose your deployment strategy and I'll help you execute it!

## Quick Commands Reference

```bash
# Login to Vercel
vercel login

# Deploy (you'll be prompted for configuration)
vercel

# Deploy to production
vercel --prod

# Add environment variable
vercel env add VARIABLE_NAME

# List deployments
vercel ls

# Remove deployment
vercel rm deployment-url
```
