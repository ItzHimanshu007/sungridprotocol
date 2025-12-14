import { PrismaClient } from '@prisma/client';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { CONTRACTS } from '../config/contracts';

const prisma = new PrismaClient();

// Create viem client for local Anvil
const publicClient = createPublicClient({
    chain: {
        id: 31337,
        name: 'Anvil Local',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: {
            default: { http: ['http://127.0.0.1:8545'] },
            public: { http: ['http://127.0.0.1:8545'] },
        },
    },
    transport: http('http://127.0.0.1:8545'),
});

// ETH to INR conversion rate (you can fetch this from an API in production)
const ETH_TO_INR = 285000; // Approximate rate

export class BlockchainIndexer {
    private isIndexing = false;
    private lastProcessedBlock = 0;

    async start() {
        console.log('Starting blockchain indexer...');
        this.isIndexing = true;

        // Index past events
        await this.indexPastEvents();

        // Watch for new events
        this.watchNewEvents();
    }

    stop() {
        this.isIndexing = false;
    }

    private async indexPastEvents() {
        try {
            // Get current block number
            const currentBlock = await publicClient.getBlockNumber();

            // Index listing events
            await this.indexListingCreated(0n, currentBlock);
            await this.indexListingCancelled(0n, currentBlock);

            // Index order events
            await this.indexOrderCreated(0n, currentBlock);
            await this.indexOrderCompleted(0n, currentBlock);

            this.lastProcessedBlock = Number(currentBlock);
            console.log(`Indexed events up to block ${currentBlock}`);
        } catch (error) {
            console.error('Error indexing past events:', error);
        }
    }

    private async indexListingCreated(fromBlock: bigint, toBlock: bigint) {
        const logs = await publicClient.getLogs({
            address: CONTRACTS.Marketplace as `0x${string}`,
            event: parseAbiItem('event ListingCreated(uint256 indexed listingId, address indexed seller, uint256 tokenId, uint256 kWhAmount, uint256 pricePerKwh)'),
            fromBlock,
            toBlock,
        });

        for (const log of logs) {
            const { listingId, seller, tokenId, kWhAmount, pricePerKwh } = log.args as any;

            // Check if user exists, create if not
            await prisma.user.upsert({
                where: { walletAddress: seller.toLowerCase() },
                update: {},
                create: {
                    walletAddress: seller.toLowerCase(),
                    role: 'PRODUCER',
                },
            });

            // Get block timestamp for expiry calculation
            const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
            const expiresAt = new Date(Number(block.timestamp) * 1000 + 24 * 60 * 60 * 1000); // 24 hours later

            // Create listing
            await prisma.listing.upsert({
                where: { listingId: Number(listingId) },
                update: {
                    isActive: true,
                    remainingAmount: kWhAmount.toString(),
                },
                create: {
                    listingId: Number(listingId),
                    seller: {
                        connect: { walletAddress: seller.toLowerCase() },
                    },
                    tokenId: Number(tokenId),
                    kWhAmount: kWhAmount.toString(),
                    remainingAmount: kWhAmount.toString(),
                    pricePerKwh: pricePerKwh.toString(),
                    gridZone: 1, // Default, should be fetched from token metadata
                    expiresAt,
                    txHash: log.transactionHash,
                },
            });
        }
    }

    private async indexListingCancelled(fromBlock: bigint, toBlock: bigint) {
        const logs = await publicClient.getLogs({
            address: CONTRACTS.Marketplace as `0x${string}`,
            event: parseAbiItem('event ListingCancelled(uint256 indexed listingId)'),
            fromBlock,
            toBlock,
        });

        for (const log of logs) {
            const { listingId } = log.args as any;

            await prisma.listing.update({
                where: { listingId: Number(listingId) },
                data: { isActive: false },
            });
        }
    }

    private async indexOrderCreated(fromBlock: bigint, toBlock: bigint) {
        const logs = await publicClient.getLogs({
            address: CONTRACTS.Marketplace as `0x${string}`,
            event: parseAbiItem('event OrderCreated(uint256 indexed orderId, uint256 indexed listingId, address buyer, uint256 kWhAmount, uint256 totalPrice)'),
            fromBlock,
            toBlock,
        });

        for (const log of logs) {
            const { orderId, listingId, buyer, kWhAmount, totalPrice } = log.args as any;

            // Ensure buyer exists
            await prisma.user.upsert({
                where: { walletAddress: buyer.toLowerCase() },
                update: {},
                create: {
                    walletAddress: buyer.toLowerCase(),
                    role: 'CONSUMER',
                },
            });

            // Get listing to find seller
            const listing = await prisma.listing.findUnique({
                where: { listingId: Number(listingId) },
            });

            if (listing) {
                await prisma.order.create({
                    data: {
                        orderId: Number(orderId),
                        listing: { connect: { id: listing.id } },
                        buyer: { connect: { walletAddress: buyer.toLowerCase() } },
                        seller: { connect: { id: listing.sellerId } },
                        kWhAmount: kWhAmount.toString(),
                        pricePerKwh: listing.pricePerKwh,
                        totalPrice: totalPrice.toString(),
                        platformFee: '0', // Calculate from totalPrice
                        status: 'PENDING',
                        txHash: log.transactionHash,
                    },
                });

                // Update listing remaining amount
                const newRemaining = BigInt(listing.remainingAmount) - kWhAmount;
                await prisma.listing.update({
                    where: { id: listing.id },
                    data: {
                        remainingAmount: newRemaining.toString(),
                        isActive: newRemaining > 0,
                    },
                });
            }
        }
    }

    private async indexOrderCompleted(fromBlock: bigint, toBlock: bigint) {
        const logs = await publicClient.getLogs({
            address: CONTRACTS.Marketplace as `0x${string}`,
            event: parseAbiItem('event OrderCompleted(uint256 indexed orderId, address buyer, address seller, uint256 amount)'),
            fromBlock,
            toBlock,
        });

        for (const log of logs) {
            const { orderId } = log.args as any;

            await prisma.order.update({
                where: { orderId: Number(orderId) },
                data: {
                    status: 'COMPLETED',
                    completedAt: new Date(),
                },
            });
        }
    }

    private watchNewEvents() {
        // In production, implement WebSocket watching for real-time updates
        // For now, poll every 5 seconds
        setInterval(async () => {
            if (!this.isIndexing) return;

            try {
                const currentBlock = await publicClient.getBlockNumber();
                if (Number(currentBlock) > this.lastProcessedBlock) {
                    await this.indexPastEvents();
                }
            } catch (error) {
                console.error('Error watching new events:', error);
            }
        }, 5000);
    }
}

// Export singleton instance
export const indexer = new BlockchainIndexer();
