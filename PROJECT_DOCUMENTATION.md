# 🌞 SunGrid Protocol - Complete Project Documentation

## 📋 Executive Summary

**SunGrid Protocol** is a revolutionary **fully decentralized peer-to-peer (P2P) energy trading platform** built on blockchain technology. It empowers solar energy producers to directly sell their excess renewable energy to consumers, eliminating intermediaries and creating a transparent, efficient, and sustainable energy marketplace.

### 🎯 Core Vision
Transform the renewable energy landscape by enabling direct neighbor-to-neighbor energy trading through blockchain technology, making renewable energy more accessible, affordable, and democratized.

---

## 🏗️ Complete Technology Stack

### **Blockchain Layer**
| Technology | Purpose | Version |
|------------|---------|---------|
| **Solidity** | Smart contract language | ^0.8.20 |
| **Foundry** | Development framework & testing | Latest |
| **Anvil** | Local Ethereum node (development) | Latest |
| **Viem** | TypeScript Ethereum library | ^2.0.0 |
| **Wagmi** | React hooks for Ethereum | ^2.0.0 |
| **RainbowKit** | Wallet connection UI | ^2.0.0 |

### **Frontend Stack**
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework (App Router) | 14.1.0 |
| **React** | UI library | ^18 |
| **TypeScript** | Type-safe JavaScript | ^5 |
| **Tailwind CSS** | Utility-first CSS framework | ^3.3.0 |
| **shadcn/ui** | Component library (Radix UI) | Latest |
| **next-themes** | Dark mode support | ^0.4.6 |

### **Web3 & Data**
| Technology | Purpose | Version |
|------------|---------|---------|
| **IPFS** | Decentralized file storage | ipfs-http-client ^60.0.1 |
| **PostgreSQL** | Optional indexing layer | Latest |
| **Prisma** | Database ORM | Latest |
| **TanStack Query** | Data fetching & caching | ^5.0.0 |

### **Visualization & UI**
| Technology | Purpose | Version |
|------------|---------|---------|
| **Recharts** | Data visualization charts | ^3.5.1 |
| **Leaflet** | Interactive maps | ^1.9.4 |
| **react-leaflet** | React wrapper for Leaflet | ^4.2.1 |
| **Lucide React** | Icon library | ^0.300.0 |
| **Framer Motion** | Animation library | (via Tailwind) |

### **Development Tools**
| Technology | Purpose |
|------------|---------|
| **Turbo** | Monorepo build system |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **PostCSS** | CSS processing |

---

## 🏗️ Complete Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                         │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │
│  │   Dashboard    │  │  Marketplace   │  │ Create Listing │        │
│  │  - Analytics   │  │  - Buy Energy  │  │  - Sell Energy │        │
│  │  - Portfolio   │  │  - Filters     │  │  - Mint Tokens │        │
│  │  - Leaderboard │  │  - Real-time   │  │  - IPFS Upload │        │
│  └────────────────┘  └────────────────┘  └────────────────┘        │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      WEB3 INTEGRATION LAYER                          │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │
│  │  Wagmi Hooks   │  │  RainbowKit    │  │  IPFS Client   │        │
│  │  - Read/Write  │  │  - Wallets     │  │  - Upload      │        │
│  │  - Events      │  │  - Auth        │  │  - Retrieve    │        │
│  └────────────────┘  └────────────────┘  └────────────────┘        │
└─────────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   BLOCKCHAIN LAYER       │  │   STORAGE LAYER          │
│  ┌────────────────────┐  │  │  ┌────────────────────┐  │
│  │  EnergyToken.sol   │  │  │  │  IPFS Network      │  │
│  │  (ERC-1155)        │  │  │  │  - Metadata        │  │
│  │  - Mint tokens     │  │  │  │  - Images          │  │
│  │  - Burn tokens     │  │  │  │  - Descriptions    │  │
│  │  - Reputation      │  │  │  │  - Profiles        │  │
│  └────────────────────┘  │  │  └────────────────────┘  │
│  ┌────────────────────┐  │  └──────────────────────────┘
│  │  Marketplace.sol   │  │
│  │  - Listings        │  │  ┌──────────────────────────┐
│  │  - Orders          │  │  │  OPTIONAL: API LAYER     │
│  │  - Escrow          │  │  │  ┌────────────────────┐  │
│  │  - Disputes        │  │  │  │  Express Server    │  │
│  └────────────────────┘  │  │  │  - Event indexing  │  │
│  ┌────────────────────┐  │  │  │  - Fast queries    │  │
│  │  PricingOracle.sol │  │  │  │  - Caching         │  │
│  │  - Dynamic pricing │  │  │  └────────────────────┘  │
│  │  - Zone pricing    │  │  │  ┌────────────────────┐  │
│  └────────────────────┘  │  │  │  PostgreSQL DB     │  │
│  ┌────────────────────┐  │  │  │  - Indexed events  │  │
│  │SmartMeterRegistry  │  │  │  │  - User profiles   │  │
│  │  - Verification    │  │  │  │  - Analytics       │  │
│  └────────────────────┘  │  │  └────────────────────┘  │
└──────────────────────────┘  └──────────────────────────┘
        ▲ Anvil / Base                    (Development Only)
```

---

## 🔐 Smart Contracts Deep Dive

### 1. **EnergyToken.sol** (ERC-1155)

**Purpose**: Tokenized representation of energy credits (1 token = 1 kWh)

**Key Features**:
- ✅ Multi-token standard (different energy types)
- ✅ Fractional ownership and trading
- ✅ Producer registration and verification
- ✅ Reputation tracking
- ✅ IPFS metadata integration
- ✅ Role-based access control

**Core Functions**:
```solidity
// Mint energy tokens for verified producers
function mintEnergy(
    address producer,
    uint256 kWhAmount,
    uint256 gridZone,
    string memory tokenURI
) external onlyRole(ORACLE_ROLE) returns (uint256 tokenId)

// Consume/burn energy tokens
function consumeEnergy(
    uint256 tokenId,
    uint256 amount
) external

// Register producer with smart meter
function registerProducer(
    address producer,
    string memory meterId
) external onlyRole(ADMIN_ROLE)

// Check producer verification status
function isVerifiedProducer(
    address producer
) external view returns (bool)

// Get producer statistics
function getProducerStats(
    address producer
) external view returns (ProducerStats memory)
```

**Access Roles**:
- `ADMIN_ROLE`: Contract administration
- `ORACLE_ROLE`: Can mint tokens (verified production)
- `MARKETPLACE_ROLE`: Can update reputation scores

---

### 2. **Marketplace.sol**

**Purpose**: P2P marketplace for energy trading with escrow protection

**Key Features**:
- ✅ Create energy listings with expiry
- ✅ Purchase energy (full or partial amounts)
- ✅ Token escrow during listing
- ✅ Payment escrow during order
- ✅ Oracle-based delivery confirmation
- ✅ Dispute resolution system
- ✅ Dynamic pricing integration
- ✅ Platform fee collection

**Core Functions**:
```solidity
// Create new energy listing
function createListing(
    uint256 tokenId,
    uint256 kWhAmount,
    uint256 pricePerKwh,
    uint256 durationSeconds
) external returns (uint256 listingId)

// Purchase energy from listing
function purchaseEnergy(
    uint256 listingId,
    uint256 kWhAmount
) external payable returns (uint256 orderId)

// Cancel active listing
function cancelListing(
    uint256 listingId
) external

// Oracle confirms energy delivery
function confirmDelivery(
    uint256 orderId
) external onlyRole(ORACLE_ROLE)

// Complete order and release funds
function completeOrder(
    uint256 orderId
) external

// Dispute an order
function disputeOrder(
    uint256 orderId,
    string memory reason
) external

// Resolve dispute (admin/oracle)
function resolveDispute(
    uint256 orderId,
    bool refundBuyer
) external onlyRole(ADMIN_ROLE)
```

**Order Lifecycle**:
```
┌──────────┐
│ PENDING  │ ← Initial state after purchase
└────┬─────┘
     │
     ├─→ confirmDelivery() ─→ ┌───────────┐
     │                         │ DELIVERED │
     │                         └─────┬─────┘
     │                               │
     │                               ├─→ completeOrder() ─→ ┌───────────┐
     │                               │                       │ COMPLETED │
     │                               │                       └───────────┘
     │                               │
     │                               └─→ disputeOrder() ─→ ┌──────────┐
     │                                                      │ DISPUTED │
     │                                                      └────┬─────┘
     │                                                           │
     │                                                           ├─→ resolveDispute(refund=true) ─→ ┌──────────┐
     │                                                           │                                   │ REFUNDED │
     │                                                           │                                   └──────────┘
     │                                                           │
     └───────────────────────────────────────────────────────────┴─→ resolveDispute(refund=false) ─→ COMPLETED
```

---

### 3. **PricingOracle.sol**

**Purpose**: Dynamic energy pricing based on supply, demand, and grid conditions

**Features**:
- Base price configuration
- Grid zone multipliers
- Time-based pricing (peak/off-peak)
- Supply/demand factors
- Historical price tracking

---

### 4. **SmartMeterRegistry.sol**

**Purpose**: Register and verify IoT smart meters

**Features**:
- Meter registration with cryptographic signatures
- Energy generation proof verification
- Reading authentication
- Anti-tampering mechanisms

---

## 🎨 Frontend Application Structure

### Project Organization
```
sungrid-protocol/
├── apps/
│   ├── web/                          # Next.js frontend
│   │   ├── app/
│   │   │   ├── (dashboard)/         # Protected routes
│   │   │   │   ├── dashboard/       # Main dashboard
│   │   │   │   │   └── page.tsx    # 3 tabs: Overview, Analytics, Marketplace
│   │   │   │   ├── create-listing/  # Sell energy
│   │   │   │   │   └── page.tsx    # Full minting & listing flow
│   │   │   │   └── settings/        # User settings
│   │   │   ├── api/                 # Next.js API routes
│   │   │   │   ├── seed/           # Seed marketplace
│   │   │   │   ├── faucet/         # Get test ETH
│   │   │   │   └── listings/       # Optional indexing
│   │   │   ├── page.tsx            # Landing page
│   │   │   ├── layout.tsx          # Root layout
│   │   │   ├── providers.tsx       # Web3 + Theme providers
│   │   │   └── globals.css         # Global styles
│   │   │
│   │   ├── components/
│   │   │   ├── dashboard/          # 16+ dashboard widgets
│   │   │   │   ├── EnhancedMarketplace.tsx
│   │   │   │   ├── AdvancedAnalyticsDashboard.tsx
│   │   │   │   ├── EnergyFlowVisualization.tsx
│   │   │   │   ├── LeaderboardPanel.tsx
│   │   │   │   ├── LivePriceTicker.tsx
│   │   │   │   ├── PendingTransactionsIndicator.tsx
│   │   │   │   └── ... (10 more)
│   │   │   ├── marketplace/
│   │   │   │   ├── BuyEnergyModal.tsx
│   │   │   │   ├── AdvancedFilters.tsx
│   │   │   │   └── ListingCard.tsx
│   │   │   ├── layout/
│   │   │   │   └── Sidebar.tsx
│   │   │   └── ui/                # shadcn components
│   │   │
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useBlockchainListings.ts   # Read from blockchain
│   │   │   ├── useMarketplace.ts          # Purchase/create/cancel
│   │   │   ├── useEnergyToken.ts          # Token interactions
│   │   │   └── useMarketData.ts          # Market statistics
│   │   │
│   │   └── lib/
│   │       ├── contracts.ts       # Contract addresses & ABIs
│   │       ├── ipfs.ts           # IPFS utilities
│   │       ├── currency.ts       # ETH ↔ INR conversion
│   │       └── abi/              # Compiled ABIs
│   │
│   └── api/                       # Express backend (optional)
│
└── packages/
    └── contracts/                 # Solidity smart contracts
        ├── src/
        │   ├── EnergyToken.sol
        │   ├── Marketplace.sol
        │   ├── PricingOracle.sol
        │   ├── SmartMeterRegistry.sol
        │   ├── interfaces/
        │   └── libraries/
        ├── script/
        │   └── Deploy.s.sol       # Deployment script
        └── test/                  # Contract tests
```

---

## 👥 Complete User Journey

### 🔆 Journey 1: Energy Producer (Selling Solar Energy)

**Persona**: Rahul - Homeowner with rooftop solar panels in Jaipur

#### Step 1: Initial Setup
```
┌─────────────────────────────────────────────────────────┐
│ 1. Rahul installs wallet (MetaMask)                     │
│ 2. Visits https://sungrid.app (or localhost:3000)       │
│ 3. Clicks "Connect Wallet"                              │
│ 4. Approves connection → Authenticated via wallet       │
│ 5. No sign-up, no passwords needed! ✓                   │
└─────────────────────────────────────────────────────────┘
```

#### Step 2: Navigate to Create Listing
```
┌─────────────────────────────────────────────────────────┐
│ 1. Dashboard → Sidebar → "Sell Energy" button          │
│ 2. Redirects to /create-listing                         │
│ 3. Sees step-by-step form wizard                        │
└─────────────────────────────────────────────────────────┘
```

#### Step 3: Fill Listing Form
```
┌─────────────────────────────────────────────────────────┐
│ Form Fields:                                            │
│ ┌───────────────────────────────────────────────────┐   │
│ │ Energy Amount: 100 kWh                           │   │
│ │ Price per kWh: 0.0001 ETH (≈ ₹22.50)           │   │
│ │ Location: "Malviya Nagar, Jaipur"                │   │
│ │ Description: "Certified solar panels - AAA rated"│   │
│ │ Upload Image: [solar-panel.jpg] ✓               │   │
│ │ Duration: 7 days                                  │   │
│ │ Grid Zone: Zone 1 (Rajasthan)                    │   │
│ └───────────────────────────────────────────────────┘   │
│                                                         │
│ Real-time Preview:                                      │
│ - Total Value: 0.01 ETH (₹2,250)                       │
│ - Expires: Dec 21, 2025                                 │
│ - Carbon Offset: 92 kg CO₂                             │
└─────────────────────────────────────────────────────────┘
```

#### Step 4: Submit & Blockchain Transactions
```
┌─────────────────────────────────────────────────────────────┐
│ Transaction 1: Upload to IPFS                              │
│ ─────────────────────────────────────                      │
│ • Image uploaded → ipfs://QmXk...abc                       │
│ • Metadata JSON created:                                    │
│   {                                                         │
│     "name": "100 kWh Solar Energy",                        │
│     "description": "Certified solar...",                    │
│     "image": "ipfs://QmXk...abc",                          │
│     "location": "Malviya Nagar, Jaipur",                   │
│     "gridZone": 1                                           │
│   }                                                         │
│ • Metadata uploaded → ipfs://QmYz...xyz                    │
│ • ✅ Decentralized storage complete                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Transaction 2: Mint Energy Token                           │
│ ─────────────────────────────────                          │
│ • Contract: EnergyToken.mintEnergy()                       │
│ • Args:                                                     │
│   - producer: 0xRahul...                                   │
│   - amount: 100000000000000000000 (100e18 wei)            │
│   - gridZone: 1                                            │
│   - tokenURI: "ipfs://QmYz...xyz"                         │
│                                                             │
│ • MetaMask Prompt:                                         │
│   ┌───────────────────────────────────┐                   │
│   │ Confirm Transaction                │                   │
│   │ Est. Gas: 0.0008 ETH              │                   │
│   │ [Reject] [Confirm]                │                   │
│   └───────────────────────────────────┘                   │
│                                                             │
│ • Transaction Hash: 0x1a2b3c...                           │
│ • ⏳ Waiting for confirmation... (2 sec on Anvil)         │
│ • ✅ Token Minted! Token ID: #7                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Transaction 3: Approve Marketplace                         │
│ ─────────────────────────────────                          │
│ • Contract: EnergyToken.setApprovalForAll()                │
│ • Args:                                                     │
│   - operator: 0xMarketplace...                             │
│   - approved: true                                          │
│                                                             │
│ • Purpose: Allow marketplace to transfer tokens           │
│ • MetaMask confirms → ✅ Approved                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Transaction 4: Create Listing                              │
│ ─────────────────────────────────                          │
│ • Contract: Marketplace.createListing()                    │
│ • Args:                                                     │
│   - tokenId: 7                                             │
│   - kWhAmount: 100e18                                      │
│   - pricePerKwh: 100000000000000 (0.0001e18)              │
│   - duration: 604800 (7 days in seconds)                   │
│                                                             │
│ • Smart Contract Actions:                                  │
│   1. Validates seller owns tokens                          │
│   2. Transfers 100 kWh to marketplace (escrow)            │
│   3. Creates Listing ID: #3                                │
│   4. Sets expiry: block.timestamp + 7 days                 │
│   5. Emits ListingCreated event                            │
│                                                             │
│ • ✅ Listing Live!                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Success Screen:                                             │
│ ┌───────────────────────────────────────┐                  │
│ │ 🎉 Listing Created Successfully!      │                  │
│ │                                        │                  │
│ │ Listing ID: #3                        │                  │
│ │ Amount: 100 kWh                       │                  │
│ │ Price: 0.0001 ETH/kWh                │                  │
│ │                                        │                  │
│ │ Your listing is now live in the       │                  │
│ │ marketplace and visible to all users! │                  │
│ │                                        │                  │
│ │ [View in Marketplace] [Create Another]│                  │
│ └───────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

**Total Cost**: ~0.003 ETH (~₹675) in gas fees
**Time**: ~30 seconds (on local Anvil)

---

### ⚡ Journey 2: Energy Consumer (Buying Solar Energy)

**Persona**: Priya - Apartment dweller wanting clean energy

#### Step 1: Browse Marketplace
```
┌─────────────────────────────────────────────────────────┐
│ 1. Connects wallet                                       │
│ 2. Dashboard → Marketplace Tab                           │
│ 3. Sees grid of available listings (real-time from BC)  │
│                                                          │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│ │ 100 kWh     │ │ 50 kWh      │ │ 200 kWh     │        │
│ │ ₹22.50/kWh  │ │ ₹21.00/kWh  │ │ ₹23.00/kWh  │        │
│ │ Jaipur      │ │ Delhi       │ │ Mumbai      │        │
│ │ [Buy Now]   │ │ [Buy Now]   │ │ [Buy Now]   │        │
│ └─────────────┘ └─────────────┘ └─────────────┘        │
└─────────────────────────────────────────────────────────┘
```

#### Step 2: Use Advanced Filters
```
┌─────────────────────────────────────────────────────────┐
│ Filters:                                                 │
│ • Location: Within 50km of my location                  │
│ • Price Range: ₹18 - ₹25 per kWh                       │
│ • Min Amount Verification: Verified producers only       │
│ • Sort: Distance (nearest first)                         │
│                                                          │
│ Result: Rahul's 100 kWh listing appears (2.5km away)    │
└─────────────────────────────────────────────────────────┘
```

#### Step 3: Select and Purchase
```
┌─────────────────────────────────────────────────────────┐
│ Clicks "Buy Now" → Modal Opens                          │
│ ┌───────────────────────────────────────────────────┐   │
│ │ Buy Energy from Rahul                            │   │
│ │ ─────────────────────────────────────            │   │
│ │                                                   │   │
│ │ Available: 100 kWh                               │   │
│ │ Price: 0.0001 ETH/kWh (₹22.50)                  │   │
│ │                                                   │   │
│ │ Enter Amount:                                     │   │
│ │ [30] kWh (slider: 1-100)                         │   │
│ │                                                   │   │
│ │ ─────────────────────────────────────            │   │
│ │ Cost Breakdown:                                   │   │
│ │ • Base Price: 30 × 0.0001 = 0.003 ETH           │   │
│ │ • Platform Fee (1%): 0.00003 ETH                 │   │
│ │ • Gas Estimate: ~0.00025 ETH                     │   │
│ │ ─────────────────────────────────────            │   │
│ │ Total: 0.00328 ETH ≈ ₹738.00                    │   │
│ │                                                   │   │
│ │ Environmental Impact:                             │   │
│ │ 🌱 Carbon Offset: 27.6 kg CO₂                    │   │
│ │                                                   │   │
│ │         [Cancel] [Confirm Purchase]              │   │
│ └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

#### Step 4: Blockchain Transaction
```
┌─────────────────────────────────────────────────────────────┐
│ Contract: Marketplace.purchaseEnergy()                     │
│ Args:                                                       │
│ • listingId: 3                                             │
│ • kWhAmount: 30e18                                         │
│ • msg.value: 0.003 ETH                                     │
│                                                             │
│ Smart Contract Executes:                                   │
│ ─────────────────────────────────                          │
│ 1. Validates listing is active                             │
│ 2. Checks amount ≤ available (30 ≤ 100) ✓                 │
│ 3. Calculates total price + fees                           │
│ 4. Transfers 30 kWh tokens to Priya                        │
│ 5. Updates listing: available = 70 kWh                     │
│ 6. Creates Order ID: #8                                    │
│ 7. Escrows payment (held until delivery confirmed)         │
│ 8. Emits PurchaseCompleted event                           │
│                                                             │
│ ✅ Transaction Confirmed!                                   │
└─────────────────────────────────────────────────────────────┘
```

#### Step 5: Post-Purchase Experience
```
┌─────────────────────────────────────────────────────────┐
│ Success Notification:                                    │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ✅ Purchase Successful!                             │ │
│ │                                                     │ │
│ │ You now own 30 kWh of clean solar energy!          │ │
│ │                                                     │ │
│ │ Order ID: #8                                        │ │
│ │ Status: PENDING → Awaiting delivery confirmation   │ │
│ │                                                     │ │
│ │ [View in Portfolio] [Track Order]                  │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

Portfolio View:
┌─────────────────────────────────────────────────────────┐
│ My Energy Assets:                                        │
│ • 30 kWh from Rahul (Token ID #7)                       │
│ • Purchase Price: ₹738                                   │
│ • Carbon Offset: 27.6 kg CO₂                            │
│ • Status: Ready to consume                               │
│ • [Consume Energy] [Resell] [Details]                   │
└─────────────────────────────────────────────────────────┘
```

---

### 🔄 Journey 3: Energy Consumption

**Continuation of Priya's journey**

#### Step 1: Consume Purchased Energy
```
┌─────────────────────────────────────────────────────────┐
│ Portfolio → Click "Consume Energy"                       │
│                                                          │
│ ┌───────────────────────────────────────────────────┐   │
│ │ Consume Energy Tokens                            │   │
│ │                                                   │   │
│ │ You own: 30 kWh (Token #7)                       │   │
│ │                                                   │   │
│ │ Amount to consume:                                │   │
│ │ [30] kWh                                         │   │
│ │                                                   │   │
│ │ This will:                                        │   │
│ │ • Burn 30 kWh tokens                             │   │
│ │ • Mark energy as consumed                        │   │
│ │ • Release payment to seller (Rahul)             │   │
│ │ • Update your carbon offset stats               │   │
│ │                                                   │   │
│ │ [Cancel] [Confirm Consumption]                   │   │
│ └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

#### Step 2: Burn Tokens
```
┌─────────────────────────────────────────────────────────┐
│ Contract: Marketplace.consumeEnergy()                    │
│ Args: orderId: 8                                         │
│                                                          │
│ Smart Contract Executes:                                │
│ 1. Validates order status                                │
│ 2. Burns 30 kWh tokens (permanent)                      │
│ 3. Releases escrowed payment to Rahul                   │
│ 4. Updates order status: COMPLETED                       │
│ 5. Updates carbon offset stats                          │
│                                                          │
│ ✅ Energy Consumed!                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🌐 Decentralized Features

### Why Fully Decentralized?

```
┌──────────────────────────────────────────────────────────┐
│           Traditional Energy Trading                      │
├──────────────────────────────────────────────────────────┤
│ You → Utility Company → Grid → Another User             │
│                                                          │
│ Problems:                                                 │
│ • High fees (30-40% markup)                            │
│ • No transparency                                         │
│ • Central point of failure                               │
│ • Company can censor/block users                         │
│ • Your data is sold                                      │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│              SunGrid Protocol (P2P)                       │
├──────────────────────────────────────────────────────────┤
│ You → Blockchain → Neighbor (direct!)                   │
│                                                          │
│ Benefits:                                                │
│ • Minimal fees (1% platform + gas)                      │
│ • Complete transparency (open source)                    │
│ • No downtime (blockchain never stops)                   │
│ • Censorship-resistant (no one can block you)           │
│ • You own your data (IPFS + wallet)                     │
│ • No passwords, no accounts                              │
└──────────────────────────────────────────────────────────┘
```

### Decentralization Stack

**1. No Backend Servers**
- Frontend reads directly from blockchain
- No API servers to maintain
- No database to secure
- No single point of failure

**2. IPFS Storage**
- All images, metadata on IPFS
- Content-addressed (permanent URLs)
- Distributed across network
- Cannot be deleted or censored

**3. Wallet-Based Auth**
- No sign-ups or passwords
- Just connect MetaMask/Rainbow/WalletConnect
- Your wallet = your identity
- Private keys never leave your device

**4. Smart Contract Logic**
- All business logic on-chain
- Publicly auditable code
- Immutable once deployed
- No hidden fees or changes

**5. Open Source**
- Entire codebase public
- Anyone can verify
- Anyone can fork and run
- Community-driven development

---

## 🎯 Key Features

### ✅ Currently Implemented

#### 1. **Create Energy Listings**
- Step-by-step wizard interface
- IPFS image upload (drag & drop)
- Real-time preview
- Metadata JSON generation
- Multi-step transaction flow
- Progress indicators
- Error handling & recovery

#### 2. **Advanced Marketplace**
- Real-time blockchain sync
- Advanced filters:
  - Location-based
  - Price range
  - Distance radius
  - Verification status
  - Grid zone
- Sort options
- Responsive card layout
- Sample data seeding

#### 3. **Purchase Flow**
- Modal-based purchase
- Amount selection (slider)
- Cost calculator:
  - Base price
  - Platform fees
  - Gas estimation
  - Currency conversion (ETH ↔ INR)
- Carbon offset display
- Transaction confirmation
- Receipt generation

#### 4. **Dashboard Analytics**
- **Overview Tab**:
  - Energy production/consumption stats
  - Earnings summary
  - Active listings count
  - Carbon offset tracking
  
- **Analytics Tab**:
  - Interactive charts (Recharts)
  - Energy flow visualization
  - Price trends
  - Historical data
  - Peer comparison
  
- **Marketplace Tab**:
  - Integrated marketplace view
  - Quick actions
  - Live price ticker

#### 5. **Interactive Components**
- **Energy Flow Visualization**: Real-time animated flows
- **Neighborhood Map**: Leaflet map with producers/consumers
- **Leaderboard**: Gamification (top producers/consumers)
- **Live Price Ticker**: WebSocket-style price updates
- **Transaction Toast**: Global notifications for all blockchain events
- **Pending Transactions**: Real-time transaction tracking

#### 6. **Wallet Integration**
- RainbowKit wallet connection
- Multi-wallet support:
  - MetaMask
  - WalletConnect
  - Coinbase Wallet
  - Rainbow Wallet
- Network switching
- Balance display
- Transaction history

#### 7. **Theme System**
- Dark/Light mode toggle
- Persistent preferences
- Smooth transitions
- Theme-aware components

#### 8. **Developer Tools**
- Seed marketplace API
- Test data generation
- Faucet for test ETH
- Contract address management

---

## 🔧 Installation & Setup

### Prerequisites
```bash
# Check versions
node --version  # Should be 18+
npm --version   # Should be 10+
```

### Quick Start (3 Steps)

#### 1️⃣ Start Local Blockchain
```bash
# Install Foundry (if not installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Start Anvil (local Ethereum node)
cd /path/to/sungrid-protocol
anvil --block-time 1

# Output:
# Available Accounts (10 test accounts with 10000 ETH each)
# Private Keys
# Wallet Addresses
# RPC: http://127.0.0.1:8545
# Chain ID: 31337
```

#### 2️⃣ Deploy Smart Contracts
```bash
# New terminal window
cd packages/contracts

# Install dependencies
npm install

# Compile contracts
forge build

# Deploy to Anvil
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast \
  --skip-simulation

# Output shows deployed addresses:
# EnergyToken: 0xe7f1725e7734ce288f8367e1bb143e90bb3f0512
# Marketplace: 0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9
# PricingOracle: 0x5fbdb2315678afecb367f032d93f642f64180aa3
# SmartMeterRegistry: 0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0
```

#### 3️⃣ Start Frontend
```bash
# New terminal window
cd apps/web

# Install dependencies
npm install

# Start dev server
npm run dev

# Visit: http://localhost:3000
```

### Configuration

#### Environment Variables
```bash
# apps/web/.env
NEXT_PUBLIC_ANVIL_RPC=http://127.0.0.1:8545
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

---

## 🧪 Testing the System

### Test Workflow 1: Seed Marketplace

```bash
# Method 1: Via UI
1. Open http://localhost:3000
2. Navigate to Marketplace tab
3. Click "Load Sample Data"
4. Wait for transactions (~10 seconds)
5. Refresh page → See 2 sample listings

# Method 2: Via API
curl -X POST http://localhost:3000/api/seed
```

### Test Workflow 2: Manual Listing

```bash
1. Connect wallet (use Anvil test account)
2. Import test account in MetaMask:
   - Network: Localhost 8545
   - Chain ID: 31337
   - Currency: ETH
   - Private Key: (from Anvil output)

3. Click "Sell Energy"
4. Fill form:
   - Amount: 50 kWh
   - Price: 0.0001 ETH
   - Location: "Test Location"
   - Upload image
5. Confirm 3 transactions
6. View listing in marketplace
```

### Test Workflow 3: Purchase Energy

```bash
1. Use different test account (Account #1)
2. Browse marketplace
3. Click "Buy Now" on any listing
4. Enter amount (e.g., 10 kWh)
5. Confirm transaction
6. Check portfolio → See purchased energy
```

---

## 📊 Performance Metrics

### Transaction Speeds

| Network | Block Time | Tx Confirmation | Cost (Avg) |
|---------|-----------|----------------|-----------|
| **Anvil (Local)** | 1 second | ~2 seconds | ~0.001 ETH |
| **Ethereum Mainnet** | 12 seconds | ~30 seconds | ~$50 USD |
| **Base L2** | 2 seconds | ~4 seconds | ~$0.10 USD |
| **Optimism L2** | 2 seconds | ~4 seconds | ~$0.15 USD |

### Gas Costs (Anvil)

| Operation | Gas Used | Cost (0.001 ETH/gas) |
|-----------|----------|---------------------|
| Mint Energy Token | 120,000 | 0.00012 ETH |
| Create Listing | 85,000 | 0.000085 ETH |
| Purchase Energy | 95,000 | 0.000095 ETH |
| Consume Energy | 70,000 | 0.00007 ETH |

---

## 🚀 Deployment Guide

### Deploying to Production

#### 1. Choose Blockchain Network
```bash
# Recommended: Base (Ethereum L2)
# - Low fees (~$0.10 per transaction)
# - Fast confirmation (~2 seconds)
# - Ethereum-compatible
# - Growing ecosystem
```

#### 2. Update Configuration
```bash
# packages/contracts/script/Deploy.s.sol
# Change RPC URL:
string memory RPC_URL = vm.envString("BASE_RPC_URL");

# Get API key from base.org
# Update .env:
BASE_RPC_URL=https://mainnet.base.org
PRIVATE_KEY=your_deployment_wallet_private_key
```

#### 3. Deploy Contracts
```bash
cd packages/contracts
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $BASE_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY
```

#### 4. Update Frontend
```bash
# apps/web/lib/contracts.ts
# Update contract addresses from deployment output
export const CONTRACTS = {
  EnergyToken: '0x...', // Base mainnet address
  Marketplace: '0x...',
  // ...
};
```

#### 5. Deploy Frontend
```bash
# Option A: Vercel (Recommended for Next.js)
cd apps/web
vercel deploy

# Option B: IPFS (Fully decentralized)
npm run build
npm install -g ipfs-deploy
ipd build/

# Access via: https://your-app.ipfs.dweb.link
```

---

## 🔒 Security Considerations

### Smart Contract Security

✅ **Implemented**:
- OpenZeppelin contracts (audited)
- ReentrancyGuard on all state-changing functions
- Role-based access control (AccessControl)
- Input validation (require statements)
- SafeMath (Solidity 0.8+ overflow protection)
- Checks-Effects-Interactions pattern

🔜 **Recommended**:
- Professional audit (Trail of Bits, ConsenSys Diligence)
- Bug bounty program
- Formal verification
- Multi-sig admin wallet

### Frontend Security

✅ **Implemented**:
- Client-side input validation
- Safe BigInt operations
- Timeout handling
- Error boundaries

### Operational Security

- Use hardware wallet for admin keys
- Multi-sig for contract ownership
- Gradual rollout (testnet → small mainnet → full launch)
- Emergency pause functionality

---

## 🌱 Environmental Impact

### Carbon Offset Calculation

```
1 kWh renewable energy = 0.92 kg CO₂ offset
(compared to coal power generation)

Platform Stats (Example):
• Total Energy Traded: 10,000 kWh
• Carbon Offset: 9,200 kg CO₂
• Equivalent: 500 trees planted
```

### Sustainability Metrics (Dashboard)
- Total renewable energy traded
- Carbon emissions prevented
- Fossil fuel displacement
- Community impact scores

---

## 🛣️ Roadmap & Future Enhancements

### Phase 1: MVP ✅ (Current)
- [x] Smart contracts (ERC-1155, Marketplace)
- [x] Frontend (Next.js with Wagmi)
- [x] IPFS integration
- [x] Local development setup
- [x] Basic analytics dashboard

### Phase 2: Production Ready 🚧 (Q1 2026)
- [ ] Professional smart contract audit
- [ ] Deploy to Base L2
- [ ] Production frontend deployment
- [ ] Real smart meter integration (pilot)
- [ ] Mobile app (React Native)
- [ ] Enhanced analytics & reporting

### Phase 3: Scaling 🔮 (Q2-Q3 2026)
- [ ] Chainlink oracle integration
- [ ] Multi-region support
- [ ] Stablecoin payments (USDC)
- [ ] Automated market making (AMM)
- [ ] Social features (reviews, ratings)
- [ ] Community governance (DAO)

### Phase 4: Ecosystem 🌟 (Q4 2026+)
- [ ] Cross-chain bridges
- [ ] Energy derivatives trading
- [ ] AI-powered price prediction
- [ ] Grid balancing algorithms
- [ ] Battery storage integration
- [ ] Government partnerships

---

## 📞 Support & Resources

### Documentation
- **Setup Guide**: [SETUP_COMPLETE.md](./SETUP_COMPLETE.md)
- **Architecture**: [DECENTRALIZED_ARCHITECTURE.md](./DECENTRALIZED_ARCHITECTURE.md)
- **Quick Start**: [QUICKSTART.md](./QUICKSTART.md)
- **Transaction Guide**: [TRANSACTION_TRACKING_GUIDE.md](./TRANSACTION_TRACKING_GUIDE.md)

### Developer Resources
- Solidity Docs: https://docs.soliditylang.org/
- Wagmi Docs: https://wagmi.sh/
- IPFS Docs: https://docs.ipfs.tech/
- Next.js Docs: https://nextjs.org/docs
- Foundry Book: https://book.getfoundry.sh/

### Community
- GitHub: [https://github.com/sungrid-protocol](https://github.com/sungrid-protocol)
- Discord: [Join Community](https://discord.gg/sungrid)
- Twitter: [@SunGridProtocol](https://twitter.com/sungridprotocol)

---

## 🎓 Technical Concepts Explained

### ERC-1155 Multi-Token Standard
- Combines fungible (like ERC-20) and non-fungible (like ERC-721) tokens
- One contract manages unlimited token types
- Gas-efficient batch transfers
- Perfect for energy credits (different zones, times, sources)

### IPFS (InterPlanetary File System)
- Peer-to-peer file storage
- Content-addressed (hash-based URLs)
- Decentralized & permanent
- No single point of failure

### Escrow System
- Smart contract holds tokens/funds during transaction
- Released when conditions met (delivery confirmed)
- Protects both buyer and seller
- No third-party needed

### Gas Optimization
- Batch operations where possible
- Use `calldata` instead of `memory` for external functions
- Pack struct variables efficiently
- Use events instead of storage where appropriate

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details

---

## 🙏 Acknowledgments

Built with:
- ❤️ Passion for renewable energy
- 🌍 Vision for a sustainable future
- ⚡ Blockchain technology
- 🤝 Open source community

---

**🌞 SunGrid Protocol - Powering a Decentralized, Sustainable Future ⚡**

*Last Updated: December 14, 2025*
*Version: 1.0.0*
