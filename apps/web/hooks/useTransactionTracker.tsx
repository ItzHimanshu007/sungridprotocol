import { useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { useTransactionStore } from '@/store/transactionStore';
import { useToast } from '@/components/ui/use-toast';

const TX_TYPE_LABELS = {
    mint: 'Minting Energy NFT',
    list: 'Creating Listing',
    purchase: 'Purchasing Energy',
    consume: 'Consuming Energy',
    approve: 'Approving Contract',
    cancel: 'Canceling Listing',
};

const TX_TYPE_EMOJI = {
    mint: '⚡',
    list: '🏪',
    purchase: '🛒',
    consume: '✅',
    approve: '🔓',
    cancel: '❌',
};

export function useTransactionTracker() {
    const publicClient = usePublicClient();
    const { transactions, updateTransaction } = useTransactionStore();
    const { toast } = useToast();

    useEffect(() => {
        if (!publicClient) return;

        const pendingTxs = transactions.filter((tx) => tx.status === 'pending');

        // Track each pending transaction
        pendingTxs.forEach(async (tx) => {
            try {
                // Wait for transaction receipt
                const receipt = await publicClient.waitForTransactionReceipt({
                    hash: tx.hash as `0x${string}`,
                    confirmations: 1,
                });

                // Get current block for confirmations
                const currentBlock = await publicClient.getBlockNumber();
                const confirmations = Number(currentBlock) - Number(receipt.blockNumber) + 1;

                // Update transaction
                updateTransaction(tx.hash, {
                    status: receipt.status === 'success' ? 'confirmed' : 'failed',
                    blockNumber: Number(receipt.blockNumber),
                    confirmations,
                    error: receipt.status !== 'success' ? 'Transaction reverted' : undefined,
                });

                // Show toast notification
                if (receipt.status === 'success') {
                    toast({
                        title: `${TX_TYPE_EMOJI[tx.type]} ${TX_TYPE_LABELS[tx.type]} Successful!`,
                        description: (
                            <div className= "space-y-1" >
                            <p>{ tx.description } </p>
                            < p className="text-xs text-muted-foreground" >
                            Block: { receipt.blockNumber.toString() } • { confirmations } confirmations
                            </p>
                    </div>
                    ),
                        duration: 5000,
          });
    } else {
        toast({
            title: `${TX_TYPE_EMOJI[tx.type]
    } ${ TX_TYPE_LABELS[tx.type]} Failed`,
            description: tx.description,
            variant: 'destructive',
            duration: 7000,
          });
        }
      } catch (error) {
        console.error(`Error tracking transaction ${ tx.hash }: `, error);
        updateTransaction(tx.hash, {
          status: 'failed',
          error: 'Failed to track transaction',
        });

        toast({
          title: `${ TX_TYPE_EMOJI[tx.type]} Transaction Error`,
          description: 'Failed to confirm transaction status',
          variant: 'destructive',
        });
      }
    });
  }, [transactions, publicClient, updateTransaction, toast]);

  // Cleanup old transactions periodically
  useEffect(() => {
    const interval = setInterval(() => {
      useTransactionStore.getState().clearOldTransactions();
    }, 60 * 60 * 1000); // Every hour

    return () => clearInterval(interval);
  }, []);
}

// Helper hook to submit and track transactions
export function useSubmitTransaction() {
  const { addTransaction } = useTransactionStore();
  const { toast } = useToast();

  const submitTransaction = async (
    txPromise: Promise<string>,
    type: keyof typeof TX_TYPE_LABELS,
    description: string
  ) => {
    try {
      // Show pending toast
      toast({
        title: `${ TX_TYPE_EMOJI[type]} ${ TX_TYPE_LABELS[type]}...`,
        description: 'Please confirm in your wallet',
        duration: 3000,
      });

      const hash = await txPromise;

      // Add to transaction store
      addTransaction({
        hash,
        type,
        description,
      });

      // Show submitted toast
      toast({
        title: `${ TX_TYPE_EMOJI[type]} Transaction Submitted`,
        description: (
          <div className="space-y-1">
            <p>{description}</p>
            <p className="text-xs text-muted-foreground font-mono">
              {hash.slice(0, 10)}...{hash.slice(-8)}
            </p>
          </div>
        ),
        duration: 5000,
      });

      return hash;
    } catch (error: any) {
      // Show error toast
      toast({
        title: `${ TX_TYPE_EMOJI[type]} Transaction Failed`,
        description: error.message || 'Transaction was rejected',
        variant: 'destructive',
        duration: 7000,
      });
      throw error;
    }
  };

  return { submitTransaction };
}
