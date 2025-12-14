import { useQuery } from '@tanstack/react-query';
import { useAccount, usePublicClient, useReadContract } from 'wagmi';
import { CONTRACTS, ABIS } from '@/lib/contracts';
import { formatEther, parseAbiItem } from 'viem';

export interface UserEnergyNFT {
    tokenId: bigint;
    balance: bigint;
    kWhAmount: string;
    gridZone: number;
    producer: string;
    timestamp: number;
    isConsumed: boolean;
}

export interface UserListing {
    listingId: bigint;
    tokenId: bigint;
    kWhAmount: string;
    pricePerKwh: string;
    gridZone: number;
    createdAt: number;
    expiresAt: number;
    isActive: boolean;
}

export interface UserOrder {
    orderId: bigint;
    listingId: bigint;
    seller: string;
    kWhAmount: string;
    totalPrice: string;
    createdAt: number;
    status: number;
    consumed: boolean;
}

export interface ConsumptionEvent {
    tokenId: bigint;
    consumer: string;
    amount: string;
    timestamp: number;
    transactionHash: string;
}

export interface UserPortfolio {
    ownedNFTs: UserEnergyNFT[];
    activeListings: UserListing[];
    purchasedOrders: UserOrder[];
    consumptionHistory: ConsumptionEvent[];
    totalEnergyOwned: string;
    totalEnergyConsumed: string;
    activeListingsCount: number;
    totalOrdersCount: number;
}

export function useUserPortfolio() {
    const { address } = useAccount();
    const publicClient = usePublicClient();

    // Get user's current token ID (to limit balance queries)
    const { data: currentTokenId } = useReadContract({
        address: CONTRACTS.EnergyToken as `0x${string}`,
        abi: ABIS.EnergyToken,
        functionName: 'getCurrentTokenId',
    });

    // Get seller listings
    const { data: sellerListingIds } = useReadContract({
        address: CONTRACTS.Marketplace as `0x${string}`,
        abi: ABIS.Marketplace,
        functionName: 'getSellerListings',
        args: [address!],
        query: {
            enabled: !!address,
        },
    });

    // Get buyer orders
    const { data: buyerOrderIds } = useReadContract({
        address: CONTRACTS.Marketplace as `0x${string}`,
        abi: ABIS.Marketplace,
        functionName: 'getBuyerOrders',
        args: [address!],
        query: {
            enabled: !!address,
        },
    });

    return useQuery({
        queryKey: ['userPortfolio', address, currentTokenId?.toString(), sellerListingIds?.toString(), buyerOrderIds?.toString()],
        queryFn: async (): Promise<UserPortfolio> => {
            if (!address || !publicClient) {
                return getEmptyPortfolio();
            }

            try {
                // 1. FETCH OWNED NFTs
                const ownedNFTs: UserEnergyNFT[] = [];
                const maxTokenId = currentTokenId ? Number(currentTokenId) : 0;

                for (let tokenId = 1; tokenId <= Math.min(maxTokenId, 100); tokenId++) {
                    const balance = await publicClient.readContract({
                        address: CONTRACTS.EnergyToken as `0x${string}`,
                        abi: ABIS.EnergyToken,
                        functionName: 'balanceOf',
                        args: [address, BigInt(tokenId)],
                    }) as bigint;

                    if (balance > 0n) {
                        const credit = await publicClient.readContract({
                            address: CONTRACTS.EnergyToken as `0x${string}`,
                            abi: ABIS.EnergyToken,
                            functionName: 'getEnergyCredit',
                            args: [BigInt(tokenId)],
                        }) as any;

                        ownedNFTs.push({
                            tokenId: BigInt(tokenId),
                            balance,
                            kWhAmount: formatEther(credit.kWhAmount),
                            gridZone: Number(credit.gridZone),
                            producer: credit.producer,
                            timestamp: Number(credit.timestamp),
                            isConsumed: credit.isConsumed,
                        });
                    }
                }

                // 2. FETCH ACTIVE LISTINGS
                const activeListings: UserListing[] = [];
                if (sellerListingIds && Array.isArray(sellerListingIds)) {
                    for (const listingId of sellerListingIds) {
                        const listing = await publicClient.readContract({
                            address: CONTRACTS.Marketplace as `0x${string}`,
                            abi: ABIS.Marketplace,
                            functionName: 'getListing',
                            args: [listingId],
                        }) as any;

                        if (listing.isActive) {
                            activeListings.push({
                                listingId,
                                tokenId: listing.tokenId,
                                kWhAmount: formatEther(listing.kWhAmount),
                                pricePerKwh: formatEther(listing.pricePerKwh),
                                gridZone: Number(listing.gridZone),
                                createdAt: Number(listing.createdAt),
                                expiresAt: Number(listing.expiresAt),
                                isActive: listing.isActive,
                            });
                        }
                    }
                }

                // 3. FETCH PURCHASED ORDERS
                const purchasedOrders: UserOrder[] = [];
                if (buyerOrderIds && Array.isArray(buyerOrderIds)) {
                    for (const orderId of buyerOrderIds) {
                        const order = await publicClient.readContract({
                            address: CONTRACTS.Marketplace as `0x${string}`,
                            abi: ABIS.Marketplace,
                            functionName: 'getOrder',
                            args: [orderId],
                        }) as any;

                        purchasedOrders.push({
                            orderId,
                            listingId: order.listingId,
                            seller: order.seller,
                            kWhAmount: formatEther(order.kWhAmount),
                            totalPrice: formatEther(order.totalPrice),
                            createdAt: Number(order.createdAt),
                            status: Number(order.status),
                            consumed: Number(order.status) === 2, // COMPLETED status
                        });
                    }
                }

                // 4. FETCH CONSUMPTION HISTORY FROM EVENTS
                const consumptionHistory: ConsumptionEvent[] = [];
                try {
                    const logs = await publicClient.getLogs({
                        address: CONTRACTS.EnergyToken as `0x${string}`,
                        event: parseAbiItem('event EnergyConsumed(uint256 indexed tokenId, address indexed consumer, uint256 amount)'),
                        args: {
                            consumer: address,
                        },
                        fromBlock: 0n,
                        toBlock: 'latest',
                    });

                    for (const log of logs) {
                        const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
                        consumptionHistory.push({
                            tokenId: log.args.tokenId!,
                            consumer: log.args.consumer!,
                            amount: formatEther(log.args.amount!),
                            timestamp: Number(block.timestamp),
                            transactionHash: log.transactionHash,
                        });
                    }
                } catch (error) {
                    console.error('Error fetching consumption events:', error);
                }

                // 5. CALCULATE TOTALS
                const totalEnergyOwned = ownedNFTs.reduce((sum, nft) => sum + parseFloat(nft.kWhAmount) * Number(nft.balance), 0).toFixed(2);
                const totalEnergyConsumed = consumptionHistory.reduce((sum, event) => sum + parseFloat(event.amount), 0).toFixed(2);

                return {
                    ownedNFTs,
                    activeListings,
                    purchasedOrders,
                    consumptionHistory,
                    totalEnergyOwned,
                    totalEnergyConsumed,
                    activeListingsCount: activeListings.length,
                    totalOrdersCount: purchasedOrders.length,
                };
            } catch (error) {
                console.error('Error fetching user portfolio:', error);
                return getEmptyPortfolio();
            }
        },
        enabled: !!address && !!publicClient,
        refetchInterval: 30000, // Refetch every 30s
        staleTime: 10000, // Consider stale after 10s
    });
}

function getEmptyPortfolio(): UserPortfolio {
    return {
        ownedNFTs: [],
        activeListings: [],
        purchasedOrders: [],
        consumptionHistory: [],
        totalEnergyOwned: '0',
        totalEnergyConsumed: '0',
        activeListingsCount: 0,
        totalOrdersCount: 0,
    };
}
