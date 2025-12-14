# 🎯 Quick Deployment Commands

## You are here: Ready to deploy! ✅

Vercel CLI is installed and you're logged in.

---

## Next: Choose Your Path

### Path A: I DON'T have Sepolia contracts deployed yet

**Follow these steps in order:**

1. **Get Alchemy RPC URL** (5 min)
   - Go to https://alchemy.com
   - Create account → Create App (Ethereum Sepolia)
   - Copy HTTPS URL

2. **Get Sepolia ETH** (2-10 min)
   - https://sepoliafaucet.com/
   - Request 0.5 ETH to your wallet

3. **Configure .env** (2 min)
   ```bash
   cd packages/contracts
   cp .env.example .env
   nano .env  # Add your PRIVATE_KEY and SEPOLIA_RPC_URL
   ```

4. **Deploy contracts** (5-10 min)
   ```bash
   cd packages/contracts
   ./deploy-sepolia.sh
   ```
   
   **⚠️ SAVE THE CONTRACT ADDRESSES!**

5. **Deploy to Vercel** (5 min)
   ```bash
   cd ../../  # Back to project root
   vercel     # Preview deployment
   
   # Add environment variables (from deployment output)
   vercel env add NEXT_PUBLIC_CHAIN_ID production
   vercel env add NEXT_PUBLIC_RPC_URL production
   vercel env add NEXT_PUBLIC_ENERGY_TOKEN_ADDRESS production
   vercel env add NEXT_PUBLIC_MARKETPLACE_ADDRESS production
   vercel env add NEXT_PUBLIC_PRICING_ORACLE_ADDRESS production
   vercel env add NEXT_PUBLIC_CHAINLINK_ORACLE_ADDRESS production
   
   vercel --prod  # Production deployment
   ```

**📖 Detailed guide:** Open `COMPLETE_DEPLOYMENT_GUIDE.md`

---

### Path B: I ALREADY have Sepolia contracts deployed

If you already deployed contracts and have the addresses:

```bash
# Make sure you're in project root
cd /Users/himanshujasoriya/Desktop/himanshucodes101/unstopable_lnmiit/sungrid-protocol

# Deploy to Vercel (preview)
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_CHAIN_ID production
# Enter: 11155111

vercel env add NEXT_PUBLIC_RPC_URL production
# Enter: your Alchemy/Infura Sepolia RPC URL

vercel env add NEXT_PUBLIC_ENERGY_TOKEN_ADDRESS production
# Enter: your deployed EnergyToken address

vercel env add NEXT_PUBLIC_MARKETPLACE_ADDRESS production
# Enter: your deployed Marketplace address

vercel env add NEXT_PUBLIC_PRICING_ORACLE_ADDRESS production
# Enter: your deployed PricingOracle address

vercel env add NEXT_PUBLIC_CHAINLINK_ORACLE_ADDRESS production
# Enter: your deployed ChainlinkOracle address

# Deploy to production
vercel --prod
```

---

## Important Files

- **`COMPLETE_DEPLOYMENT_GUIDE.md`** - Full step-by-step guide (START HERE)
- **`SEPOLIA_DEPLOYMENT_GUIDE.md`** - Detailed contract deployment
- **`VERCEL_DEPLOYMENT.md`** - Detailed Vercel deployment
- **`packages/contracts/deploy-sepolia.sh`** - Automated deployment script
- **`packages/contracts/.env.example`** - Environment variable template

---

## Quick Verification

After deployment, verify:

1. **Contracts on Etherscan**:
   ```
   https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
   ```

2. **Vercel deployment**:
   - Visit your production URL
   - Connect wallet (switch to Sepolia network)
   - Test creating a listing

---

## Common Issues

**"Insufficient funds"** → Get more Sepolia ETH from https://sepoliafaucet.com/

**"Build failed"** → Check Vercel build logs, ensure all dependencies in package.json

**"Wallet won't connect"** → Switch to Sepolia network in MetaMask

**"Transactions fail"** → Verify contract addresses, ensure you have Sepolia ETH

---

## Support Resources

- Alchemy: https://alchemy.com
- Sepolia Faucet: https://sepoliafaucet.com/
- Sepolia Etherscan: https://sepolia.etherscan.io/
- Vercel Dashboard: https://vercel.com/dashboard

---

**Ready to start?** Open `COMPLETE_DEPLOYMENT_GUIDE.md` for the full walkthrough!
