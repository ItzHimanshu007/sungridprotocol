#!/usr/bin/env node

/**
 * Marketplace Seeding Script
 * Populates the blockchain with sample energy data and listings
 */

import { createPublicClient, createWalletClient, http, parseEther, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { foundry } from 'viem/chains';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Contract addresses
const CONTRACTS = {
    EnergyToken: '0x68b1d87f95878fe05b998f19b66f4baba5de1aed',
    Marketplace: '0xc6e7df5e7b4f2a278906862b61205850344d4e7d',
    PricingOracle: '0x9a9f2ccfde556a7e9ff0848998aa4a0cfd8863ae',
};

// Anvil test accounts (first 10)
const ACCOUNTS = [
    { name: 'Admin', pk: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' },
    { name: 'Alice', pk: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d', address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' },
    { name: 'Bob', pk: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a', address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' },
    { name: 'Carol', pk: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6', address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' },
    { name: 'Dave', pk: '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a', address: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65' },
    { name: 'Eve', pk: '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba', address: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc' },
    { name: 'Frank', pk: '0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e', address: '0x976EA74026E726554dB657fA54763abd0C3a0aa9' },
    { name: 'Grace', pk: '0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356', address: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955' },
];

// Load ABIs
function loadABI(name) {
    const path = join(__dirname, '..', 'apps', 'web', 'lib', 'abi', `${name}.json`);
    const abiData = JSON.parse(readFileSync(path, 'utf8'));
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
    console.log(`  ⏳ ${description}...`);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`  ✅ Confirmed in block ${receipt.blockNumber}`);
    return receipt;
}

// Sample producer data
const PRODUCERS = [
    { name: 'SolarTech Industries', location: 'Mumbai', zone: 1001, capacity: 250 },
    { name: 'GreenPower Co.', location: 'Bangalore', zone: 1002, capacity: 180 },
    { name: 'Sunshine Energy', location: 'Delhi', zone: 1003, capacity: 320 },
    { name: 'EcoWatt Systems', location: 'Pune', zone: 1001, capacity: 150 },
    { name: 'CleanEnergy Ltd.', location: 'Hyderabad', zone: 1002, capacity: 200 },
];

// Register producers
async function registerProducers() {
    console.log('\n🏭 REGISTERING PRODUCERS...\n');

    const adminWallet = createWallet(ACCOUNTS[0].pk);

    for (let i = 0; i < PRODUCERS.length; i++) {
        const producer = PRODUCERS[i];
        const account = ACCOUNTS[i + 1]; // Skip admin account

        // Check if already registered
        const isRegistered = await publicClient.readContract({
            address: CONTRACTS.EnergyToken,
            abi: ABIS.EnergyToken,
            functionName: 'isVerifiedProducer',
            args: [account.address]
        });

        if (isRegistered) {
            console.log(`  ℹ️  ${producer.name} already registered`);
            continue;
        }

        const hash = await adminWallet.writeContract({
            address: CONTRACTS.EnergyToken,
            abi: ABIS.EnergyToken,
            functionName: 'registerProducer',
            args: [account.address, BigInt(10000 + i)]
        });

        await waitForTx(hash, `Registering ${producer.name}`);
        console.log(`  📍 Location: ${producer.location} | Zone: ${producer.zone} | Capacity: ${producer.capacity} kW\n`);
    }
}

// Generate hourly production data (realistic solar curve)
function generateHourlyProduction(peakCapacity) {
    const hours = [];
    for (let hour = 0; hour < 24; hour++) {
        let production = 0;

        // Solar production curve (6 AM to 6 PM)
        if (hour >= 6 && hour <= 18) {
            const solarHour = hour - 6;
            // Bell curve peaking at noon
            const normalizedHour = (solarHour - 6) / 6; // -1 to 1
            production = peakCapacity * Math.exp(-Math.pow(normalizedHour, 2) * 2);

            // Add some randomness (±10%)
            production *= (0.9 + Math.random() * 0.2);
        }

        hours.push(Math.round(production * 100) / 100);
    }
    return hours;
}

// Mint energy for producers
async function mintEnergyForProducers() {
    console.log('\n⚡ MINTING ENERGY NFTs...\n');

    const tokenIdMap = {};

    for (let i = 0; i < PRODUCERS.length; i++) {
        const producer = PRODUCERS[i];
        const account = ACCOUNTS[i + 1];
        const wallet = createWallet(account.pk);

        // Generate realistic production amount (50-80% of capacity)
        const productionFactor = 0.5 + Math.random() * 0.3;
        const kWhAmount = Math.round(producer.capacity * productionFactor);

        try {
            const hash = await wallet.writeContract({
                address: CONTRACTS.EnergyToken,
                abi: ABIS.EnergyToken,
                functionName: 'mintEnergy',
                args: [
                    account.address,  // Producer address (must match msg.sender)
                    parseEther(kWhAmount.toString()),
                    BigInt(producer.zone),
                    `ipfs://Qm${producer.name.replace(/\s+/g, '')}${Date.now()}`
                ]
            });

            await waitForTx(hash, `Minting energy for ${producer.name}`);

            // Get current token ID
            const tokenId = await publicClient.readContract({
                address: CONTRACTS.EnergyToken,
                abi: ABIS.EnergyToken,
                functionName: 'getCurrentTokenId'
            });

            tokenIdMap[account.address] = tokenId;

            console.log(`  🔋 Amount: ${kWhAmount} kWh | Token ID: ${tokenId} | Zone: ${producer.zone}\n`);
        } catch (error) {
            console.error(`  ❌ Failed to mint for ${producer.name}:`, error.shortMessage || error.message);
        }
    }

    return tokenIdMap;
}

// Create marketplace listings
async function createListings(tokenIdMap) {
    console.log('\n🏪 CREATING MARKETPLACE LISTINGS...\n');

    const listingIds = [];

    for (let i = 0; i < PRODUCERS.length; i++) {
        const producer = PRODUCERS[i];
        const account = ACCOUNTS[i + 1];
        const wallet = createWallet(account.pk);
        const tokenId = tokenIdMap[account.address];

        if (!tokenId) continue;

        // Get token balance
        const balance = await publicClient.readContract({
            address: CONTRACTS.EnergyToken,
            abi: ABIS.EnergyToken,
            functionName: 'balanceOf',
            args: [account.address, tokenId]
        });

        if (balance === 0n) {
            console.log(`  ⚠️  ${producer.name} has no tokens to list`);
            continue;
        }

        // Approve marketplace
        const approvalHash = await wallet.writeContract({
            address: CONTRACTS.EnergyToken,
            abi: ABIS.EnergyToken,
            functionName: 'setApprovalForAll',
            args: [CONTRACTS.Marketplace, true]
        });
        await waitForTx(approvalHash, `Approving marketplace for ${producer.name}`);

        // Random price between 0.03-0.08 ETH per kWh
        const pricePerKwh = parseEther((0.03 + Math.random() * 0.05).toFixed(4));

        // List 70-90% of available energy
        const listAmount = (balance * BigInt(70 + Math.floor(Math.random() * 20))) / 100n;

        // Duration: 3-14 days
        const duration = BigInt((3 + Math.floor(Math.random() * 12)) * 24 * 60 * 60);

        const listingHash = await wallet.writeContract({
            address: CONTRACTS.Marketplace,
            abi: ABIS.Marketplace,
            functionName: 'createListing',
            args: [tokenId, listAmount, pricePerKwh, duration]
        });

        await waitForTx(listingHash, `Creating listing for ${producer.name}`);

        const listingCounter = await publicClient.readContract({
            address: CONTRACTS.Marketplace,
            abi: ABIS.Marketplace,
            functionName: 'getListingCounter'
        });

        listingIds.push(listingCounter);

        console.log(`  💰 Price: ${formatEther(pricePerKwh)} ETH/kWh`);
        console.log(`  📦 Amount: ${formatEther(listAmount)} kWh`);
        console.log(`  🕒 Duration: ${Number(duration) / 86400} days`);
        console.log(`  🆔 Listing ID: ${listingCounter}\n`);
    }

    return listingIds;
}

// Execute sample purchases
async function executeSamplePurchases(listingIds) {
    console.log('\n💳 EXECUTING SAMPLE PURCHASES...\n');

    // Use last 2 accounts as consumers
    const consumers = ACCOUNTS.slice(-2);

    for (let i = 0; i < Math.min(3, listingIds.length); i++) {
        const listingId = listingIds[i];
        const consumer = consumers[i % consumers.length];
        const wallet = createWallet(consumer.pk);

        // Get listing details
        const listing = await publicClient.readContract({
            address: CONTRACTS.Marketplace,
            abi: ABIS.Marketplace,
            functionName: 'getListing',
            args: [listingId]
        });

        if (!listing.isActive) continue;

        // Purchase 30-50% of available amount
        const purchaseAmount = (listing.kWhAmount * BigInt(30 + Math.floor(Math.random() * 20))) / 100n;

        // Calculate payment
        const dynamicPrice = await publicClient.readContract({
            address: CONTRACTS.PricingOracle,
            abi: ABIS.PricingOracle,
            functionName: 'calculateDynamicPrice',
            args: [listing.pricePerKwh, listing.gridZone]
        });

        const totalCost = (dynamicPrice * purchaseAmount) / parseEther('1');
        const paymentAmount = (totalCost * 110n) / 100n; // 10% buffer

        const purchaseHash = await wallet.writeContract({
            address: CONTRACTS.Marketplace,
            abi: ABIS.Marketplace,
            functionName: 'purchaseEnergy',
            args: [listingId, purchaseAmount],
            value: paymentAmount
        });

        await waitForTx(purchaseHash, `${consumer.name} purchasing energy`);

        console.log(`  👤 Buyer: ${consumer.name}`);
        console.log(`  📦 Amount: ${formatEther(purchaseAmount)} kWh`);
        console.log(`  💰 Cost: ${formatEther(totalCost)} ETH\n`);
    }
}

// Main execution
async function main() {
    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║        SUNGRID MARKETPLACE - DATA SEEDING             ║');
    console.log('║     Populating blockchain with sample data...         ║');
    console.log('╚═══════════════════════════════════════════════════════╝');

    try {
        // Step 1: Register producers
        await registerProducers();

        // Step 2: Mint energy
        const tokenIdMap = await mintEnergyForProducers();

        // Step 3: Create listings
        const listingIds = await createListings(tokenIdMap);

        // Step 4: Execute sample purchases
        await executeSamplePurchases(listingIds);

        // Summary
        console.log('\n╔═══════════════════════════════════════════════════════╗');
        console.log('║                  ✅ SEEDING COMPLETE                  ║');
        console.log('╚═══════════════════════════════════════════════════════╝\n');

        console.log('📊 Summary:');
        console.log(`  Producers Registered: ${PRODUCERS.length}`);
        console.log(`  Energy NFTs Minted: ${Object.keys(tokenIdMap).length}`);
        console.log(`  Marketplace Listings: ${listingIds.length}`);
        console.log(`  Sample Purchases: ${Math.min(3, listingIds.length)}`);
        console.log('\n✨ Your marketplace is now populated with data!');
        console.log('🌐 Visit http://localhost:3000 to see the results\n');

    } catch (error) {
        console.error('\n❌ Error occurred:', error.message);
        console.error(error);
        process.exit(1);
    }
}

main();
