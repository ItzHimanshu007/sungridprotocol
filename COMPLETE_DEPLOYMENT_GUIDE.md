# 🚀 Complete Deployment Guide: Sepolia → Vercel

This guide will walk you through the complete deployment process for SunGrid Protocol.

## Overview

1. Get Alchemy RPC URL ⏱️ 5 minutes
2. Get Sepolia testnet ETH ⏱️ 2-10 minutes  
3. Configure environment variables ⏱️ 2 minutes
4. Deploy contracts to Sepolia ⏱️ 5-10 minutes
5. Deploy frontend to Vercel ⏱️ 3-5 minutes

**Total time: ~20-30 minutes**

---

## Part 1: Setup (Do this first)

### Step 1: Get Alchemy RPC URL

1. Go to **https://alchemy.com**
2. Click "Sign Up" (or "Login" if you have an account)
3. Click "Create New App" (or "+ Create App")
4. Fill in:
   - **App Name**: `SunGrid Protocol`
   - **Chain**: `Ethereum`
   - **Network**: `Ethereum Sepolia`
5. Click "Create App"
6. Click "View Key" on your new app
7. Copy the **HTTPS** URL (looks like: `https://eth-sepolia.g.alchemy.com/v2/abc123...`)

✅ **Save this URL** - you'll need it in Step 3

### Step 2: Get Sepolia Testnet ETH

You need ~0.1 Sepolia ETH to deploy contracts.

1. **Alchemy Faucet** (Easiest - requires Alchemy account):
   - Go to: https://sepoliafaucet.com/
   - Login with your Alchemy account
   - Enter your wallet address
   - Request 0.5 ETH
   - Wait 1-2 minutes

2. **Alternative Faucets** (if Alchemy faucet doesn't work):
   - Infura: https://www.infura.io/faucet/sepolia
   - QuickNode: https://faucet.quicknode.com/ethereum/sepolia

✅ **Verify**: Use Etherscan to confirm you received the ETH:
```
https://sepolia.etherscan.io/address/YOUR_WALLET_ADDRESS
```

### Step 3: Configure Environment Variables

1. **Navigate to contracts directory**:
   ```bash
   cd packages/contracts
   ```

2. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

3. **Edit the .env file**:
   ```bash
   nano .env  # or use any text editor
   ```

4. **Fill in your values**:
   ```env
   # Your wallet private key (NEVER share this!)
   # Get from MetaMask: Account Details → Show Private Key
   PRIVATE_KEY=your_private_key_here_without_0x

   # Your Alchemy RPC URL from Step 1
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

   # Optional: Get from https://etherscan.io/myapikey
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

5. **Save and close** (Ctrl+X, then Y, then Enter if using nano)

⚠️ **CRITICAL SECURITY NOTES**:
- Use a **test wallet only** (not your main wallet)
- Never commit the `.env` file to git
- Never share your private key with anyone

---

## Part 2: Deploy Contracts to Sepolia

### Option A: Automated Deployment (Recommended)

We've created a script that handles everything automatically:

```bash
# Make sure you're in packages/contracts
cd packages/contracts

# Run the deployment script
./deploy-sepolia.sh
```

The script will:
- ✅ Check your balance
- ✅ Build contracts
- ✅ Deploy to Sepolia
- ✅ Verify on Etherscan
- ✅ Save contract addresses
- ✅ Generate environment variables for Vercel

**Save the output!** You'll see something like:

```
Environment Variables for Vercel:
==================================
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/...
NEXT_PUBLIC_ENERGY_TOKEN_ADDRESS=0xAbC...123
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0xDeF...456
NEXT_PUBLIC_PRICING_ORACLE_ADDRESS=0x123...789
NEXT_PUBLIC_CHAINLINK_ORACLE_ADDRESS=0x456...abc
```

✅ **Copy these values** - you'll need them for Vercel!

The script also saves them to `deployment-env-vars.txt` for easy reference.

### Option B: Manual Deployment

If the script doesn't work, run manually:

```bash
cd packages/contracts

# Build
forge build

# Deploy
forge script script/DeployWithChainlink.s.sol:DeployWithChainlink \
    --rpc-url sepolia \
    --broadcast \
    --verify \
    -vvv
```

Then check `deployments.json` for contract addresses.

---

## Part 3: Deploy to Vercel

### Step 1: Login to Vercel

```bash
# From the project root
cd /Users/himanshujasoriya/Desktop/himanshucodes101/unstopable_lnmiit/sungrid-protocol

# Login (opens browser)
vercel login
```

Follow the prompts to authenticate.

### Step 2: Initial Deployment

```bash
# Deploy (preview)
vercel
```

Answer the prompts:
- **Set up and deploy?** `Y`
- **Which scope?** Select your account
- **Link to existing project?** `N`
- **Project name?** `sungrid-protocol` (or whatever you prefer)
- **In which directory?** `./`
- **Override settings?** `N`

Wait for deployment to complete. You'll get a preview URL like:
```
https://sungrid-protocol-xxx.vercel.app
```

⚠️ **The app won't work yet** - we need to add environment variables!

### Step 3: Add Environment Variables to Vercel

Use the values from your Sepolia deployment (Part 2):

```bash
# Add each environment variable
vercel env add NEXT_PUBLIC_CHAIN_ID production
# Enter: 11155111

vercel env add NEXT_PUBLIC_RPC_URL production
# Enter: https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

vercel env add NEXT_PUBLIC_ENERGY_TOKEN_ADDRESS production
# Enter: 0x... (from deployment output)

vercel env add NEXT_PUBLIC_MARKETPLACE_ADDRESS production
# Enter: 0x... (from deployment output)

vercel env add NEXT_PUBLIC_PRICING_ORACLE_ADDRESS production
# Enter: 0x... (from deployment output)

vercel env add NEXT_PUBLIC_CHAINLINK_ORACLE_ADDRESS production
# Enter: 0x... (from deployment output)
```

**Tip**: If you saved `deployment-env-vars.txt`, you can copy/paste from there!

### Step 4: Deploy to Production

```bash
vercel --prod
```

This deploys to production with all your environment variables.

You'll get a production URL like:
```
https://sungrid-protocol.vercel.app
```

---

## Part 4: Verify Everything Works

### 1. Check Contract Deployment

Visit Sepolia Etherscan:
```
https://sepolia.etherscan.io/address/YOUR_ENERGY_TOKEN_ADDRESS
```

You should see:
- ✅ Contract creation transaction
- ✅ Verified contract code (green checkmark)
- ✅ Contract name: "EnergyToken"

Repeat for all contracts.

### 2. Check Vercel Deployment

Visit your production URL and test:

- [ ] Website loads without errors
- [ ] UI displays correctly
- [ ] Dark mode toggle works
- [ ] Connect wallet button appears
- [ ] Can connect MetaMask (switch to Sepolia network)
- [ ] Marketplace displays
- [ ] Can create listings
- [ ] Can purchase energy
- [ ] Transactions go through on Sepolia

### 3. Test a Complete Transaction Flow

1. **Connect wallet** (make sure you're on Sepolia network)
2. **Create a listing**:
   - Go to "Create Listing"
   - Fill in details
   - Submit transaction
   - Wait for confirmation
3. **View in marketplace**:
   - Your listing should appear
   - Other users can see it
4. **Purchase energy** (switch to another wallet or have someone test):
   - Find listing in marketplace
   - Click "Buy"
   - Approve transaction
   - Verify ownership

---

## Troubleshooting

### Contract Deployment Issues

**"Insufficient funds"**
- Get more Sepolia ETH from faucets
- Check balance: `cast balance YOUR_ADDRESS --rpc-url sepolia`

**"RPC error" or "timeout"**
- Check your SEPOLIA_RPC_URL in `.env`
- Make sure you're using your Alchemy URL, not the public one
- Try again - sometimes networks are congested

**"Verification failed"**
- Deployment still works even if verification fails
- You can verify manually on Etherscan later
- Add ETHERSCAN_API_KEY to `.env` and try again

### Vercel Deployment Issues

**"Build failed"**
- Check the build logs in Vercel dashboard
- Make sure all dependencies are in package.json
- Try building locally: `cd apps/web && npm run build`

**"Environment variables not working"**
- Make sure you selected "production" when adding env vars
- Redeploy after adding: `vercel --prod`
- Check Vercel dashboard → Settings → Environment Variables

**"Wallet won't connect"**
- Make sure you're on Sepolia network in MetaMask
- Check NEXT_PUBLIC_RPC_URL is correct
- Clear browser cache and try again

**"Transactions fail"**
- Verify contract addresses are correct
- Make sure you have Sepolia ETH
- Check contract on Etherscan for errors

---

## Next Steps

After successful deployment:

1. **Custom Domain** (Optional):
   - Go to Vercel dashboard
   - Settings → Domains
   - Add your custom domain

2. **Monitor Performance**:
   - Vercel Analytics: https://vercel.com/analytics
   - Check transaction history on Etherscan

3. **Seed Marketplace** (Optional):
   - Add sample listings for testing
   - Use the seeding scripts in `scripts/`

4. **Share with Users**:
   - Share your Vercel URL
   - Provide instructions to switch to Sepolia network
   - Create user documentation

---

## Summary Checklist

- [ ] Get Alchemy RPC URL
- [ ] Get Sepolia testnet ETH (0.1+)
- [ ] Configure `.env` in `packages/contracts/`
- [ ] Deploy contracts: `./deploy-sepolia.sh`
- [ ] Save contract addresses
- [ ] Login to Vercel: `vercel login`
- [ ] Initial deploy: `vercel`
- [ ] Add environment variables to Vercel
- [ ] Production deploy: `vercel --prod`
- [ ] Test complete transaction flow
- [ ] Share with users!

---

## Resources

- **Alchemy**: https://alchemy.com
- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Sepolia Etherscan**: https://sepolia.etherscan.io/
- **Vercel Docs**: https://vercel.com/docs
- **Foundry Docs**: https://book.getfoundry.sh/

---

**Need help?** Check the troubleshooting section or review the detailed guides:
- `SEPOLIA_DEPLOYMENT_GUIDE.md` - Detailed Sepolia deployment
- `VERCEL_DEPLOYMENT.md` - Detailed Vercel deployment
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment requirements
