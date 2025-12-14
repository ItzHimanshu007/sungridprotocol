import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'wagmi';
import { CONTRACTS, ABIS } from '@/lib/contracts';
import { formatEther } from 'viem';

interface MarketStats {
    totalVolume: string;
    activeProducers: number;
    averagePrice: number;
    carbonOffset: number;
}

export function useMarketStats() {
    // Get total supply from EnergyToken
    const { data: totalSupply } = useReadContract({
        address: CONTRACTS.EnergyToken as `0x${string}`,
        abi: ABIS.EnergyToken,
        functionName: 'totalSupply',
        args: [],
    });

    // Get platform fees (proxy for volume)
    const { data: platformFees } = useReadContract({
        address: CONTRACTS.Marketplace as `0x${string}`,
        abi: ABIS.Marketplace,
        functionName: 'collectedFees',
    });

    return useQuery({
        queryKey: ['marketStats', totalSupply?.toString(), platformFees?.toString()],
        queryFn: async (): Promise<MarketStats> => {
            // Calculate stats from blockchain data
            const volume = totalSupply ? Number(formatEther(totalSupply as bigint)) : 0;
            const fees = platformFees ? Number(formatEther(platformFees as bigint)) : 0;

            // Estimate active producers (in production, you'd track this on-chain or via events)
            const estimatedProducers = Math.max(1, Math.floor(volume / 100));

            // Calculate average price (estimated from fees and volume)
            const avgPrice = volume > 0 ? (fees / volume) * 100 : 0.05;

            // Calculate CO2 offset (typically ~0.5 kg CO2 per kWh)
            const carbonOffset = (volume * 0.0005); // in tonnes

            return {
                totalVolume: volume.toFixed(0),
                activeProducers: estimatedProducers,
                averagePrice: parseFloat(avgPrice.toFixed(4)),
                carbonOffset: parseFloat(carbonOffset.toFixed(2)),
            };
        },
        // Refetch every 30 seconds
        refetchInterval: 30000,
        enabled: !!totalSupply, // Only run when we have data
    });
}
