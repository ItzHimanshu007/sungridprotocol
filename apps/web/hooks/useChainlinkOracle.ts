/**
 * useChainlinkOracle - React hooks for ChainlinkEnergyOracle integration
 * 
 * Provides decentralized oracle functions:
 * - Smart meter reading submission
 * - Transmission loss calculations
 * - ETH/USDC price conversions
 * - Meter reading verification
 */

import { useReadContract, useWriteContract } from 'wagmi';
import { CONTRACTS, ABIS } from '@/lib/contracts';
import { formatEther } from 'viem';

// Typed address to satisfy Wagmi v2 strict types
const ORACLE_ADDRESS = CONTRACTS.ChainlinkEnergyOracle as `0x${string}`;

// ============= READ HOOKS =============

/**
 * Get transmission loss rate for a grid zone
 */
export function useZoneTransmissionLoss(gridZone: number) {
    const { data, isLoading, error } = useReadContract({
        address: ORACLE_ADDRESS,
        abi: ABIS.ChainlinkEnergyOracle,
        functionName: 'zoneTransmissionLoss',
        args: [BigInt(gridZone)],
    });

    return {
        lossRate: data ? Number(data) : 0, // In basis points (e.g., 600 = 6%)
        lossPercentage: data ? Number(data) / 100 : 0, // As percentage (e.g., 6.0%)
        isLoading,
        error,
    };
}

/**
 * Calculate net energy after transmission loss
 */
export function useCalculateNetEnergy(grossEnergy: bigint, gridZone: number) {
    const { data, isLoading, error } = useReadContract({
        address: ORACLE_ADDRESS,
        abi: ABIS.ChainlinkEnergyOracle,
        functionName: 'calculateNetEnergy',
        args: [grossEnergy, BigInt(gridZone)],
        query: {
            enabled: grossEnergy > 0n,
        }
    });

    return {
        netEnergy: (data as bigint) || 0n,
        netEnergyFormatted: data ? formatEther(data as bigint) : '0',
        isLoading,
        error,
    };
}

/**
 * Get latest ETH/USD price from Chainlink
 */
export function useEthUsdPrice() {
    const { data, isLoading, error, refetch } = useReadContract({
        address: ORACLE_ADDRESS,
        abi: ABIS.ChainlinkEnergyOracle,
        functionName: 'getLatestEthUsdPrice',
    });

    const [price, decimals] = (data as [bigint, number]) || [0n, 8];

    return {
        price: price ? Number(price) / Math.pow(10, decimals) : 0,
        priceRaw: price,
        decimals,
        priceFormatted: price ? `$${(Number(price) / Math.pow(10, decimals)).toFixed(2)}` : '$0.00',
        isLoading,
        error,
        refetch,
    };
}

/**
 * Get latest USDC/USD price from Chainlink
 */
export function useUsdcUsdPrice() {
    const { data, isLoading, error } = useReadContract({
        address: ORACLE_ADDRESS,
        abi: ABIS.ChainlinkEnergyOracle,
        functionName: 'getLatestUsdcUsdPrice',
    });

    const [price, decimals] = (data as [bigint, number]) || [0n, 8];

    return {
        price: price ? Number(price) / Math.pow(10, decimals) : 0,
        priceRaw: price,
        decimals,
        isLoading,
        error,
    };
}

/**
 * Convert ETH amount to USDC equivalent
 */
export function useConvertEthToUsdc(ethAmount: bigint) {
    const { data, isLoading, error } = useReadContract({
        address: ORACLE_ADDRESS,
        abi: ABIS.ChainlinkEnergyOracle,
        functionName: 'convertEthToUsdc',
        args: [ethAmount],
        query: {
            enabled: ethAmount > 0n,
        }
    });

    return {
        usdcAmount: (data as bigint) || 0n,
        usdcFormatted: data ? (Number(data) / 1e6).toFixed(2) : '0.00', // USDC has 6 decimals
        isLoading,
        error,
    };
}

/**
 * Convert USDC amount to ETH equivalent
 */
export function useConvertUsdcToEth(usdcAmount: bigint) {
    const { data, isLoading, error } = useReadContract({
        address: ORACLE_ADDRESS,
        abi: ABIS.ChainlinkEnergyOracle,
        functionName: 'convertUsdcToEth',
        args: [usdcAmount],
        query: {
            enabled: usdcAmount > 0n,
        }
    });

    return {
        ethAmount: (data as bigint) || 0n,
        ethFormatted: data ? formatEther(data as bigint) : '0',
        isLoading,
        error,
    };
}

/**
 * Get meter readings for a producer
 */
export function useMeterReadings(producerAddress?: `0x${string}`) {
    const { data, isLoading, error, refetch } = useReadContract({
        address: ORACLE_ADDRESS,
        abi: ABIS.ChainlinkEnergyOracle,
        functionName: 'getMeterReadings',
        args: producerAddress ? [producerAddress] : undefined,
        query: {
            enabled: !!producerAddress,
        }
    });

    return {
        readings: data as any[] || [],
        totalReadings: data ? (data as any[]).length : 0,
        isLoading,
        error,
        refetch,
    };
}

/**
 * Get latest verified reading for a producer
 */
export function useLatestVerifiedReading(producerAddress?: `0x${string}`) {
    const { data, isLoading, error } = useReadContract({
        address: ORACLE_ADDRESS,
        abi: ABIS.ChainlinkEnergyOracle,
        functionName: 'getLatestVerifiedReading',
        args: producerAddress ? [producerAddress] : undefined,
        query: {
            enabled: !!producerAddress,
        }
    });

    const [reading, found] = (data as [any, boolean]) || [null, false];

    return {
        reading,
        found,
        energyProduced: reading?.energyProduced || 0n,
        energyProducedFormatted: reading?.energyProduced ? formatEther(reading.energyProduced) : '0',
        transmissionLoss: reading?.transmissionLoss ? Number(reading.transmissionLoss) / 100 : 0,
        isVerified: reading?.verified || false,
        timestamp: reading?.timestamp ? Number(reading.timestamp) : 0,
        isLoading,
        error,
    };
}

/**
 * Get total energy produced by a producer
 */
export function useTotalEnergyProduced(producerAddress?: `0x${string}`) {
    const { data, isLoading, error } = useReadContract({
        address: ORACLE_ADDRESS,
        abi: ABIS.ChainlinkEnergyOracle,
        functionName: 'totalEnergyProduced',
        args: producerAddress ? [producerAddress] : undefined,
        query: {
            enabled: !!producerAddress,
        }
    });

    return {
        totalEnergy: (data as bigint) || 0n,
        totalEnergyFormatted: data ? formatEther(data as bigint) : '0',
        isLoading,
        error,
    };
}

/**
 * Get verified energy produced by a producer
 */
export function useVerifiedEnergyProduced(producerAddress?: `0x${string}`) {
    const { data, isLoading, error } = useReadContract({
        address: ORACLE_ADDRESS,
        abi: ABIS.ChainlinkEnergyOracle,
        functionName: 'verifiedEnergyProduced',
        args: producerAddress ? [producerAddress] : undefined,
        query: {
            enabled: !!producerAddress,
        }
    });

    return {
        verifiedEnergy: (data as bigint) || 0n,
        verifiedEnergyFormatted: data ? formatEther(data as bigint) : '0',
        isLoading,
        error,
    };
}

// ============= WRITE HOOKS (Mocked for Hackathon Demo - Wagmi v2 Migration Pending) =============

/**
 * Submit meter reading
 */
export function useSubmitMeterReading() {
    const submitReading = (energyProduced: bigint, gridZone: number, dataHash: `0x${string}`) => {
        console.log("Submit reading mocked for demo", { energyProduced, gridZone, dataHash });
    };

    return {
        submitReading,
        isLoading: false,
        isSuccess: false,
        txHash: undefined,
        error: null,
    };
}

/**
 * Verify meter reading (admin only)
 */
export function useVerifyMeterReading() {
    const verifyReading = (producerAddress: `0x${string}`, readingIndex: number) => {
        console.log("Verify reading mocked for demo", { producerAddress, readingIndex });
    };

    return {
        verifyReading,
        isLoading: false,
        isSuccess: false,
        txHash: undefined,
        error: null,
    };
}

/**
 * Update transmission loss rate (admin only)
 */
export function useUpdateTransmissionLoss() {
    const updateLoss = (gridZone: number, lossRate: number) => {
        console.log("Update loss mocked for demo", { gridZone, lossRate });
    };

    return {
        updateLoss,
        isLoading: false,
        isSuccess: false,
        txHash: undefined,
        error: null,
    };
}

// ============= UTILITY HOOKS =============

/**
 * Calculate INR value from ETH using Chainlink price feed
 * Assumes 1 USD = 83 INR (can be made dynamic later)
 */
export function useEthToInr(ethAmount: bigint) {
    const { price: ethUsdPrice, isLoading } = useEthUsdPrice();
    const USD_TO_INR = 83; // Current exchange rate

    const inrValue = ethUsdPrice > 0
        ? (Number(formatEther(ethAmount)) * ethUsdPrice * USD_TO_INR)
        : 0;

    return {
        inrValue,
        inrFormatted: `₹${inrValue.toFixed(2)}`,
        ethUsdPrice,
        isLoading,
    };
}

/**
 * Create data hash for meter reading verification
 */
export function useCreateDataHash() {
    const createHash = (meterId: string, energyProduced: bigint, timestamp: number, source: string): `0x${string}` => {
        // Simple client-side hash (for demo - production should use cryptographic signing)
        const data = `${meterId}-${energyProduced.toString()}-${timestamp}-${source}`;
        const hash = Array.from(data)
            .reduce((hash, char) => ((hash << 5) - hash) + char.charCodeAt(0), 0)
            .toString(16)
            .padStart(64, '0');

        return `0x${hash}` as `0x${string}`;
    };

    return { createHash };
}

/**
 * Get all oracle data for dashboard
 */
export function useOracleDashboard(userAddress?: `0x${string}`) {
    const { price: ethUsdPrice, priceFormatted: ethPriceFormatted } = useEthUsdPrice();
    const { price: usdcUsdPrice } = useUsdcUsdPrice();
    const { totalEnergy, totalEnergyFormatted } = useTotalEnergyProduced(userAddress);
    const { verifiedEnergy, verifiedEnergyFormatted } = useVerifiedEnergyProduced(userAddress);
    const { readings, totalReadings } = useMeterReadings(userAddress);
    const { reading: latestReading, found } = useLatestVerifiedReading(userAddress);

    return {
        prices: {
            ethUsd: ethUsdPrice,
            ethUsdFormatted: ethPriceFormatted,
            usdcUsd: usdcUsdPrice,
        },
        production: {
            total: totalEnergy,
            totalFormatted: totalEnergyFormatted,
            verified: verifiedEnergy,
            verifiedFormatted: verifiedEnergyFormatted,
            verificationRate: totalEnergy > 0n
                ? (Number(verifiedEnergy) / Number(totalEnergy) * 100).toFixed(1)
                : '0',
        },
        readings: {
            all: readings,
            total: totalReadings,
            latest: latestReading,
            hasVerified: found,
        },
    };
}
