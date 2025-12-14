#!/usr/bin/env node

/**
 * Simple Marketplace Seeding Script
 * Uses admin account to seed data
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

// Admin account (has ORACLE_ROLE)
const ADMIN = {
    pk: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
};

// Producer accounts
const PRODUCERS = [
    { address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', pk: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d', name: 'SolarTech', zone: 1001, capacity: 250 },
    { address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', pk: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a', name: 'GreenPower', zone: 1002, capacity: 180 },
    { address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906', pk: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6', name: 'Sunshine', zone: 1003, capacity: 320 },
    { address: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', pk: '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a', name: 'EcoWatt', zone: 1001, capacity: 150 },
    { address: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc', pk: '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba', name: 'CleanEnergy', zone: 1002, capacity: 200 },
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

async function main() {
    console.log('\n🌱 SEEDING MARKETPLACE WITH SAMPLE DATA...\n');

    const adminWallet = createWallet(ADMIN.pk);

    //1. Grant ORACLE_ROLE to admin
    console.log('Setting up ORACLE_ROLE...');
    try {
        const hash = await adminWallet.writeContract({
            address: CONTRACTS.EnergyToken,
            abi: ABIS.EnergyToken,
            functionName: 'grantRole',
            args: ['0x68e79a7bf1e0bc45d0a330c573bc367f9cf464fd326078812f301165fbda4ef1', ADMIN.address] // ORACLE_ROLE
        });
        await publicClient.waitForTransactionReceipt({ hash });
        console.log('✅ ORACLE_ROLE granted\n');
    } catch (e) {
        console.log('ℹ️  ORACLE_ROLE already set\n');
    }

    // 2. Mint + List energy for each producer
    for (const producer of PRODUCERS) {
        const producerWallet = createWallet(producer.pk);

        // Register if needed
        const isRegistered = await publicClient.readContract({
            address: CONTRACTS.EnergyToken,
            abi: ABIS.EnergyToken,
            functionName: 'isVerifiedProducer',
            args: [producer.address]
        });

        if (!isRegistered) {
            console.log(`📝 Registering ${producer.name}...`);
            const regHash = await adminWallet.writeContract({
                address: CONTRACTS.EnergyToken,
                abi: ABIS.EnergyToken,
                functionName: 'registerProducer',
                args: [producer.address, BigInt(10000 + PRODUCERS.indexOf(producer))]
            });
            await publicClient.waitForTransactionReceipt({ hash: regHash });
        }

        // Mint energy (as oracle/admin)
        const kWhAmount = Math.round(producer.capacity * (0.6 + Math.random() * 0.2));
        console.log(`⚡ Minting ${kWhAmount} kWh for ${producer.name}...`);

        const mintHash = await adminWallet.writeContract({
            address: CONTRACTS.EnergyToken,
            abi: ABIS.EnergyToken,
            functionName: 'mintEnergy',
            args: [
                producer.address,
                parseEther(kWhAmount.toString()),
                BigInt(producer.zone),
                `ipfs://Qm${producer.name}${Date.now()}`
            ]
        });
        await publicClient.waitForTransactionReceipt({ hash: mintHash });

        // Get token ID
        const tokenId = await publicClient.readContract({
            address: CONTRACTS.EnergyToken,
            abi: ABIS.EnergyToken,
            functionName: 'getCurrentTokenId'
        });

        // Create listing (as producer)
        console.log(`🏪 Creating listing for ${producer.name}...`);

        // Approve marketplace
        const approveHash = await producerWallet.writeContract({
            address: CONTRACTS.EnergyToken,
            abi: ABIS.EnergyToken,
            functionName: 'setApprovalForAll',
            args: [CONTRACTS.Marketplace, true]
        });
        await publicClient.waitForTransactionReceipt({ hash: approveHash });

        // List 80% of energy
        const listAmount = (parseEther(kWhAmount.toString()) * 80n) / 100n;
        const pricePerKwh = parseEther((0.04 + Math.random() * 0.03).toFixed(4));
        const duration = BigInt(7 * 24 * 60 * 60); // 7 days

        const listHash = await producerWallet.writeContract({
            address: CONTRACTS.Marketplace,
            abi: ABIS.Marketplace,
            functionName: 'createListing',
            args: [tokenId, listAmount, pricePerKwh, duration]
        });
        await publicClient.waitForTransactionReceipt({ hash: listHash });

        console.log(`✅ ${formatEther(listAmount)} kWh listed @ ${formatEther(pricePerKwh)} ETH/kWh\n`);
    }

    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║              ✅ SEEDING COMPLETE                      ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    console.log(`📊 Created ${PRODUCERS.length} listings`);
    console.log('🌐 Refresh your dashboard to see the data!\n');
}

main().catch(console.error);
