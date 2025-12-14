import { useReadContract } from 'wagmi';
import { CONTRACTS, ABIS } from '@/lib/contracts';

export interface Listing {
    listingId: bigint;
    seller: string;
    tokenId: bigint;
    kWhAmount: bigint;
    pricePerKwh: bigint;
    gridZone: bigint;
    createdAt: bigint;
    expiresAt: bigint;
    isActive: boolean;
}

export function useMarketplaceListing(listingId: bigint | undefined) {
    const { data, isLoading, error, refetch } = useReadContract({
        address: CONTRACTS.Marketplace as `0x${string}`,
        abi: ABIS.Marketplace,
        functionName: 'getListing',
        args: listingId !== undefined ? [listingId] : undefined,
    });

    const listing = data as Listing | undefined;

    return {
        listing,
        isLoading,
        error,
        refetch,
    };
}

export function useActiveListings({
    page = 0,
    pageSize = 10,
}: {
    page?: number;
    pageSize?: number;
}) {
    const { data, isLoading, error, refetch } = useReadContract({
        address: CONTRACTS.Marketplace as `0x${string}`,
        abi: ABIS.Marketplace,
        functionName: 'getActiveListings',
        args: [BigInt(page), BigInt(pageSize)],
    });

    const listings = (data as Listing[]) || [];

    return {
        listings,
        isLoading,
        error,
        refetch,
    };
}

export function useUserListings(userAddress: string | undefined) {
    const { data, isLoading, error, refetch } = useReadContract({
        address: CONTRACTS.Marketplace as `0x${string}`,
        abi: ABIS.Marketplace,
        functionName: 'getSellerListings',
        args: userAddress ? [userAddress as `0x${string}`] : undefined,
    });

    const listingIds = (data as bigint[]) || [];

    return {
        listingIds,
        isLoading,
        error,
        refetch,
    };
}

export function useUserOrders(userAddress: string | undefined) {
    const { data, isLoading, error, refetch } = useReadContract({
        address: CONTRACTS.Marketplace as `0x${string}`,
        abi: ABIS.Marketplace,
        functionName: 'getBuyerOrders',
        args: userAddress ? [userAddress as `0x${string}`] : undefined,
    });

    const orderIds = (data as bigint[]) || [];

    return {
        orderIds,
        isLoading,
        error,
        refetch,
    };
}

export function usePlatformFees() {
    const { data: feePercentage } = useReadContract({
        address: CONTRACTS.Marketplace as `0x${string}`,
        abi: ABIS.Marketplace,
        functionName: 'platformFeePercentage',
    });

    const { data: collectedFees } = useReadContract({
        address: CONTRACTS.Marketplace as `0x${string}`,
        abi: ABIS.Marketplace,
        functionName: 'collectedFees',
    });

    return {
        feePercentage: feePercentage ? Number(feePercentage) / 100 : 0,
        collectedFees: collectedFees || BigInt(0),
    };
}
