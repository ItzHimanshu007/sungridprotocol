# 🌐 SunGrid Protocol - Decentralized & Peer-to-Peer Architecture

## Overview

SunGrid Protocol is built as a **fully decentralized peer-to-peer energy marketplace** with no central authority or single point of failure.

## 🏗️ Decentralized Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Frontend   │  │  IPFS Client │  │ Web3 Wallet  │  │
│  │   (Next.js)  │  │              │  │  (MetaMask)  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │          │
└─────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────┐  ┌──────────────┐  ┌──────────────┐
│  IPFS Network   │  │   Blockchain  │  │ Smart Meters │
│  (Distributed)  │  │   (Anvil/Base)│  │   (IoT P2P)  │
│                 │  │               │  │              │
│  - Metadata     │  │  - Listings   │  │ - Readings   │
│  - Images       │  │  - Tokens     │  │ - Signatures │
│  - Profiles     │  │  - Trades     │  │              │
└─────────────────┘  └───────────────┘  └──────────────┘
```

## 🔑 Decentralized Components

### 1. **Smart Contracts (Full Decentralization)** ✅
- **Location**: Blockchain (Ethereum/Base)
- **Data**: All critical transactions, ownership, listings
- **Access**: Anyone can read/write with gas
- **Censorship**: Impossible - no admin can block users
- **Uptime**: 100% as long as blockchain is running

### 2. **IPFS Storage (Distributed P2P Storage)** ✅
- **Location**: Distributed across IPFS network
- **Data**: Metadata, images, profiles, documents
- **Access**: Content-addressed - anyone with CID can access
- **Redundancy**: Automatic replication across nodes
- **Censorship-resistant**: Content persists as long as one node pins it

### 3. **Frontend (User Runs Locally)** ✅
- **Deployment**: IPFS, Arweave, or self-hosted
- **Data Source**: Reads directly from blockchain
- **No Backend**: Zero centralized servers required
- **Works Offline**: Can cache and work with local data

### 4. **Smart Meter Network (IoT P2P)** 🚧
- **Communication**: Direct P2P between meters
- **Data Submission**: Meters sign and submit to blockchain
- **Verification**: Cryptographic signatures, no central authority
- **Network**: Mesh network for redundancy

## 📊 Data Flow (100% Decentralized)

### Creating a Listing
```
1. Producer → Upload metadata to IPFS → Get CID
2. Producer → Call smart contract.mintEnergy(CID)
3. Smart contract → Mint ERC-1155 token with IPFS URI
4. Producer → Call smart contract.createListing(tokenId, price)
5. Event emitted → All clients auto-update
```

### Buying Energy
```
1. Buyer → Browse listings (read from blockchain)
2. Buyer → Click buy → Sign transaction
3. Smart contract → Transfer tokens + ETH atomically
4. Event emitted → Both parties notified
5. No intermediary or escrow needed!
```

### Discovery (No Central Server)
```
1. Frontend → Read Marketplace.listingCounter()
2. Frontend → Batch read Marketplace.listings[1..N]
3. Frontend → Fetch IPFS metadata for each
4. Frontend → Display in UI
5. Auto-refresh on new blocks
```

## 🆚 Centralized vs Decentralized Comparison

| Feature | Centralized (API Server) | Decentralized (This Project) |
|---------|-------------------------|------------------------------|
| **Data Source** | PostgreSQL database | Blockchain + IPFS |
| **Uptime** | Depends on server | 99.99% (blockchain) |
| **Censorship** | Admin can block users | Censorship-resistant |
| **Privacy** | Server sees all requests | Pseudonymous blockchain |
| **Costs** | Hosting fees | Only gas fees |
| **Speed** | Fast (cached) | Moderate (blockchain reads) |
| **Trust** | Trust the server | Trustless |
| **Scaling** | Vertical (add servers) | Horizontal (more nodes) |

## 🔧 How to Use Decentralized Hooks

### Reading Listings (No API!)
```typescript
import { useBlockchainListings, formatListing } from '@/hooks/useBlockchainListings';

function Marketplace() {
    const { listings, loading } = useBlockchainListings();
    
    return (
        <div>
            {listings.map(listing => {
                const formatted = formatListing(listing);
                return (
                    <div key={listing.listingId.toString()}>
                        <h3>{formatted.kWhAmountFormatted} kWh</h3>
                        <p>₹{formatted.pricePerKwhINR}/kWh</p>
                    </div>
                );
            })}
        </div>
    );
}
```

### Buying Energy (Direct Contract Call)
```typescript
import { usePurchaseEnergy } from '@/hooks/useMarketplace';

function BuyButton({ listing }) {
    const { purchaseEnergy, isPending } = usePurchaseEnergy();
    
    const handleBuy = async () => {
        await purchaseEnergy({
            listingId: listing.listingId,
            kWhAmount: listing.kWhAmount,
            value: listing.kWhAmount * listing.pricePerKwh,
        });
    };
    
    return <button onClick={handleBuy}>Buy</button>;
}
```

### Uploading to IPFS
```typescript
import { uploadListingMetadata } from '@/lib/ipfs';

async function createListing() {
    // 1. Upload metadata to IPFS
    const ipfsUri = await uploadListingMetadata({
        name: '100 kWh Solar Energy',
        description: 'Clean energy from rooftop solar',
        gridZone: 1,
        location: 'Jaipur, India',
        seller: '0x123...',
    });
    
    // 2. Mint token with IPFS URI
    await energyToken.mintEnergy(ipfsUri, 100);
}
```

## 🌍 Peer-to-Peer Features

### 1. **No Central Authority**
- No company controls the marketplace
- No one can shut it down
- No one can censor transactions
- Users trade directly with each other

### 2. **Data Sovereignty**
- Users own their data
- Metadata stored on IPFS (user-controlled)
- Transaction history on blockchain (permanent)
- No company can sell your data

### 3. **Trustless Transactions**
- Smart contracts enforce rules
- Atomic swaps (tokens ↔ ETH)
- No escrow needed
- No chargebacks or reversals

### 4. **Global Access**
- Anyone with internet can participate
- No KYC/registration required
- Pseudonymous (wallet addresses)
- Borderless marketplace

## 🚀 Running Fully Decentralized

### Option 1: Use Public Infrastructure
```bash
# No setup needed!
# - Blockchain: Ethereum/Base mainnet
# - IPFS: Public gateways (ipfs.io, cloudflare, etc.)
# - Frontend: Hosted on IPFS/Arweave
```

### Option 2: Run Your Own Node (Maximum Decentralization)
```bash
# Run blockchain node
anvil # or geth, base-node, etc.

# Run IPFS node
ipfs daemon

# Serve frontend from IPFS
ipfs add -r build/
ipfs name publish <hash>
```

### Option 3: Hybrid (Our Current Setup)
```bash
# Local blockchain for development
anvil --block-time 1

# Public IPFS gateways
# Direct blockchain reads from frontend
# API server is OPTIONAL (for caching only)
```

## 📱 Mobile P2P (Future)

- **IPFS Mobile** - js-ipfs or native IPFS on mobile
- **Light Clients** - Run light Ethereum client on phone
- **Mesh Networks** - Smart meters communicate via BLE/WiFi Direct
- **Offline-First** - Cache data, sync when online

## ⚡ Performance Optimizations

### Blockchain Reads
```typescript
// Batch read multiple listings in one call
useContractReads({
    contracts: listings.map(id => ({
        address: MARKETPLACE,
        abi: ABI,
        functionName: 'listings',
        args: [id],
    })),
    // Auto-refresh on new blocks
    watch: true,
});
```

### IPFS Caching
```typescript
// Cache IPFS data in localStorage
const cached = localStorage.getItem(`ipfs:${cid}`);
if (cached) return JSON.parse(cached);

const data = await fetchFromIPFS(cid);
localStorage.setItem(`ipfs:${cid}`, JSON.stringify(data));
```

### Event Indexing
```typescript
// Listen to contract events for real-time updates
useContractEvent({
    address: MARKETPLACE,
    abi: ABI,
    eventName: 'ListingCreated',
    listener: (logs) => {
        // Update UI immediately
        refetch();
    },
});
```

## 🔐 Security in P2P

1. **Smart Contract Audits** - Code is public, auditable
2. **Cryptographic Signatures** - All transactions signed
3. **No Passwords** - Wallet-based authentication
4. **Immutable Records** - Blockchain provides audit trail
5. **Content Addressing** - IPFS ensures data integrity

## 📈 Scaling P2P

- **Layer 2**: Deploy on Optimism, Arbitrum, Base for cheaper transactions
- **IPFS Pinning**: Use Pinata, Web3.Storage for data persistence
- **The Graph**: Index blockchain events for complex queries
- **Ceramic**: Decentralized user profiles and social data

## 🎯 Why This Matters

1. **No Platform Risk**: Can't be shut down by any authority
2. **User Ownership**: You control your energy and data
3. **True Peer-to-Peer**: Direct neighbor-to-neighbor energy trading
4. **Censorship-Resistant**: Cannot be blocked or restricted
5. **Global**: Works anywhere with blockchain access
6. **Transparent**: All code and data is public
7. **Sustainable**: No company can shut down and lose your data

## 🔄 Migration Path

If you've set up the centralized API:

1. **Keep both**: API for speed, blockchain for truth
2. **Gradual migration**: Start using `useBlockchainListings`
3. **API becomes cache**: Use API only for search/filters
4. **Full P2P**: Eventually remove API entirely

## 📚 Resources

- **IPFS**: https://ipfs.io
- **The Graph**: https://thegraph.com  
- **Ethereum**: https://ethereum.org
- **Base**: https://base.org
- **EIP-1155**: https://eips.ethereum.org/EIPS/eip-1155

---

**The future is decentralized. The future is peer-to-peer. The future is SunGrid.** ☀️⚡
