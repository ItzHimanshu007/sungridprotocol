'use client';

import { useContractReads, useContractRead } from 'wagmi';
import { CONTRACTS, ABIS } from '@/lib/contracts';
import { useState, useEffect } from 'react';
import { fetchFromIPFS } from '@/lib/ipfs';

export interface BlockchainListing {
    listingId: bigint;
    seller: string;
    tokenId: bigint;
    kWhAmount: bigint;
    pricePerKwh: bigint;
    gridZone: bigint;
    isActive: boolean;
    expiresAt: bigint;
    remainingAmount: bigint;
}

export interface BlockchainOrder {
    orderId: bigint;
    listingId: bigint;
    buyer: string;
    seller: string;
    kWhAmount: bigint;
    totalPrice: bigint;
    createdAt: bigint;
    status: number; // 0: PENDING, 1: DELIVERED, 2: COMPLETED, 3: DISPUTED, 4: REFUNDED
}

/**
 * Decentralized hook to fetch listings directly from blockchain
 * No centralized API needed - reads directly from smart contract
 */
export function useBlockchainListings() {
    const [listingIds, setListingIds] = useState<bigint[]>([]);
    const [listings, setListings] = useState<BlockchainListing[]>([]);
    const [allListings, setAllListings] = useState<BlockchainListing[]>([]);
    const [loading, setLoading] = useState(true);

    // Add timeout to prevent infinite loading
    useEffect(() => {
        const timeout = setTimeout(() => {
            console.warn('⏱️ Blockchain read timeout - setting loading to false');
            setLoading(false);
        }, 10000); // 10 second timeout

        return () => clearTimeout(timeout);
    }, []);

    // Get total number of listings from contract
    const { data: listingCount, error: countError, isLoading: isCountLoading } = useContractRead({
        address: CONTRACTS.Marketplace as `0x${string}`,
        abi: ABIS.Marketplace as any,
        functionName: 'getListingCounter',
    });

    // Log errors
    useEffect(() => {
        if (countError) {
            console.error('❌ Error reading listing count:', countError);
            setLoading(false);
        }
    }, [countError]);

    // Generate array of listing IDs to fetch
    useEffect(() => {
        if (listingCount !== undefined) {
            const count = Number(listingCount);
            console.log('📊 Total listings from blockchain:', count);
            if (count > 0) {
                const ids = Array.from({ length: count }, (_, i) => BigInt(i + 1));
                setListingIds(ids);
            } else {
                setListingIds([]);
                setListings([]);
                setLoading(false);
            }
        } else if (!isCountLoading && listingCount === undefined) {
            // If not loading but still undefined, set to empty
            console.warn('⚠️ Listing count is undefined after loading');
            setLoading(false);
        }
    }, [listingCount, isCountLoading]);

    // Batch read all listings from blockchain
    const { data: listingsData, isLoading, error: listingsError } = useContractReads({
        contracts: listingIds.map((id) => ({
            address: CONTRACTS.Marketplace as `0x${string}`,
            abi: ABIS.Marketplace as any, // Cast to any to bypass strict literal check or ensure ABI is constrained
            functionName: 'getListing', // Changed from 'listings' to 'getListing' to match contract interface likely
            args: [id],
        })),
        query: {
            enabled: listingIds.length > 0,
            refetchInterval: 5000, // Auto-refresh every 5s
        }
    });

    // Log errors
    useEffect(() => {
        if (listingsError) {
            console.error('❌ Error reading listings:', listingsError);
            setLoading(false);
        }
    }, [listingsError]);

    // Process the raw blockchain data
    useEffect(() => {
        if (listingsData && !isLoading) {
            console.log('📦 Raw listings data from blockchain:', listingsData);
            const processedListings = listingsData
                .map((result, index) => {
                    // ... (mapping logic same as before)
                    // (I need to preserve the mapping logic but this tool requires full replacement of the block if I touch it.
                    // Actually, I can just insert the setAllListings call after mapping)
                    if (result.status === 'success' && result.result) {
                        const data = result.result as any;
                        const listingId = data.listingId || data[0];
                        const seller = data.seller || data[1];
                        const tokenId = data.tokenId || data[2];
                        const kWhAmount = data.kWhAmount || data[3];
                        const pricePerKwh = data.pricePerKwh || data[4];
                        const gridZone = data.gridZone || data[5];
                        const createdAt = data.createdAt || data[6];
                        const expiresAt = data.expiresAt || data[7];
                        const isActive = data.isActive !== undefined ? data.isActive : data[8];

                        return {
                            listingId: listingId,
                            seller: seller,
                            tokenId: tokenId,
                            kWhAmount: kWhAmount,
                            pricePerKwh: pricePerKwh,
                            gridZone: gridZone,
                            isActive: isActive,
                            expiresAt: expiresAt,
                            remainingAmount: kWhAmount,
                        } as BlockchainListing;
                    }
                    return null;
                })
                .filter((l): l is BlockchainListing => l !== null);

            setAllListings(processedListings);

            const activeListings = processedListings.filter((listing) =>
                listing.isActive && Number(listing.kWhAmount) > 0
            );

            console.log('✅ Processed active listings:', activeListings);
            setListings(activeListings);
            setLoading(false);
        } else if (listingIds.length === 0 && !isLoading) {
            setListings([]);
            setAllListings([]);
            setLoading(false);
        }
    }, [listingsData, isLoading, listingIds]);

    return {
        listings,
        allListings, // Export this
        loading: loading || isLoading || isCountLoading,
        refetch: () => {
            // Blockchain data auto-refreshes via 'watch: true'
        },
    };
}

/**
 * Hook to get buyer's orders
 */
export function useBuyerOrders(address: string | undefined) {
    const [orderIds, setOrderIds] = useState<bigint[]>([]);
    const [orders, setOrders] = useState<BlockchainOrder[]>([]);
    const [loading, setLoading] = useState(true);

    const { data: buyerOrderIds } = useContractRead({
        address: CONTRACTS.Marketplace as `0x${string}`,
        abi: ABIS.Marketplace as any,
        functionName: 'getBuyerOrders',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    });

    useEffect(() => {
        if (buyerOrderIds && Array.isArray(buyerOrderIds)) {
            setOrderIds(buyerOrderIds as bigint[]);
        } else {
            setOrderIds([]);
            if (!address) setLoading(false);
        }
    }, [buyerOrderIds, address]);

    const { data: ordersData, isLoading } = useContractReads({
        contracts: orderIds.map((id) => ({
            address: CONTRACTS.Marketplace as `0x${string}`,
            abi: ABIS.Marketplace as any,
            functionName: 'getOrder',
            args: [id],
        })),
        query: {
            enabled: orderIds.length > 0,
            refetchInterval: 5000,
        }
    });

    useEffect(() => {
        if (ordersData && !isLoading) {
            const processedOrders = ordersData.map((result) => {
                if (result.status === 'success' && result.result) {
                    const data = result.result as any;
                    return {
                        orderId: data.orderId || data[0],
                        listingId: data.listingId || data[1],
                        buyer: data.buyer || data[2],
                        seller: data.seller || data[3],
                        kWhAmount: data.kWhAmount || data[4],
                        totalPrice: data.totalPrice || data[5],
                        createdAt: data.createdAt || data[6],
                        status: Number(data.status || data[7]),
                    } as BlockchainOrder;
                }
                return null;
            }).filter((o): o is BlockchainOrder => o !== null);

            // Sort by most recent
            setOrders(processedOrders.sort((a, b) => Number(b.createdAt - a.createdAt)));
            setLoading(false);
        } else if (orderIds.length === 0) {
            setOrders([]);
            setLoading(false);
        }
    }, [ordersData, isLoading, orderIds]);

    return { orders, loading };
}

/**
 * Hook to get listing metadata from IPFS
 * Stores additional data like images, descriptions in decentralized storage
 */
export function useListingMetadata(tokenId: bigint | undefined) {
    const [metadata, setMetadata] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const { data: tokenURI } = useContractRead({
        address: CONTRACTS.EnergyToken as `0x${string}`,
        abi: ABIS.EnergyToken as any,
        functionName: 'uri',
        args: tokenId !== undefined ? [tokenId] : undefined,
        query: {
            enabled: tokenId !== undefined,
        }
    });



    useEffect(() => {
        let isMounted = true;

        async function fetchMetadata() {
            if (!tokenURI) {
                if (tokenId !== undefined && tokenURI === null) {
                    setLoading(false);
                }
                return;
            }

            setLoading(true);
            try {
                // Use the centralized fetcher that handles both gateways and local mock
                const uri = typeof tokenURI === 'string' ? tokenURI : '';
                const data = await fetchFromIPFS(uri);

                if (isMounted && data) {
                    setMetadata(data);
                }
            } catch (error) {
                console.error('Failed to fetch metadata:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchMetadata();

        return () => { isMounted = false; };
    }, [tokenURI, tokenId]);

    return { metadata, loading };
}

/**
 * Convert BigInt values to human-readable format
 */
export function formatListing(listing: BlockchainListing) {
    const ETH_TO_INR = 225000; // This could come from a decentralized oracle

    const kWhAmount = Number(listing.kWhAmount) / 1e18;
    const remainingAmount = Number(listing.remainingAmount) / 1e18;
    const pricePerKwhETH = Number(listing.pricePerKwh) / 1e18;
    const pricePerKwhINR = pricePerKwhETH * ETH_TO_INR;

    return {
        ...listing,
        // Pass specific raw values explicitly if needed for UI logic that strictly requires BigInt
        pricePerKwhRaw: listing.pricePerKwh,
        kWhAmountRaw: listing.kWhAmount,
        remainingAmountRaw: listing.remainingAmount,

        kWhAmountFormatted: kWhAmount.toFixed(2),
        remainingAmountFormatted: remainingAmount.toFixed(2),
        pricePerKwhETH: pricePerKwhETH.toFixed(6),
        pricePerKwhINR: pricePerKwhINR.toFixed(2),
        totalPriceETH: (kWhAmount * pricePerKwhETH).toFixed(6),
        totalPriceINR: (kWhAmount * pricePerKwhINR).toFixed(2),
        expiresAtDate: new Date(Number(listing.expiresAt) * 1000),
    };
}
