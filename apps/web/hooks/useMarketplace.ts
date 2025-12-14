import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS, ABIS } from '@/lib/contracts';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

export function useCreateListing() {
    const { data: hash, writeContract, isPending, error } = useWriteContract();
    const { toast } = useToast();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isPending) {
            toast({
                title: 'Creating Listing',
                description: 'Please confirm the transaction in your wallet...',
            });
        }
    }, [isPending, toast]);

    useEffect(() => {
        if (isConfirming) {
            toast({
                title: 'Transaction Pending',
                description: 'Creating your energy listing...',
            });
        }
    }, [isConfirming, toast]);

    useEffect(() => {
        if (isSuccess) {
            toast({
                title: 'Success!',
                description: 'Your energy listing has been created.',

            });
        }
    }, [isSuccess, toast]);

    useEffect(() => {
        if (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create listing',

            });
        }
    }, [error, toast]);

    const createListing = async ({
        tokenId,
        kWhAmount,
        pricePerKwh,
        duration,
    }: {
        tokenId: bigint;
        kWhAmount: bigint;
        pricePerKwh: bigint;
        duration: bigint;
    }) => {
        writeContract({
            address: CONTRACTS.Marketplace as `0x${string}`,
            abi: ABIS.Marketplace,
            functionName: 'createListing',
            args: [tokenId, kWhAmount, pricePerKwh, duration],
        });
    };

    return {
        createListing,
        isPending: isPending || isConfirming,
        isSuccess,
        hash,
    };
}

export function usePurchaseEnergy() {
    const { data: hash, writeContract, isPending, error } = useWriteContract();
    const { toast } = useToast();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isPending) {
            toast({
                title: 'Purchasing Energy',
                description: 'Please confirm the transaction in your wallet...',
            });
        }
    }, [isPending, toast]);

    useEffect(() => {
        if (isConfirming) {
            toast({
                title: 'Transaction Pending',
                description: 'Processing your energy purchase...',
            });
        }
    }, [isConfirming, toast]);

    useEffect(() => {
        if (isSuccess) {
            toast({
                title: 'Purchase Complete!',
                description: 'You have successfully purchased energy.',

            });
        }
    }, [isSuccess, toast]);

    useEffect(() => {
        if (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to purchase energy',

            });
        }
    }, [error, toast]);

    const purchaseEnergy = async ({
        listingId,
        kWhAmount,
        value,
    }: {
        listingId: bigint;
        kWhAmount: bigint;
        value: bigint;
    }) => {
        writeContract({
            address: CONTRACTS.Marketplace as `0x${string}`,
            abi: ABIS.Marketplace,
            functionName: 'purchaseEnergy',
            args: [listingId, kWhAmount],
            value,
        });
    };

    return {
        purchaseEnergy,
        isPending: isPending || isConfirming,
        isSuccess,
        hash,
    };
}

export function useCancelListing() {
    const { data: hash, writeContract, isPending, error } = useWriteContract();
    const { toast } = useToast();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isConfirming) {
            toast({
                title: 'Transaction Pending',
                description: 'Cancelling your listing...',
            });
        }
    }, [isConfirming, toast]);

    useEffect(() => {
        if (isSuccess) {
            toast({
                title: 'Listing Cancelled',
                description: 'Your energy listing has been cancelled.',
            });
        }
    }, [isSuccess, toast]);

    useEffect(() => {
        if (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to cancel listing',

            });
        }
    }, [error, toast]);

    const cancelListing = async (listingId: bigint) => {
        writeContract({
            address: CONTRACTS.Marketplace as `0x${string}`,
            abi: ABIS.Marketplace,
            functionName: 'cancelListing',
            args: [listingId],
        });
    };

    return {
        cancelListing,
        isPending: isPending || isConfirming,
        isSuccess,
        hash,
    };
}
