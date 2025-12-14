---
description: Deploy SunGrid Protocol to Vercel
---

# Deploy to Vercel - Step by Step

## Step 1: Login to Vercel
```bash
vercel login
```
Follow the prompts to authenticate.

## Step 2: Initial Deployment (Preview)

// turbo
```bash
vercel
```

When prompted:
- **Set up and deploy**: `Y`
- **Which scope**: Choose your account
- **Link to existing project**: `N`
- **Project name**: `sungrid-protocol` (or your choice)
- **In which directory is your code located**: `./`
- **Want to override settings**: `N`

This will create a preview deployment.

## Step 3: Check the Deployment

After deployment completes, you'll get a URL like: `https://sungrid-protocol-xxx.vercel.app`

⚠️ **Note**: The app may not work properly yet because it's still pointing to local Anvil blockchain.

## Step 4: Add Environment Variables

You have two options:

### Option A: For Demo/UI Preview (No Blockchain Functionality)

```bash
vercel env add NEXT_PUBLIC_CHAIN_ID production
# Enter: 11155111

vercel env add NEXT_PUBLIC_RPC_URL production  
# Enter: https://rpc.sepolia.org

vercel env add NEXT_PUBLIC_ENERGY_TOKEN_ADDRESS production
# Enter: 0x0000000000000000000000000000000000000000

vercel env add NEXT_PUBLIC_MARKETPLACE_ADDRESS production
# Enter: 0x0000000000000000000000000000000000000000

vercel env add NEXT_PUBLIC_PRICING_ORACLE_ADDRESS production
# Enter: 0x0000000000000000000000000000000000000000

vercel env add NEXT_PUBLIC_CHAINLINK_ORACLE_ADDRESS production
# Enter: 0x0000000000000000000000000000000000000000
```

### Option B: For Full Functionality (Requires Contract Deployment)

First deploy contracts to Sepolia testnet, then:

```bash
vercel env add NEXT_PUBLIC_CHAIN_ID production
# Enter: 11155111

vercel env add NEXT_PUBLIC_RPC_URL production
# Enter: https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

vercel env add NEXT_PUBLIC_ENERGY_TOKEN_ADDRESS production
# Enter: <your deployed EnergyToken address>

vercel env add NEXT_PUBLIC_MARKETPLACE_ADDRESS production
# Enter: <your deployed Marketplace address>

vercel env add NEXT_PUBLIC_PRICING_ORACLE_ADDRESS production
# Enter: <your deployed PricingOracle address>

vercel env add NEXT_PUBLIC_CHAINLINK_ORACLE_ADDRESS production
# Enter: <your deployed ChainlinkOracle address>
```

## Step 5: Deploy to Production

// turbo
```bash
vercel --prod
```

This will create a production deployment with your environment variables.

## Step 6: Verify Deployment

Visit your production URL and test:
- [ ] Website loads correctly
- [ ] UI displays properly
- [ ] Dark mode works
- [ ] Wallet connection (if using Option B)
- [ ] Marketplace displays
- [ ] Transactions work (if using Option B)

## Additional Commands

```bash
# View deployments
vercel ls

# View environment variables
vercel env ls

# Remove a deployment
vercel rm <deployment-url>

# Pull environment variables locally
vercel env pull

# View logs
vercel logs <deployment-url>
```

## Troubleshooting

### Build Fails
- Check build logs: `vercel logs <deployment-url>`
- Ensure all dependencies are in package.json
- Check Next.js version compatibility

### Environment Variables Not Working
- Make sure you selected "production" environment when adding
- Redeploy after adding env vars: `vercel --prod`
- Check spelling and values

### Wallet Connection Issues
- Ensure RPC_URL is accessible from browsers
- Check CHAIN_ID matches your RPC network
- Verify contract addresses are correct

## Notes

- First run creates a preview deployment
- `vercel --prod` deploys to production domain
- Environment variables must be set before production deployment
- You can update env vars in Vercel dashboard: https://vercel.com/dashboard
