'use client';

import { useState, useEffect } from 'react';

export interface ApiListing {
    id: string;
    listingId: number;
    tokenId: number;
    kWhAmount: string;
    remainingAmount: string;
    pricePerKwh: string;
    pricePerKwhRaw?: bigint; // Optional raw BigInt for precise calc
    pricePerKwhINR: string;
    totalPriceINR: string;
    gridZone: number;
    isActive: boolean;
    createdAt: string;
    expiresAt: string;
    txHash: string | null;
    seller: {
        walletAddress: string;
        displayName: string | null;
        reputationScore: number;
    };
}

export interface ListingsResponse {
    listings: ApiListing[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export function useListings(zone?: number, page: number = 1, limit: number = 20) {
    const [data, setData] = useState<ListingsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchListings = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            if (zone) {
                params.append('zone', zone.toString());
            }

            const response = await fetch(`http://localhost:3001/api/listings?${params}`);

            if (!response.ok) {
                throw new Error('Failed to fetch listings');
            }

            const json = await response.json();
            setData(json);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [zone, page, limit]);

    return {
        listings: data?.listings || [],
        pagination: data?.pagination,
        loading,
        error,
        refetch: fetchListings,
    };
}
