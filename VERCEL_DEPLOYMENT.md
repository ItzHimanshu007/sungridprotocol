# Vercel Deployment Guide for SunGrid Protocol

## Prerequisites
1. Vercel CLI installed (`npm install -g vercel`)
2. Vercel account (sign up at https://vercel.com)
3. Contract addresses deployed to a testnet (Sepolia) or mainnet

## Important Notes on Blockchain Connectivity

⚠️ **Critical**: Your application currently uses a local Anvil blockchain. For production deployment:

1. **You need to deploy contracts to a public testnet (Sepolia) or mainnet**
2. **Update the RPC URL** to point to a public provider (Alchemy, Infura, etc.)
3. **Update contract addresses** in environment variables

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from the project root**:
   ```bash
   cd /Users/himanshujasoriya/Desktop/himanshucodes101/unstopable_lnmiit/sungrid-protocol
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - Project name: sungrid-protocol (or your preference)
   - In which directory is your code located: ./
   - Override settings: No

5. **Add Environment Variables** (after initial deployment):
   ```bash
   # Add production environment variables
   vercel env add NEXT_PUBLIC_CHAIN_ID
   # Enter value: 11155111 (for Sepolia testnet)
   
   vercel env add NEXT_PUBLIC_RPC_URL
   # Enter your public RPC URL (e.g., https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY)
   
   vercel env add NEXT_PUBLIC_ENERGY_TOKEN_ADDRESS
   # Enter your deployed EnergyToken contract address
   
   vercel env add NEXT_PUBLIC_MARKETPLACE_ADDRESS
   # Enter your deployed Marketplace contract address
   
   vercel env add NEXT_PUBLIC_PRICING_ORACLE_ADDRESS
   # Enter your deployed PricingOracle contract address
   
   vercel env add NEXT_PUBLIC_CHAINLINK_ORACLE_ADDRESS
   # Enter your deployed ChainlinkOracle contract address
   ```

6. **Redeploy with environment variables**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Go to** https://vercel.com/new

2. **Import your Git repository**:
   - Connect your GitHub/GitLab/Bitbucket account
   - Select the repository containing this project

3. **Configure Project**:
   - Framework Preset: Next.js
   - Root Directory: `./` (leave as is)
   - Build Command: (leave default, vercel.json will handle it)
   - Output Directory: (leave default)

4. **Add Environment Variables** in the dashboard:
   ```
   NEXT_PUBLIC_CHAIN_ID=11155111
   NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   NEXT_PUBLIC_ENERGY_TOKEN_ADDRESS=0xYourDeployedAddress
   NEXT_PUBLIC_MARKETPLACE_ADDRESS=0xYourDeployedAddress
   NEXT_PUBLIC_PRICING_ORACLE_ADDRESS=0xYourDeployedAddress
   NEXT_PUBLIC_CHAINLINK_ORACLE_ADDRESS=0xYourDeployedAddress
   ```

5. **Click Deploy**

## Before Deploying - Deploy Smart Contracts

You need to deploy your smart contracts to a public network first:

1. **Get Testnet ETH** (for Sepolia):
   - Visit https://sepoliafaucet.com/
   - Get free testnet ETH

2. **Set up deployment wallet**:
   - Create a `.env` file in `packages/contracts/` (if not exists)
   - Add your private key:
     ```
     PRIVATE_KEY=your_private_key_here
     SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
     ```

3. **Deploy contracts**:
   ```bash
   cd packages/contracts
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. **Save the deployed contract addresses** - you'll need them for Vercel environment variables

## Post-Deployment Checklist

- [ ] Contracts deployed to public network (Sepolia/Mainnet)
- [ ] Environment variables set in Vercel
- [ ] Application deployed and accessible
- [ ] Wallet connection working (test with MetaMask)
- [ ] Contract interactions working
- [ ] Custom domain configured (optional)

## Troubleshooting

### Build Fails
- Check that all dependencies in package.json are correct
- Ensure Node version is compatible (check vercel.json for Node version)
- Check build logs in Vercel dashboard

### Blockchain Connection Issues
- Verify RPC URL is accessible from Vercel servers
- Check that contract addresses are correct
- Ensure environment variables are set for production environment

### Missing Leaflet CSS
If you see map styling issues:
- Ensure leaflet CSS is imported in your layout or page component
- Check that public assets are being served correctly

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Hardhat Deployment](https://hardhat.org/guides/deploying.html)
