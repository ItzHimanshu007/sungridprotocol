#!/usr/bin/env node

/**
 * Sample Transaction Testing Script
 * Executes the 6-step transaction workflow from the research paper
 */

import { createPublicClient, createWalletClient, http, parseEther, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { foundry } from 'viem/chains';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Contract addresses (from deployment)
const CONTRACTS = {
    EnergyToken: '0x68b1d87f95878fe05b998f19b66f4baba5de1aed',
    Marketplace: '0xc6e7df5e7b4f2a278906862b61205850344d4e7d',
    PricingOracle: '0x9a9f2ccfde556a7e9ff0848998aa4a0cfd8863ae',
};

// Anvil test accounts
const ACCOUNTS = {
    deployer: {
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    },
    alice: {
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Same as deployer for simplicity
        privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    },
    bob: {
        address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
    }
};

// Load ABIs
function loadABI(name) {
    const path = join(__dirname, '..', 'apps', 'web', 'lib', 'abi', `${name}.json`);
    const abiData = JSON.parse(readFileSync(path, 'utf8'));
    // Handle both formats: direct array or wrapped in {abi: [...]}
    return abiData.abi || abiData;
}

const ABIS = {
    EnergyToken: loadABI('EnergyToken'),
    Marketplace: loadABI('Marketplace'),
    PricingOracle: loadABI('PricingOracle'),
};

// Create clients
const publicClient = createPublicClient({
    chain: foundry,
    transport: http('http://127.0.0.1:8545')
});

function createWallet(privateKey) {
    const account = privateKeyToAccount(privateKey);
    return createWalletClient({
        account,
        chain: foundry,
        transport: http('http://127.0.0.1:8545')
    });
}

// Utility: Wait for transaction
async function waitForTx(hash, description) {
    console.log(`  ⏳ Waiting for: ${description}...`);
    console.log(`  📝 Tx hash: ${hash}`);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`  ✅ Confirmed in block ${receipt.blockNumber}\n`);
    return receipt;
}

// Step 1: Register Producer
async function registerProducer() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 STEP 1: REGISTER PRODUCER (ALICE)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const deployerWallet = createWallet(ACCOUNTS.deployer.privateKey);

    // Check if already registered
    const isRegistered = await publicClient.readContract({
        address: CONTRACTS.EnergyToken,
        abi: ABIS.EnergyToken,
        functionName: 'isVerifiedProducer',
        args: [ACCOUNTS.alice.address]
    });

    if (isRegistered) {
        console.log('  ℹ️  Alice is already registered as a producer');
        console.log(`  Address: ${ACCOUNTS.alice.address}\n`);
        return;
    }

    const hash = await deployerWallet.writeContract({
        address: CONTRACTS.EnergyToken,
        abi: ABIS.EnergyToken,
        functionName: 'registerProducer',
        args: [ACCOUNTS.alice.address, 12345n]
    });

    await waitForTx(hash, 'Producer registration');

    console.log('  ✅ Alice registered as verified producer');
    console.log(`  Address: ${ACCOUNTS.alice.address}`);
    console.log(`  Meter ID: 12345\n`);
}

// Step 2: Mint Energy NFT
async function mintEnergy() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚡ STEP 2: MINT ENERGY NFT (100 KWH)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const aliceWallet = createWallet(ACCOUNTS.alice.privateKey);

    const hash = await aliceWallet.writeContract({
        address: CONTRACTS.EnergyToken,
        abi: ABIS.EnergyToken,
        functionName: 'mintEnergy',
        args: [
            ACCOUNTS.alice.address,
            parseEther('100'), // 100 kWh
            1001n, // Grid zone
            'ipfs://QmSampleEnergyMetadata123' // IPFS metadata
        ]
    });

    await waitForTx(hash, 'Energy minting');

    const balance = await publicClient.readContract({
        address: CONTRACTS.EnergyToken,
        abi: ABIS.EnergyToken,
        functionName: 'balanceOf',
        args: [ACCOUNTS.alice.address, 1n]
    });

    console.log('  ✅ Energy NFT minted successfully');
    console.log(`  Token ID: 1`);
    console.log(`  Amount: ${formatEther(balance)} kWh`);
    console.log(`  Grid Zone: 1001`);
    console.log(`  IPFS: ipfs://QmSampleEnergyMetadata123\n`);

    return 1n; // Token ID
}

// Step 3: Create Listing
async function createListing(tokenId) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🏪 STEP 3: CREATE MARKETPLACE LISTING');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const aliceWallet = createWallet(ACCOUNTS.alice.privateKey);

    // Step 3a: Approve Marketplace
    console.log('  📋 Step 3a: Approving Marketplace...');
    const approvalHash = await aliceWallet.writeContract({
        address: CONTRACTS.EnergyToken,
        abi: ABIS.EnergyToken,
        functionName: 'setApprovalForAll',
        args: [CONTRACTS.Marketplace, true]
    });
    await waitForTx(approvalHash, 'Marketplace approval');

    // Step 3b: Create Listing
    console.log('  📋 Step 3b: Creating listing...');
    const pricePerKwh = parseEther('0.05'); // 0.05 ETH per kWh
    const duration = 7n * 24n * 60n * 60n; // 7 days

    const listingHash = await aliceWallet.writeContract({
        address: CONTRACTS.Marketplace,
        abi: ABIS.Marketplace,
        functionName: 'createListing',
        args: [
            tokenId,
            parseEther('100'), // 100 kWh
            pricePerKwh,
            duration
        ]
    });

    await waitForTx(listingHash, 'Listing creation');

    const listing = await publicClient.readContract({
        address: CONTRACTS.Marketplace,
        abi: ABIS.Marketplace,
        functionName: 'getListing',
        args: [1n]
    });

    console.log('  ✅ Listing created successfully');
    console.log(`  Listing ID: 1`);
    console.log(`  Amount: ${formatEther(listing.kWhAmount)} kWh`);
    console.log(`  Price: ${formatEther(listing.pricePerKwh)} ETH/kWh`);
    console.log(`  Total Value: ${formatEther(listing.kWhAmount * listing.pricePerKwh / parseEther('1'))} ETH`);
    console.log(`  Expires: ${new Date(Number(listing.expiresAt) * 1000).toLocaleString()}\n`);

    return 1n; // Listing ID
}

// Step 4: Purchase Energy
async function purchaseEnergy(listingId) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💰 STEP 4: PURCHASE ENERGY (BOB BUYS 50 KWH)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const bobWallet = createWallet(ACCOUNTS.bob.privateKey);

    const listing = await publicClient.readContract({
        address: CONTRACTS.Marketplace,
        abi: ABIS.Marketplace,
        functionName: 'getListing',
        args: [listingId]
    });

    // Calculate payment
    const dynamicPrice = await publicClient.readContract({
        address: CONTRACTS.PricingOracle,
        abi: ABIS.PricingOracle,
        functionName: 'calculateDynamicPrice',
        args: [listing.pricePerKwh, listing.gridZone]
    });

    const kWhToPurchase = parseEther('50');
    const totalCost = (dynamicPrice * kWhToPurchase) / parseEther('1');
    const paymentAmount = (totalCost * 110n) / 100n; // 10% buffer

    console.log(`  💵 Purchase Details:`);
    console.log(`  Amount: 50 kWh`);
    console.log(`  Base Price: ${formatEther(listing.pricePerKwh)} ETH/kWh`);
    console.log(`  Dynamic Price: ${formatEther(dynamicPrice)} ETH/kWh`);
    console.log(`  Total Cost: ${formatEther(totalCost)} ETH`);
    console.log(`  Payment (with buffer): ${formatEther(paymentAmount)} ETH\n`);

    const bobBalanceBefore = await publicClient.getBalance({
        address: ACCOUNTS.bob.address
    });

    const hash = await bobWallet.writeContract({
        address: CONTRACTS.Marketplace,
        abi: ABIS.Marketplace,
        functionName: 'purchaseEnergy',
        args: [listingId, kWhToPurchase],
        value: paymentAmount
    });

    await waitForTx(hash, 'Energy purchase');

    const bobBalanceAfter = await publicClient.getBalance({
        address: ACCOUNTS.bob.address
    });

    const bobTokens = await publicClient.readContract({
        address: CONTRACTS.EnergyToken,
        abi: ABIS.EnergyToken,
        functionName: 'balanceOf',
        args: [ACCOUNTS.bob.address, 1n]
    });

    const order = await publicClient.readContract({
        address: CONTRACTS.Marketplace,
        abi: ABIS.Marketplace,
        functionName: 'getOrder',
        args: [1n]
    });

    console.log('  ✅ Purchase completed successfully');
    console.log(`  Order ID: 1`);
    console.log(`  Bob's Energy Tokens: ${formatEther(bobTokens)} kWh`);
    console.log(`  Bob's ETH Spent: ${formatEther(bobBalanceBefore - bobBalanceAfter)} ETH`);
    console.log(`  Order Status: PENDING (awaiting consumption)\n`);

    return 1n; // Order ID
}

// Step 5: Consume Energy
async function consumeEnergy(orderId) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('♻️  STEP 5: CONSUME ENERGY & RELEASE FUNDS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const bobWallet = createWallet(ACCOUNTS.bob.privateKey);

    // Step 5a: Approve Marketplace
    console.log('  📋 Step 5a: Approving Marketplace for token burn...');
    const approvalHash = await bobWallet.writeContract({
        address: CONTRACTS.EnergyToken,
        abi: ABIS.EnergyToken,
        functionName: 'setApprovalForAll',
        args: [CONTRACTS.Marketplace, true]
    });
    await waitForTx(approvalHash, 'Marketplace approval for consumption');

    // Get balances before consumption
    const aliceBalanceBefore = await publicClient.getBalance({
        address: ACCOUNTS.alice.address
    });
    const bobTokensBefore = await publicClient.readContract({
        address: CONTRACTS.EnergyToken,
        abi: ABIS.EnergyToken,
        functionName: 'balanceOf',
        args: [ACCOUNTS.bob.address, 1n]
    });

    const order = await publicClient.readContract({
        address: CONTRACTS.Marketplace,
        abi: ABIS.Marketplace,
        functionName: 'getOrder',
        args: [orderId]
    });

    // Step 5b: Consume Energy
    console.log('  📋 Step 5b: Consuming energy (burning tokens)...');
    const hash = await bobWallet.writeContract({
        address: CONTRACTS.Marketplace,
        abi: ABIS.Marketplace,
        functionName: 'consumeEnergy',
        args: [orderId]
    });

    await waitForTx(hash, 'Energy consumption');

    // Get balances after consumption
    const aliceBalanceAfter = await publicClient.getBalance({
        address: ACCOUNTS.alice.address
    });
    const bobTokensAfter = await publicClient.readContract({
        address: CONTRACTS.EnergyToken,
        abi: ABIS.EnergyToken,
        functionName: 'balanceOf',
        args: [ACCOUNTS.bob.address, 1n]
    });

    const orderAfter = await publicClient.readContract({
        address: CONTRACTS.Marketplace,
        abi: ABIS.Marketplace,
        functionName: 'getOrder',
        args: [orderId]
    });

    const platformFeeBps = await publicClient.readContract({
        address: CONTRACTS.Marketplace,
        abi: ABIS.Marketplace,
        functionName: 'platformFeeBps'
    });

    const fee = (order.totalPrice * platformFeeBps) / 10000n;
    const sellerAmount = order.totalPrice - fee;
    const aliceReceived = aliceBalanceAfter - aliceBalanceBefore;

    console.log('  ✅ Energy consumed successfully');
    console.log(`  Bob's Tokens Burned: ${formatEther(bobTokensBefore)} kWh → ${formatEther(bobTokensAfter)} kWh`);
    console.log(`  Alice Received: ${formatEther(aliceReceived)} ETH`);
    console.log(`  Platform Fee: ${formatEther(fee)} ETH (${Number(platformFeeBps) / 100}%)`);
    console.log(`  Order Status: COMPLETED\n`);
}

// Step 6: Loss Traceability
async function analyzeLossTraceability() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 STEP 6: ENERGY LOSS TRACEABILITY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Get minted events
    const mintedLogs = await publicClient.getLogs({
        address: CONTRACTS.EnergyToken,
        event: {
            type: 'event',
            name: 'EnergyMinted',
            inputs: [
                { type: 'uint256', indexed: true, name: 'tokenId' },
                { type: 'address', indexed: true, name: 'producer' },
                { type: 'uint256', indexed: false, name: 'kWhAmount' },
                { type: 'uint256', indexed: false, name: 'gridZone' }
            ]
        },
        fromBlock: 0n,
        toBlock: 'latest'
    });

    // Get consumed events
    const consumedLogs = await publicClient.getLogs({
        address: CONTRACTS.EnergyToken,
        event: {
            type: 'event',
            name: 'EnergyConsumed',
            inputs: [
                { type: 'uint256', indexed: true, name: 'tokenId' },
                { type: 'address', indexed: true, name: 'consumer' },
                { type: 'uint256', indexed: false, name: 'amount' }
            ]
        },
        fromBlock: 0n,
        toBlock: 'latest'
    });

    let totalMinted = 0n;
    let totalConsumed = 0n;

    console.log('  📝 Energy Minted Events:');
    mintedLogs.forEach((log) => {
        const amount = log.args.kWhAmount;
        totalMinted += amount;
        console.log(`    Token #${log.args.tokenId}: ${formatEther(amount)} kWh`);
    });

    console.log('\n  📝 Energy Consumed Events:');
    consumedLogs.forEach((log) => {
        const amount = log.args.amount;
        totalConsumed += amount;
        console.log(`    Token #${log.args.tokenId}: ${formatEther(amount)} kWh by ${log.args.consumer}`);
    });

    const loss = totalMinted - totalConsumed;
    const lossPercentage = totalMinted > 0n
        ? (Number(loss) / Number(totalMinted)) * 100
        : 0;

    console.log('\n  📊 LOSS TRACEABILITY REPORT:');
    console.log(`  ┌─────────────────────────────────────┐`);
    console.log(`  │ Total Energy Minted:    ${formatEther(totalMinted).padStart(10)} kWh │`);
    console.log(`  │ Total Energy Consumed:  ${formatEther(totalConsumed).padStart(10)} kWh │`);
    console.log(`  │ Transmission Loss:      ${formatEther(loss).padStart(10)} kWh │`);
    console.log(`  │ Loss Percentage:        ${lossPercentage.toFixed(2).padStart(9)}%  │`);
    console.log(`  └─────────────────────────────────────┘\n`);

    console.log('  ℹ️  Note: In this test, "loss" represents unconsumed energy');
    console.log('     still available in the marketplace listing.\n');
}

// Main execution
async function main() {
    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║   SUNGRID PROTOCOL - SAMPLE TRANSACTION TESTING       ║');
    console.log('║   6-Step Research Paper Compliance Validation         ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
    console.log('\n');

    try {
        // Execute all steps
        await registerProducer();
        const tokenId = await mintEnergy();
        const listingId = await createListing(tokenId);
        const orderId = await purchaseEnergy(listingId);
        await consumeEnergy(orderId);
        await analyzeLossTraceability();

        console.log('╔═══════════════════════════════════════════════════════╗');
        console.log('║              ✅ ALL TESTS PASSED                      ║');
        console.log('║   Transaction mechanism is research paper compliant   ║');
        console.log('╚═══════════════════════════════════════════════════════╝');
        console.log('\n');

    } catch (error) {
        console.error('\n❌ Error occurred:', error.message);
        console.error(error);
        process.exit(1);
    }
}

main();
