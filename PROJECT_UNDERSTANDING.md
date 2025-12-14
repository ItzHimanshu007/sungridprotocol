# 🌞 SunGrid Protocol - Complete Project Understanding

## 📋 Project Overview

**SunGrid Protocol** is a **fully decentralized peer-to-peer energy trading platform** built on blockchain technology. It enables solar energy producers to directly sell their excess energy to consumers without intermediaries, creating a transparent and efficient renewable energy marketplace.

---

## 🏗️ Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js App)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Dashboard   │  │ Marketplace  │  │Create Listing│          │
│  │  Analytics   │  │  Buy/Sell    │  │   Minting    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BLOCKCHAIN LAYER (Anvil)                      │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │ EnergyToken    │  │  Marketplace   │  │ PricingOracle    │  │
│  │   (ERC-1155)   │  │  Smart Contract│  │ SmartMeterReg    │  │
│  └────────────────┘  └────────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                  ┌────────────────────────┐
                  │   IPFS (Metadata)      │
                  │   - Images             │
                  │   - Descriptions       │
                  └────────────────────────┘
```

---

## 🔐 Smart Contracts

### 1. **EnergyToken.sol** (ERC-1155)
- **Purpose**: Represents energy credits as tokens (1 token = 1 kWh)
- **Key Features**:
  - Mint energy tokens for verified producers
  - Burn tokens when energy is consumed
  - Track producer reputation and stats
  - Support IPFS metadata URIs
- **Roles**:
  - `ADMIN_ROLE`: Contract admin
  - `ORACLE_ROLE`: Can mint tokens (for verified production)
  - `MARKETPLACE_ROLE`: Can update reputation

**Key Functions**:
```solidity
mintEnergy(producer, kWhAmount, gridZone, tokenURI) → tokenId
consumeEnergy(tokenId, amount)
registerProducer(producer, meterId)
isVerifiedProducer(producer) → bool
```

### 2. **Marketplace.sol**
- **Purpose**: P2P marketplace for energy trading
- **Key Features**:
  - Create energy listings with expiry
  - Purchase energy directly from sellers
  - Escrowed transactions (marketplace holds tokens)
  - Dynamic pricing integration
  - Dispute resolution system
  
**Key Functions**:
```solidity
createListing(tokenId, kWhAmount, pricePerKwh, duration) → listingId
purchaseEnergy(listingId, kWhAmount) payable → orderId
cancelListing(listingId)
confirmDelivery(orderId) // Oracle
completeOrder(orderId)
```

**Order Lifecycle**:
```
PENDING → DELIVERED → COMPLETED
          ↓
       DISPUTED → REFUNDED
```

### 3. **PricingOracle.sol**
- **Purpose**: Dynamic pricing based on supply/demand
- **Features**:
  - Base price modulation
  - Grid zone-specific multipliers
  - Time-based pricing (peak/off-peak)
  - Supply/demand factors

### 4. **SmartMeterRegistry.sol**
- **Purpose**: Register and verify smart meters
- **Features**:
  - Cryptographic proof of energy generation
  - Meter authentication
  - Reading verification

---

## 📦 Frontend Application

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom Animations
- **UI Components**: shadcn/ui + Radix UI
- **Web3**: Wagmi + RainbowKit + Viem
- **State Management**: TanStack Query (React Query)
- **Charts**: Recharts
- **Maps**: Leaflet + React-Leaflet
- **IPFS**: ipfs-http-client

### Project Structure
```
apps/web/
├── app/
│   ├── (dashboard)/                  # Protected routes
│   │   ├── create-listing/          # Create energy listing
│   │   │   └── page.tsx            # Full minting & listing flow
│   │   ├── dashboard/              # Main dashboard
│   │   │   └── page.tsx           # 3 tabs: Overview, Analytics, Marketplace
│   │   └── settings/              # User settings
│   ├── api/                       # Next.js API routes
│   │   ├── seed/                  # Seed marketplace with sample data
│   │   ├── faucet/               # Get test ETH
│   │   └── listings/             # (optional indexing layer)
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx               # Root layout
│   ├── providers.tsx            # Web3 + Theme providers
│   └── globals.css            # Global styles + animations
│
├── components/
│   ├── dashboard/              # Dashboard widgets
│   │   ├── EnhancedMarketplace.tsx     # Main marketplace component
│   │   ├── AdvancedAnalyticsDashboard.tsx
│   │   ├── EnergyFlowVisualization.tsx
│   │   ├── LeaderboardPanel.tsx
│   │   └── ... (16 components)
│   ├── marketplace/
│   │   ├── BuyEnergyModal.tsx        # Purchase modal with wallet integration
│   │   ├── AdvancedFilters.tsx       # Search & filter listings
│   │   └── ListingCard.tsx
│   ├── layout/
│   │   └── Sidebar.tsx               # Navigation sidebar
│   └── ui/                           # shadcn components
│
├── hooks/                            # Custom React hooks
│   ├── useBlockchainListings.ts    # Read listings from blockchain
│   ├── useMarketplace.ts          # Purchase/create/cancel operations
│   ├── useEnergyToken.ts         # Token interactions
│   └── useMarketData.ts         # Market statistics
│
├── lib/
│   ├── contracts.ts             # Contract addresses & ABIs
│   ├── ipfs.ts                 # IPFS upload/fetch utilities
│   ├── currency.ts            # ETH ↔ INR conversion
│   └── abi/                  # Compiled ABIs
│       ├── EnergyToken.json
│       └── Marketplace.json
│
└── package.json
```

---

## 🔄 Complete User Flows

### Flow 1: Create Energy Listing (Sell Energy)

**User Journey**: Producer wants to sell 50 kWh of solar energy

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Navigate to Create Listing                         │
│ - Click "Sell Energy" button in marketplace                │
│ - Or go to /create-listing directly                        │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Fill Form                                          │
│ - Energy Amount: 50 kWh                                   │
│ - Price per kWh: 0.0001 ETH (≈ ₹22.50)                   │
│ - Location: "Jaipur Solar Array"                         │
│ - Description: "High efficiency panels"                   │
│ - Upload proof image (solar panel photo)                 │
│ - Duration: 7 days                                        │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Submit & Wait for Blockchain Confirmation         │
│                                                            │
│ Sub-step 3.1: Upload to IPFS                              │
│   → Image uploaded → ipfs://Qm...abc                      │
│   → Metadata JSON → ipfs://Qm...xyz                       │
│                                                            │
│ Sub-step 3.2: Mint Energy Token (EnergyToken.sol)        │
│   → Call: mintEnergy(address, 50e18, zone=1, ipfs://...)  │
│   → Wallet prompts: "Confirm Transaction"                │
│   → Transaction hash: 0x1234...                          │
│   → Result: Token ID = 7                                 │
│                                                            │
│ Sub-step 3.3: Approve Marketplace                         │
│   → Call: setApprovalForAll(Marketplace, true)           │
│   → Authorizes marketplace to transfer tokens            │
│                                                            │
│ Sub-step 3.4: Create Listing (Marketplace.sol)           │
│   → Call: createListing(tokenId=7, 50e18, 0.0001e18, 7d)│
│   → Listing ID = 3                                        │
│   → Tokens escrowed in marketplace contract              │
│                                                            │
│ ✅ Success! Listing created                               │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
            Redirected to Marketplace Tab
             Listing appears instantly!
```

**Technical Details**:
- **Gas Cost**: ~0.0025 ETH (3 transactions)
- **Token Standard**: ERC-1155 (enables fractional sales)
- **Storage**: IPFS (decentralized, permanent)
- **Expiry**: Automatic after 7 days (on-chain timestamp)

---

### Flow 2: Purchase Energy (Buy Energy)

**User Journey**: Consumer wants to buy 20 kWh from a listing

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Browse Marketplace                                 │
│ - Navigate to Dashboard → Marketplace Tab                  │
│ - See all active listings from blockchain                  │
│ - Use filters: location, price, distance                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Select Listing                                     │
│ - Click "Buy Now" on desired listing                       │
│ - Modal opens with listing details                         │
│ - Shows: Seller, Available kWh, Price, Total Cost          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Enter Purchase Amount                              │
│ - Input: 20 kWh (out of 50 kWh available)                 │
│ - Auto-calculate:                                          │
│   • Base Price: 20 × 0.0001 = 0.002 ETH                  │
│   • Platform Fee (1%): 0.00002 ETH                         │
│   • Gas Estimate: 0.00015 ETH                              │
│   • Total: 0.00217 ETH ≈ ₹488.25                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Confirm Purchase (Blockchain Transaction)         │
│                                                            │
│ → Call: purchaseEnergy(listingId=3, amount=20e18)         │
│   with msg.value = 0.002 ETH                              │
│                                                            │
│ → Wallet prompts: "Pay 0.002 ETH"                         │
│ → Transaction sent to blockchain                          │
│ → Marketplace Contract:                                   │
│   • Transfers 20 kWh tokens to buyer                      │
│   • Updates listing: remaining = 30 kWh                   │
│   • Creates Order ID = 5                                  │
│   • Escrows payment for seller                            │
│                                                            │
│ ✅ Purchase Complete!                                      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Post-Purchase                                      │
│ - Order Status: PENDING                                    │
│ - Buyer receives 20 kWh energy tokens (ERC-1155)          │
│ - Can view in Portfolio/Assets tab                        │
│ - Oracle confirms delivery → DELIVERED                     │
│ - After 24h escrow → COMPLETED                            │
│ - Seller receives payment (minus platform fee)            │
└─────────────────────────────────────────────────────────────┘
```

**Technical Details**:
- **Atomic Transaction**: Payment + token transfer in single TX
- **Partial Purchases**: Buy any amount ≤ available
- **Escrow**: Funds held until delivery confirmed
- **Refunds**: Available if disputed

---

## 🌐 Decentralized Features

### 1. **Direct Blockchain Reads**
Instead of using a centralized API, the frontend reads directly from the blockchain:

```typescript
// useBlockchainListings.ts
const { data: listingCount } = useContractRead({
    address: CONTRACTS.Marketplace,
    abi: ABIS.Marketplace,
    functionName: '_listingCounter' // Public state variable
});

// Batch read all listings
const { data: listings } = useContractReads({
    contracts: listingIds.map(id => ({
        address: CONTRACTS.Marketplace,
        abi: ABIS.Marketplace,
        functionName: 'getListing',
        args: [id]
    }))
});
```

### 2. **IPFS Integration**
Metadata (images, descriptions) stored on IPFS for permanence:

```typescript
// Upload to IPFS
const ipfsUri = await uploadListingMetadata({
    name: "50 kWh Energy Token",
    description: "Clean solar energy",
    image: "ipfs://QmAbc...",
    location: "Jaipur",
    gridZone: 1
});
// Returns: ipfs://QmXyz...
```

### 3. **Wallet-Based Authentication**
No passwords, no accounts—just connect your Web3 wallet:
- MetaMask
- WalletConnect
- Coinbase Wallet
- Rainbow Wallet

---

## 🧪 Local Development Setup

### Prerequisites
- Node.js 18+
- Foundry (for Solidity)
- PostgreSQL (optional, for indexing)

### Step-by-Step Setup

```bash
# 1. Start Local Blockchain (Anvil)
anvil --block-time 1
# → Running on http://127.0.0.1:8545
# → Chain ID: 31337

# 2. Deploy Smart Contracts (in new terminal)
cd packages/contracts
forge build
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast \
  --skip-simulation

# Output shows deployed addresses:
# EnergyToken: 0xe7f1725e7734ce288f8367e1bb143e90bb3f0512
# Marketplace: 0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9
# PricingOracle: 0x5fbdb2315678afecb367f032d93f642f64180aa3

# 3. Start Frontend (in new terminal)
cd apps/web
npm install
npm run dev
# → http://localhost:3000

# 4. Seed Marketplace with Sample Data
# Open browser → Go to Marketplace → Click "Load Sample Data"
# Or call API: POST http://localhost:3000/api/seed
```

---

## 🔑 Contract Addresses (Anvil Local)

These are deterministic addresses generated by Foundry:

```typescript
export const CONTRACTS = {
    EnergyToken: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
    Marketplace: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
    PricingOracle: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
    SmartMeterRegistry: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0'
};
```

---

## 🎯 Key Features

### ✅ Already Implemented

1. **Create Energy Listings**
   - Full minting + listing flow
   - IPFS upload for images & metadata
   - Real-time preview
   - Progress stepper UI

2. **Marketplace**
   - Displays all on-chain listings
   - Advanced filters (price, location, distance)
   - Real-time updates every 5s
   - Wallet-integrated purchases

3. **Buy Energy**
   - Modal purchase flow
   - Amount selection
   - ETH ↔ INR conversion
   - Gas estimation
   - Transaction receipt

4. **Dashboard**
   - 3-tab system (Overview, Analytics, Marketplace)
   - Energy flow visualization
   - Leaderboard
   - Notifications
   - Gamification

5. **Seed Data**
   - API endpoint to create sample listings
   - Uses Anvil test accounts
   - Auto-registers producers
   - Mints & lists energy

### 🎨 UI/UX Highlights

- **Modern Design**: Glassmorphism, gradients, smooth animations
- **Responsive**: Mobile, tablet, desktop optimized
- **Dark Mode Ready**: Theme system with next-themes
- **Loading States**: Skeletons, spinners, progress bars
- **Toasts**: Real-time feedback for all actions
- **Form Validation**: Client-side validation before TX sending

---

## 📊 Data Models

### Listing (On-Chain)
```solidity
struct Listing {
    uint256 listingId;
    address seller;
    uint256 tokenId;
    uint256 kWhAmount;
    uint256 pricePerKwh;
    uint256 gridZone;
    uint256 createdAt;
    uint256 expiresAt;
    bool isActive;
}
```

### Order (On-Chain)
```solidity
struct Order {
    uint256 orderId;
    uint256 listingId;
    address buyer;
    address seller;
    uint256 kWhAmount;
    uint256 totalPrice;
    uint256 createdAt;
    OrderStatus status; // PENDING, DELIVERED, COMPLETED, DISPUTED, REFUNDED
}
```

### Energy Credit (On-Chain)
```solidity
struct EnergyCredit {
    address producer;
    uint256 kWhAmount;
    uint256 timestamp;
    uint256 gridZone;
    bool isGreen;       // Renewable source
    bool isConsumed;
}
```

---

## 🚀 Workflow Summary

### Current State
1. ✅ Blockchain running (Anvil)
2. ✅ Contracts deployed
3. ✅ Frontend running
4. ✅ Marketplace displays listings
5. ✅ Transactions work end-to-end

### To Add Listings:

**Option A: Use Seed API**
- Click "Load Sample Data" in marketplace
- Creates 2 sample listings automatically

**Option B: Manual Creation**
1. Connect wallet (use Anvil Account #0 or #1)
2. Go to "Sell Energy"
3. Fill form
4. Confirm 3 transactions
5. Listing appears in marketplace

### To Purchase Energy:
1. Browse marketplace
2. Click "Buy Now" on any listing
3. Enter amount (≤ available)
4. Confirm payment transaction
5. Receive energy tokens

---

## 🔐 Security Considerations

1. **Role-Based Access Control**
   - Only oracle can mint energy
   - Only admin can register producers
   - Only seller can cancel their listing

2. **Reentrancy Protection**
   - All state-changing functions use `nonReentrant`

3. **Input Validation**
   - Amount limits (MIN_MINT_AMOUNT, MAX_MINT_AMOUNT)
   - Duration limits (1 hour - 30 days)
   - Balance checks before transfers

4. **Escrow System**
   - Tokens held in marketplace during listing
   - Funds held until delivery confirmed
   - 24-hour dispute window

---

## 📈 Future Enhancements (Not Yet Implemented)

- [ ] Real IoT smart meter integration
- [ ] Oracle network (Chainlink) for pricing
- [ ] Layer 2 deployment (Optimism/Base)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics (historical data)
- [ ] Social features (reputation, reviews)
- [ ] Multi-token support (stablecoins)
- [ ] Automated market making (AMM pools)

---
## 🌍 Environmental Impact

### Carbon Offset Tracking
The platform calculates CO₂ offset:
- 1 kWh solar energy ≈ 0.92### 4. Interactive Dashboard
- **Real-Time Analytics:** Advanced charts for production, consumption, and efficiency.
- **Neighborhood Map:** Hyperlocal renewable energy grid visualization using `react-leaflet`.
- **Gamification:** Leaderboards, carbon offset tracking, and community challenges.
- **Transaction Tracking:** Global toast notifications and persistent history log from `transactionStore`.

### 5. Smart Contract Architecture
- **EnergyToken (ERC1155):** Represents energy bundles (kWh).
- **Marketplace:** Facilitates listing, buying, and consumption with escrow protection.
- **PricingOracle:** Provides real-time energy price feeds.
- **SmartMeterRegistry:** Verifies producers and logs consumption data.

## 🏗️ Technical Architecture

### Frontend (Next.js 14)
- **App Router:** For modern, server-side optimized routing.
- **Wagmi/Viem:** For robust blockchain interaction.
- **Recharts/Lucide:** For beautiful visualizations and icons.
- **Zustand:** For global transaction state management.
- **React-Leaflet:** For geospatial visualization.
- **Tailwind CSS + Shadcn UI:** For a premium, responsive design system.
- **IPFS**: Decentralized file storage
- **PostgreSQL**: Optional indexing layer

---

## 📚 Key Technologies

### Blockchain
- **Solidity**: Smart contract language
- **Foundry**: Development framework
- **Viem**: TypeScript Ethereum library
- **Wagmi**: React hooks for Ethereum
- **RainbowKit**: Wallet connection UI

### Frontend
- **Next.js**: React framework
- **Tailwind CSS**: Styling
- **shadcn/ui**: Component library
- **Recharts**: Data visualization
- **Leaflet**: Maps

### Storage
- **IPFS**: Decentralized file storage
- **PostgreSQL**: Optional indexing layer

---

## 🎓 Learning Resources

- [SunGrid Architecture](./DECENTRALIZED_ARCHITECTURE.md)
- [Integration Summary](./INTEGRATION_SUMMARY.md)
- [Setup Guide](./SETUP_COMPLETE.md)
- [Solidity Docs](https://docs.soliditylang.org/)
- [Wagmi Docs](https://wagmi.sh/)
- [IPFS Docs](https://docs.ipfs.tech/)

---

## 📞 Support

**Current Status**: ✅ Fully Functional
- Blockchain: Running
- Frontend: http://localhost:3000
- Marketplace: Active with listings
- Transactions: Working end-to-end

**Next Steps to Test**:
1. Connect wallet (MetaMask)
2. Add Anvil network (Chain ID 31337, RPC http://localhost:8545)
3. Import Anvil test account (see private keys in seed/route.ts)
4. Seed marketplace
5. Create listing or buy energy!

---

**Built with ❤️ for a sustainable, decentralized energy future. ⚡🌍**
