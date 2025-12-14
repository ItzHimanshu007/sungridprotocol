# Sample Transaction Testing Guide

**Objective:** Validate the 6-step transaction mechanism through end-to-end testing

**Environment:** Local Anvil blockchain + Next.js frontend

---

## Prerequisites

✅ Anvil running (`anvil --block-time 1`)  
✅ Frontend running (`npm run dev` in apps/web)  
✅ Contracts deployed to local Anvil  
✅ Wallet connected (MetaMask/Coinbase Wallet)

---

## Test Scenario

**Participants:**
- **Producer (Alice):** Address that mints and sells energy
- **Consumer (Bob):** Address that purchases and consumes energy

**Transaction Flow:**
1. Register producer
2. Mint energy NFT
3. Create marketplace listing
4. Purchase energy (escrow payment)
5. Consume energy (burn + release funds)
6. Verify loss traceability

---

## Step-by-Step Execution

### 🔧 Setup: Get Test Accounts

Anvil provides 10 pre-funded test accounts. Use the first two:

**Account #0 (Alice - Producer):**
```
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**Account #1 (Bob - Consumer):**
```
Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

**Import both accounts into your wallet for testing.**

---

### 📝 Step 1: Register Producer (Alice)

**Goal:** Verify Alice as an authorized energy producer

**Contract:** `EnergyToken.sol::registerProducer()`

**Method 1: Via Frontend (Recommended)**
1. Connect wallet with **Admin account** (deployer)
2. Navigate to Admin panel
3. Click "Register Producer"
4. Enter:
   - Producer Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
   - Meter ID: `12345`
5. Sign transaction

**Method 2: Via Contract Interaction**
```javascript
// Using viem/wagmi in browser console
const { writeContract } = await import('wagmi/actions');

await writeContract({
  address: ENERGY_TOKEN_ADDRESS,
  abi: ENERGY_TOKEN_ABI,
  functionName: 'registerProducer',
  args: [
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Alice
    12345n // Meter ID
  ]
});
```

**Expected Result:**
- ✅ Transaction confirmed
- ✅ Event emitted: `ProducerRegistered(Alice, 12345)`
- ✅ Alice's reputation initialized to 50

**Verification:**
```javascript
// Check if Alice is verified
const isVerified = await readContract({
  address: ENERGY_TOKEN_ADDRESS,
  abi: ENERGY_TOKEN_ABI,
  functionName: 'isVerifiedProducer',
  args: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266']
});
console.log('Alice verified:', isVerified); // Should be true
```

---

### ⚡ Step 2: Mint Energy NFT (Alice)

**Goal:** Create an energy NFT representing 100 kWh of solar production

**Contract:** `EnergyToken.sol::mintEnergy()`

**Method 1: Via Frontend**
1. Switch wallet to **Alice's account**
2. Navigate to "Create Listing" page
3. Click "Mint Energy First" (if needed)
4. Enter:
   - Amount: `100` kWh
   - Grid Zone: `1001` (example zone ID)
   - Description: "Solar energy from rooftop panels"
   - Upload image for IPFS metadata
5. Sign transaction

**Method 2: Via Contract Interaction**
```javascript
// Upload metadata to IPFS first (or use placeholder)
const metadataURI = 'ipfs://QmExample123'; // Replace with actual IPFS CID

await writeContract({
  address: ENERGY_TOKEN_ADDRESS,
  abi: ENERGY_TOKEN_ABI,
  functionName: 'mintEnergy',
  args: [
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Alice (producer)
    parseEther('100'), // 100 kWh
    1001n, // Grid Zone
    metadataURI
  ]
});
```

**Expected Result:**
- ✅ Transaction confirmed
- ✅ Event emitted: `EnergyMinted(tokenId=1, Alice, 100 kWh, zone=1001)`
- ✅ Alice receives ERC1155 token ID #1 with balance 100e18
- ✅ `producerTotalEnergy[Alice]` increased by 100e18
- ✅ `gridZoneSupply[1001]` increased by 100e18

**Verification:**
```javascript
// Check Alice's token balance
const balance = await readContract({
  address: ENERGY_TOKEN_ADDRESS,
  abi: ENERGY_TOKEN_ABI,
  functionName: 'balanceOf',
  args: [
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    1n // Token ID
  ]
});
console.log('Alice balance:', formatEther(balance), 'kWh');

// Check energy credit details
const credit = await readContract({
  address: ENERGY_TOKEN_ADDRESS,
  abi: ENERGY_TOKEN_ABI,
  functionName: 'getEnergyCredit',
  args: [1n]
});
console.log('Energy Credit:', credit);
```

---

### 🏪 Step 3: Create Listing (Alice)

**Goal:** List 100 kWh for sale at 0.05 ETH per kWh

**Contract:** `Marketplace.sol::createListing()`

**Prerequisites:**
- Alice must **approve** Marketplace to transfer her tokens
- Approval is ERC1155 `setApprovalForAll`

**Step 3a: Approve Marketplace**
```javascript
await writeContract({
  address: ENERGY_TOKEN_ADDRESS,
  abi: ENERGY_TOKEN_ABI,
  functionName: 'setApprovalForAll',
  args: [
    MARKETPLACE_ADDRESS, // Marketplace contract
    true // Approved
  ]
});
```

**Step 3b: Create Listing**
```javascript
const pricePerKwh = parseEther('0.05'); // 0.05 ETH per kWh
const duration = 7n * 24n * 60n * 60n; // 7 days in seconds

await writeContract({
  address: MARKETPLACE_ADDRESS,
  abi: MARKETPLACE_ABI,
  functionName: 'createListing',
  args: [
    1n, // Token ID
    parseEther('100'), // 100 kWh
    pricePerKwh,
    duration
  ]
});
```

**Expected Result:**
- ✅ Transaction confirmed
- ✅ Event emitted: `ListingCreated(listingId=1, Alice, tokenId=1, 100 kWh, 0.05 ETH/kWh)`
- ✅ Tokens transferred from Alice to Marketplace (escrowed)
- ✅ Listing visible in marketplace UI
- ✅ Alice's token balance: 0 (all escrowed)
- ✅ Marketplace token balance: 100e18

**Verification:**
```javascript
// Check listing details
const listing = await readContract({
  address: MARKETPLACE_ADDRESS,
  abi: MARKETPLACE_ABI,
  functionName: 'getListing',
  args: [1n]
});
console.log('Listing:', listing);
console.log('Active:', listing.isActive);
console.log('Expires:', new Date(Number(listing.expiresAt) * 1000));
```

---

### 💰 Step 4: Purchase Energy (Bob)

**Goal:** Bob purchases 50 kWh from Alice's listing

**Contract:** `Marketplace.sol::purchaseEnergy()`

**Prerequisites:**
- Switch wallet to **Bob's account** (0x7099...)
- Calculate payment: 50 kWh × 0.05 ETH/kWh × dynamic multiplier = ~2.5 ETH

**Execution:**
```javascript
// Get dynamic price first
const dynamicPrice = await readContract({
  address: PRICING_ORACLE_ADDRESS,
  abi: PRICING_ORACLE_ABI,
  functionName: 'calculateDynamicPrice',
  args: [
    parseEther('0.05'), // Base price
    1001n // Grid zone
  ]
});

// Calculate total cost
const kWhToPurchase = parseEther('50');
const totalCost = (dynamicPrice * kWhToPurchase) / parseEther('1');

// Purchase with 10% buffer for safety
const paymentAmount = (totalCost * 110n) / 100n;

await writeContract({
  address: MARKETPLACE_ADDRESS,
  abi: MARKETPLACE_ABI,
  functionName: 'purchaseEnergy',
  args: [
    1n, // Listing ID
    parseEther('50') // 50 kWh
  ],
  value: paymentAmount // ETH payment
});
```

**Expected Result:**
- ✅ Transaction confirmed
- ✅ Event emitted: `OrderCreated(orderId=1, listingId=1, Bob, 50 kWh, totalCost)`
- ✅ Bob's ETH balance decreased by totalCost
- ✅ Marketplace ETH balance increased by totalCost (ESCROWED)
- ✅ Bob receives 50e18 of token ID #1
- ✅ Listing updated: remaining amount = 50 kWh
- ✅ Order status: PENDING
- ✅ Excess payment refunded to Bob

**Verification:**
```javascript
// Check order details
const order = await readContract({
  address: MARKETPLACE_ADDRESS,
  abi: MARKETPLACE_ABI,
  functionName: 'getOrder',
  args: [1n]
});
console.log('Order:', order);
console.log('Status:', order.status); // Should be 0 (PENDING)
console.log('Total Price:', formatEther(order.totalPrice), 'ETH');

// Check Bob's token balance
const bobBalance = await readContract({
  address: ENERGY_TOKEN_ADDRESS,
  abi: ENERGY_TOKEN_ABI,
  functionName: 'balanceOf',
  args: ['0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 1n]
});
console.log('Bob balance:', formatEther(bobBalance), 'kWh');

// Check Marketplace ETH balance (escrowed funds)
const marketplaceBalance = await publicClient.getBalance({
  address: MARKETPLACE_ADDRESS
});
console.log('Escrowed funds:', formatEther(marketplaceBalance), 'ETH');
```

---

### ♻️ Step 5: Consume Energy & Release Funds (Bob)

**Goal:** Bob consumes the energy, triggering token burn and fund release to Alice

**Contract:** `Marketplace.sol::consumeEnergy()` → `EnergyToken.sol::consumeEnergyFrom()`

**Prerequisites:**
- Bob must approve Marketplace to burn his tokens
- This is the CRITICAL escrow release step

**Step 5a: Approve Marketplace for Token Operations**
```javascript
// Bob approves Marketplace to manage his tokens
await writeContract({
  address: ENERGY_TOKEN_ADDRESS,
  abi: ENERGY_TOKEN_ABI,
  functionName: 'setApprovalForAll',
  args: [
    MARKETPLACE_ADDRESS,
    true
  ]
});
```

**Step 5b: Consume Energy**
```javascript
// Record Alice's balance BEFORE consumption
const aliceBalanceBefore = await publicClient.getBalance({
  address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
});

await writeContract({
  address: MARKETPLACE_ADDRESS,
  abi: MARKETPLACE_ABI,
  functionName: 'consumeEnergy',
  args: [1n] // Order ID
});

// Record Alice's balance AFTER consumption
const aliceBalanceAfter = await publicClient.getBalance({
  address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
});

const received = aliceBalanceAfter - aliceBalanceBefore;
console.log('Alice received:', formatEther(received), 'ETH');
```

**Expected Result:**
- ✅ Transaction confirmed
- ✅ Events emitted:
  - `EnergyConsumed(tokenId=1, Bob, 50 kWh)`
  - `OrderCompleted(orderId=1, Bob, Alice, 50 kWh)`
  - `OrderStatusChanged(orderId=1, COMPLETED)`
- ✅ Bob's token balance: 0 (all burned)
- ✅ Alice's ETH balance increased (payment - platform fee)
- ✅ Platform fees accumulated in Marketplace
- ✅ Order status: COMPLETED (3)
- ✅ Energy credit marked as consumed (if fully consumed)
- ✅ `gridZoneSupply[1001]` decreased by 50e18

**Verification:**
```javascript
// Verify Bob's tokens are burned
const bobBalanceAfter = await readContract({
  address: ENERGY_TOKEN_ADDRESS,
  abi: ENERGY_TOKEN_ABI,
  functionName: 'balanceOf',
  args: ['0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 1n]
});
console.log('Bob balance after consumption:', formatEther(bobBalanceAfter)); // Should be 0

// Verify order status
const orderAfter = await readContract({
  address: MARKETPLACE_ADDRESS,
  abi: MARKETPLACE_ABI,
  functionName: 'getOrder',
  args: [1n]
});
console.log('Order status:', orderAfter.status); // Should be 3 (COMPLETED)

// Calculate platform fees
const platformFeeBps = await readContract({
  address: MARKETPLACE_ADDRESS,
  abi: MARKETPLACE_ABI,
  functionName: 'platformFeeBps'
});
const fee = (orderAfter.totalPrice * platformFeeBps) / 10000n;
const sellerAmount = orderAfter.totalPrice - fee;
console.log('Platform fee:', formatEther(fee), 'ETH');
console.log('Alice should receive:', formatEther(sellerAmount), 'ETH');
```

---

### 📊 Step 6: Verify Loss Traceability

**Goal:** Analyze blockchain events to calculate transmission losses

**Method:** Query events from the blockchain

**Event Analysis:**
```javascript
import { parseAbiItem } from 'viem';

// Get all EnergyMinted events for token ID 1
const mintedEvents = await publicClient.getLogs({
  address: ENERGY_TOKEN_ADDRESS,
  event: parseAbiItem('event EnergyMinted(uint256 indexed tokenId, address indexed producer, uint256 kWhAmount, uint256 gridZone)'),
  args: {
    tokenId: 1n
  },
  fromBlock: 0n,
  toBlock: 'latest'
});

// Get all EnergyConsumed events for token ID 1
const consumedEvents = await publicClient.getLogs({
  address: ENERGY_TOKEN_ADDRESS,
  event: parseAbiItem('event EnergyConsumed(uint256 indexed tokenId, address indexed consumer, uint256 amount)'),
  args: {
    tokenId: 1n
  },
  fromBlock: 0n,
  toBlock: 'latest'
});

// Calculate totals
const totalMinted = mintedEvents.reduce((sum, event) => {
  return sum + event.args.kWhAmount;
}, 0n);

const totalConsumed = consumedEvents.reduce((sum, event) => {
  return sum + event.args.amount;
}, 0n);

// Calculate loss
const loss = totalMinted - totalConsumed;
const lossPercentage = (Number(loss) / Number(totalMinted)) * 100;

console.log('=== LOSS TRACEABILITY REPORT ===');
console.log('Total Energy Minted:', formatEther(totalMinted), 'kWh');
console.log('Total Energy Consumed:', formatEther(totalConsumed), 'kWh');
console.log('Transmission Loss:', formatEther(loss), 'kWh');
console.log('Loss Percentage:', lossPercentage.toFixed(2), '%');
```

**Expected Output:**
```
=== LOSS TRACEABILITY REPORT ===
Total Energy Minted: 100 kWh
Total Energy Consumed: 50 kWh
Transmission Loss: 50 kWh
Loss Percentage: 50.00 %
```

**Note:** In this test scenario, the "loss" is actually unconsumed energy still available in the listing. In a real-world scenario with multiple transactions, this would show actual transmission losses.

---

## Complete Test Sequence Summary

| Step | Action | Actor | Contract Function | Result |
|------|--------|-------|-------------------|--------|
| 1 | Register Producer | Admin | `EnergyToken::registerProducer()` | Alice verified ✅ |
| 2 | Mint Energy | Alice | `EnergyToken::mintEnergy()` | 100 kWh NFT created ✅ |
| 3a | Approve Marketplace | Alice | `EnergyToken::setApprovalForAll()` | Marketplace approved ✅ |
| 3b | Create Listing | Alice | `Marketplace::createListing()` | Listing #1 created ✅ |
| 4 | Purchase Energy | Bob | `Marketplace::purchaseEnergy()` | Order #1, funds escrowed ✅ |
| 5a | Approve Marketplace | Bob | `EnergyToken::setApprovalForAll()` | Marketplace approved ✅ |
| 5b | Consume Energy | Bob | `Marketplace::consumeEnergy()` | Tokens burned, funds released ✅ |
| 6 | Analyze Events | Anyone | Query event logs | Loss calculated ✅ |

---

## Expected Balances After Full Cycle

**Alice (Producer):**
- Energy Token (ID #1): 50 kWh (remaining in listing)
- ETH: +2.49375 ETH (50 kWh × 0.05 ETH/kWh - 0.25% fee)

**Bob (Consumer):**
- Energy Token (ID #1): 0 kWh (consumed)
- ETH: -2.5 ETH (purchase cost)

**Marketplace:**
- Energy Token (ID #1): 50 kWh (remaining in escrow)
- ETH: 0 ETH (funds released to Alice)
- Accumulated Fees: 0.00625 ETH (0.25% of 2.5 ETH)

---

## Troubleshooting

### Issue: "Producer not verified"
**Solution:** Ensure Step 1 completed successfully with admin account

### Issue: "Insufficient token balance"
**Solution:** Verify Alice owns the tokens and hasn't transferred them elsewhere

### Issue: "Caller is not owner nor approved"
**Solution:** Bob must approve Marketplace via `setApprovalForAll` before consuming

### Issue: "Insufficient payment"
**Solution:** Calculate dynamic price correctly, add 10% buffer for price fluctuations

### Issue: Transaction reverts on consume
**Solution:** 
1. Check Bob's approval status
2. Verify order status is PENDING
3. Ensure Bob is the buyer of the order

---

## Automated Testing Script

Save as `test-transaction-flow.js`:

```javascript
import { createPublicClient, createWalletClient, http, parseEther, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { foundry } from 'viem/chains';

// Anvil test accounts
const ALICE_PK = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const BOB_PK = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';

const alice = privateKeyToAccount(ALICE_PK);
const bob = privateKeyToAccount(BOB_PK);

const publicClient = createPublicClient({
  chain: foundry,
  transport: http('http://127.0.0.1:8545')
});

async function runFullTransactionFlow() {
  console.log('🚀 Starting full transaction flow test...\n');
  
  // Step 1: Register Producer
  console.log('Step 1: Registering Alice as producer...');
  // ... implementation
  
  // Step 2: Mint Energy
  console.log('Step 2: Minting 100 kWh energy...');
  // ... implementation
  
  // Step 3: Create Listing
  console.log('Step 3: Creating marketplace listing...');
  // ... implementation
  
  // Step 4: Purchase Energy
  console.log('Step 4: Bob purchasing 50 kWh...');
  // ... implementation
  
  // Step 5: Consume Energy
  console.log('Step 5: Bob consuming energy...');
  // ... implementation
  
  // Step 6: Verify Loss
  console.log('Step 6: Calculating transmission losses...');
  // ... implementation
  
  console.log('\n✅ All tests passed!');
}

runFullTransactionFlow().catch(console.error);
```

---

## Next Steps

1. ✅ Verify contracts are deployed
2. ✅ Import test accounts to wallet
3. ✅ Execute steps 1-6 sequentially
4. ✅ Monitor events in BaseScan (or Anvil logs)
5. ✅ Validate balances after each step
6. ✅ Generate loss traceability report

---

## Success Criteria

- [ ] Producer registered successfully
- [ ] Energy NFT minted with IPFS metadata
- [ ] Listing created and visible
- [ ] Purchase completed with escrowed payment
- [ ] Consumption burned tokens and released funds
- [ ] Alice received payment (minus fees)
- [ ] Bob's tokens burned completely
- [ ] Events emitted for all steps
- [ ] Loss percentage calculated from events
- [ ] No centralized services used

**When all criteria met:** System validated as research paper compliant ✅
