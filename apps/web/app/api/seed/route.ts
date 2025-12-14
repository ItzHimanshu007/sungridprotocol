
import { createWalletClient, http, publicActions, parseEther, parseEventLogs } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { anvil } from 'viem/chains';
import { CONTRACTS } from '@/lib/contracts';
import EnergyTokenABI from '@/lib/abi/EnergyToken.json';
import MarketplaceABI from '@/lib/abi/Marketplace.json';
import { NextRequest, NextResponse } from 'next/server';

// Extract the abi arrays
const EnergyTokenAbi = EnergyTokenABI.abi;
const MarketplaceAbi = MarketplaceABI.abi;

// Anvil Accounts
// 0: Admin/Deployer
const ADMIN_PK = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
// 1: Seller A
const SELLER_A_PK = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
// 2: Seller B
const SELLER_B_PK = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a';
const SELLER_C_PK = '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6';
const SELLER_D_PK = '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a';

const chain = anvil;
const transport = http('http://127.0.0.1:8545');

export async function POST(req: NextRequest) {
    try {
        const adminAccount = privateKeyToAccount(ADMIN_PK);
        const adminClient = createWalletClient({
            account: adminAccount,
            chain,
            transport
        }).extend(publicActions);

        // 1. Setup Admin (Oracle Role)
        console.log("Setting up Admin Role...");
        const { keccak256, stringToBytes } = await import('viem');
        const oracleRoleHash = keccak256(stringToBytes("ORACLE_ROLE"));

        try {
            await adminClient.writeContract({
                address: CONTRACTS.EnergyToken as `0x${string}`,
                abi: EnergyTokenAbi as any,
                functionName: 'grantRole',
                args: [oracleRoleHash, adminAccount.address]
            });
        } catch (e) {
            console.log("Role might already be granted");
        }

        // 2. Seed Realistic Listings which match our Demo UI scenarios
        // Listing 1: 50 kWh Solar in Downtown (Zone 1)
        await setupSeller(adminClient, SELLER_A_PK, 101, 50, "Zone 1", 1, 0.0001);

        // Listing 2: 120 kWh Solar in Industrial Park (Zone 2)
        await setupSeller(adminClient, SELLER_B_PK, 102, 120, "Zone 2", 2, 0.00008);

        // Listing 3: 25 kWh Solar (Residential) (Zone 1)
        await setupSeller(adminClient, SELLER_C_PK, 103, 25, "Zone 1", 1, 0.00009);

        // Listing 4: 200 kWh Wind (Outskirts) (Zone 3)
        await setupSeller(adminClient, SELLER_D_PK, 104, 200, "Zone 3", 3, 0.00007);

        return NextResponse.json({ success: true, message: "Marketplace seeded successfully" });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

async function setupSeller(adminClient: any, sellerPk: string, meterId: number, amountKwh: number, zoneName: string, zoneId: number, priceEth: number) {
    const sellerAccount = privateKeyToAccount(sellerPk as `0x${string}`);
    const sellerClient = createWalletClient({
        account: sellerAccount,
        chain,
        transport
    }).extend(publicActions);

    console.log(`Processing Seller ${sellerAccount.address}...`);

    // A. Register Producer (Admin action)
    const isVerified = await adminClient.readContract({
        address: CONTRACTS.EnergyToken,
        abi: EnergyTokenAbi as any,
        functionName: 'isVerifiedProducer',
        args: [sellerAccount.address]
    });

    if (!isVerified) {
        const hash = await adminClient.writeContract({
            address: CONTRACTS.EnergyToken,
            abi: EnergyTokenAbi as any,
            functionName: 'registerProducer',
            args: [sellerAccount.address, BigInt(meterId)]
        });
        await adminClient.waitForTransactionReceipt({ hash });
        console.log("Registered producer");
    }

    // B. Mint Energy (Admin/Oracle action)
    const mintHash = await adminClient.writeContract({
        address: CONTRACTS.EnergyToken,
        abi: EnergyTokenAbi as any,
        functionName: 'mintEnergy',
        args: [
            sellerAccount.address,
            parseEther(amountKwh.toString()),
            BigInt(zoneId),
            `ipfs://QmMock${meterId}`
        ]
    });
    const mintReceipt = await adminClient.waitForTransactionReceipt({ hash: mintHash });

    // Parse Token ID from logs
    // Event: EnergyMinted(uint256,address,uint256,uint256)
    // We can fetch latest token ID or parse logs.
    // Simplifying: fetch `getCurrentTokenId`
    const tokenId = await adminClient.readContract({
        address: CONTRACTS.EnergyToken,
        abi: EnergyTokenAbi as any,
        functionName: 'getCurrentTokenId'
    });
    console.log(`Minted Token ID: ${tokenId}`);

    // C. List on Marketplace (Seller action)
    // Approve
    const approveHash = await sellerClient.writeContract({
        address: CONTRACTS.EnergyToken,
        abi: EnergyTokenAbi as any,
        functionName: 'setApprovalForAll',
        args: [CONTRACTS.Marketplace, true]
    });
    await sellerClient.waitForTransactionReceipt({ hash: approveHash });

    // Create Listing
    const listHash = await sellerClient.writeContract({
        address: CONTRACTS.Marketplace,
        abi: MarketplaceAbi as any,
        functionName: 'createListing',
        args: [
            tokenId,
            parseEther(amountKwh.toString()),
            parseEther(priceEth.toString()),
            BigInt(7 * 24 * 3600) // 7 days
        ]
    });
    await sellerClient.waitForTransactionReceipt({ hash: listHash });
    console.log("Listing created");
}
