# 🚀 Marketplace Quick Start Guide

## ✅ System Status

Your **SunGrid Protocol** is now fully configured and ready to use!

### Currently Running:
- ✅ **Anvil Blockchain**: `http://localhost:8545` (Chain ID: 31337)
- ✅ **Frontend**: `http://localhost:3000`
- ✅ **Smart Contracts**: Deployed with new getListingCounter() function
- ✅ **ABIs**: Updated in frontend

---

## 🎯 How to Test the Marketplace (Step by Step)

### Step 1: Connect Wallet to Anvil Network

1. **Open MetaMask** (or your Web3 wallet)
2. **Add Anvil Network**:
   - Network Name: `Anvil Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

3. **Import Test Account**:
   Use one of these Anvil private keys (they have 10,000 ETH each):

   ```
   Account #0 (Deployer/Admin):
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   
   Account #1 (Seller A):
   0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
   
   Account #2 (Seller B):
   0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
   
   Account #3 (Buyer):
   0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6
   ```

   Copy a private key → MetaMask → Import Account → Paste

---

### Step 2: Seed the Marketplace with Sample Data

**Option A: Use the UI**
1. Open: `http://localhost:3000/dashboard?tab=marketplace`
2. Click "Load Sample Data" button
3. Wait 10-15 seconds for transactions to complete
4. Listings will appear!

**Option B: Use API Directly**
```bash
curl -X POST http://localhost:3000/api/seed
```

**What This Does:**
- Registers 2 producers
- Mints energy tokens for them
- Creates 2 active listings:
  - Listing 1: 50 kWh at 0.0001 ETH/kWh (Zone 1)
  - Listing 2: 120 kWh at 0.00015 ETH/kWh (Zone 2)

---

### Step 3: View Listings

1. Navigate to **Dashboard → Marketplace Tab**
2. You should now see listing cards with:
   - Energy amount (kWh)
   - Price per kWh (in ₹ and ETH)
   - Seller address
   - Location/Grid Zone
   - "Buy Now" button

**If you don't see listings:**
- Click the "Refresh" button
- Check browser console for errors
- Verify wallet is connected to Anvil network

---

### Step 4: Create Your Own Listing

1. **Click "Sell Energy"** button (top right of marketplace)
2. **Fill the form:**
   - Energy Amount: `25` kWh
   - Price per kWh: `0.0001` ETH
   - Location: `My Solar Array`
   - Description: `Clean energy from rooftop panels`
   - Upload an image (optional)
   - Duration: `7` days

3. **Click "Prepare Listing"**
4. **Approve 3 transactions** in your wallet:
   - Transaction 1: **Mint Energy Token** (~0.0008 ETH gas)
   - Transaction 2: **Approve Marketplace** (~0.0005 ETH gas)
   - Transaction 3: **Create Listing** (~0.0012 ETH gas)

5. **Success!** Your listing appears in marketplace immediately

**Progress Tracker:**
Watch the right panel for real-time updates:
- ✅ Upload to IPFS
- ✅ Mint Energy Token
- ✅ Approve Marketplace
- ✅ Create Listing

---

### Step 5: Buy Energy

1. **Find a listing** in the marketplace
2. **Click "Buy Now"**
3. **Modal opens** showing:
   - Seller info
   - Available amount
   - Price calculation
   - Gas estimate

4. **Enter amount** to purchase (e.g., `10` kWh)
5. **Review total cost:**
   ```
   Energy Cost:    10 × 0.0001 = 0.001 ETH
   Platform Fee:   1% = 0.00001 ETH
   Gas Estimate:   ~0.00015 ETH
   ───────────────────────────────
   Total:          ~0.00116 ETH ≈ ₹261
   ```

6. **Click "Pay X ETH"**
7. **Confirm transaction** in wallet
8. **Wait for confirmation** (~1-2 seconds on Anvil)
9. **Success!** You now own 10 kWh energy tokens

**Post-Purchase:**
- Order created (status: PENDING)
- Tokens transferred to your wallet
- View in **Portfolio Tab**

---

## 🔄 Real-Time Updates

The marketplace **automatically refreshes** every 5 seconds:
- New listings appear instantly
- Purchased amounts update
- Expired listings removed

**Manual Refresh:**
- Click the "Refresh" button
- Or reload the page

---

## 🎮 All Interactive Buttons Explained

### Marketplace Tab

| Button | Location | What It Does |
|--------|----------|--------------|
| **Sell Energy** | Top right | Opens create listing page |
| **Load Sample Data** | Empty state | Seeds marketplace with 2 listings |
| **Refresh** | Empty state | Reloads listings from blockchain |
| **Buy Now** | On each listing card | Opens purchase modal |
| **Filters** | Top right (filter icon) | Advanced search & filters |

### Create Listing Page

| Button | What It Does |
|--------|--------------|
| **Demo Fill** | Auto-fills form with sample data |
| **Use Market Avg** | Sets price to average rate |
| **Prepare Listing** | Starts minting & listing process |
| **Go to Marketplace** | Returns to marketplace |

### Buy Modal

| Button | What It Does |
|--------|--------------|
| **Max** | Sets amount to maximum available |
| **Pay X ETH** | Confirms purchase transaction |
| **View in Portfolio** | After success, shows your assets |
| **Close** | Closes the modal |

### Analytics Tab

| Component | Interactive Elements |
|-----------|---------------------|
| **Time Filters** | Day / Week / Month / Year buttons |
| **Charts** | Hover for details, tooltips |
| **Summary Cards** | Live stats with trend indicators |

### Portfolio Tab

| Feature | What It Shows |
|---------|--------------|
| **My Listings** | Your active energy sales |
| **My Purchases** | Energy you've bought |
| **My Tokens** | ERC-1155 energy tokens owned |
| **Transaction History** | All your marketplace activity |

---

## 🧪 Testing Checklist

### ✅ Core Functionality

- [ ] Connect wallet to Anvil network
- [ ] Import test account with private key
- [ ] Seed marketplace with sample data
- [ ] See 2 listings appear in marketplace
- [ ] Create new listing (full flow: mint → approve → list)
- [ ] See your new listing in marketplace
- [ ] Buy energy from a listing
- [ ] Confirm transaction completes successfully
- [ ] See updated amounts in marketplace
- [ ] View purchased tokens in Portfolio

### ✅ Real-Time Updates

- [ ] Marketplace auto-refreshes every 5s
- [ ] New listings appear without page reload
- [ ] Purchased amounts update immediately
- [ ] Transaction status updates in real-time

### ✅ UI/UX

- [ ] All buttons are clickable and functional
- [ ] Modals open and close properly
- [ ] Forms validate inputs correctly
- [ ] Toast notifications appear for all actions
- [ ] Loading states show during transactions
- [ ] Smooth animations on page transitions

---

## 🐛 Troubleshooting

### Problem: "No listings found"

**Solutions:**
1. Click "Load Sample Data" button
2. Verify wallet is connected to Anvil (Chain ID 31337)
3. Check that Anvil is running: `ps aux | grep anvil`
4. Open browser console, look for errors
5. Try manual refresh

### Problem: "Transaction failed"

**Check:**
1. Wallet has enough ETH (test accounts have 10,000 ETH)
2. Connected to correct network (Anvil Local)
3. Contract addresses match in `lib/contracts.ts`
4. ABIs are up to date (just copied from contracts)

### Problem: "Buy Now doesn't work"

**Debug:**
1. Open browser console (F12)
2. Click "Buy Now"
3. Check for errors in console
4. Verify listing data is loading
5. Ensure wallet is connected

### Problem: "Wallet not connecting"

**Fix:**
1. Add Anvil network manually in MetaMask
2. Import account with private key
3. Switch to Anvil network in wallet
4. Refresh page
5. Click "Connect Wallet"

---

## 📊 Smart Contract Addresses

Current deployment (Anvil Local):

```typescript
EnergyToken:         0xe7f1725e7734ce288f8367e1bb143e90bb3f0512
Marketplace:         0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9
PricingOracle:       0x5fbdb2315678afecb367f032d93f642f64180aa3
SmartMeterRegistry:  0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0
```

**Note:** These addresses are deterministic on Anvil. If you restart Anvil and redeploy, they'll be the same.

---

## 🎯 Next Steps

Now that everything is working:

1. **Explore the Analytics Tab**
   - View energy production charts
   - See consumption trends
   - Check earnings over time

2. **Test Different Scenarios**
   - Create multiple listings
   - Buy partial amounts
   - Let listings expire
   - Cancel a listing

3. **Check Portfolio**
   - View owned energy tokens
   - See purchase history
   - Track active sales

4. **Experiment with Features**
   - Use advanced filters
   - Try search functionality
   - Test distance slider
   - Sort by different criteria

---

## 🚀 Production Deployment

When ready for real deployment:

1. **Deploy to testnet** (Sepolia, Mumbai)
2. **Update contract addresses** in `lib/contracts.ts`
3. **Configure IPFS** with Pinata or Infura
4. **Set up environment variables**
5. **Test thoroughly** on testnet
6. **Deploy frontend** to Vercel/IPFS
7. **Launch on mainnet** (Base, Optimism recommended for low fees)

---

## 📞 Quick Commands

```bash
# Check if Anvil is running
ps aux | grep anvil

# Restart Anvil (in sungrid-protocol directory)
anvil --block-time 1

# Restart Frontend
cd apps/web && npm run dev

# Seed Marketplace
curl -X POST http://localhost:3000/api/seed

# View logs
# Frontend: check terminal running npm run dev
# Blockchain: check terminal running anvil
```

---

**🎉 Your SunGrid marketplace is fully operational!**

**Try it now:** `http://localhost:3000/dashboard?tab=marketplace`

---

*Last Updated: 2025-12-14*
*Version: 1.0.0*
