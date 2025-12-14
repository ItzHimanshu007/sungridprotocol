import { useReadContract, useAccount } from 'wagmi';
import { CONTRACTS, ABIS } from '@/lib/contracts';

export function useEnergyToken() {
    const { address } = useAccount();

    const { data: tokenIdData } = useReadContract({
        address: CONTRACTS.EnergyToken as `0x${string}`,
        abi: ABIS.EnergyToken,
        functionName: 'getCurrentTokenId',
    });

    const { data: totalEnergyData } = useReadContract({
        address: CONTRACTS.EnergyToken as `0x${string}`,
        abi: ABIS.EnergyToken,
        functionName: 'producerTotalEnergy',
        args: address ? [address] : undefined,
    });

    const { data: reputationData } = useReadContract({
        address: CONTRACTS.EnergyToken as `0x${string}`,
        abi: ABIS.EnergyToken,
        functionName: 'producerReputation',
        args: address ? [address] : undefined,
    });

    return {
        balance: totalEnergyData ? (Number(totalEnergyData) / 1e18).toFixed(2) : '0',
        symbol: 'kWh',
        reputation: reputationData ? Number(reputationData) : 0,
        isLoading: false,
    };
}
