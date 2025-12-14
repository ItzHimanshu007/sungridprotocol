import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

export interface Transaction {
    hash: string;
    status: TransactionStatus;
    type: 'mint' | 'list' | 'purchase' | 'consume' | 'approve' | 'cancel';
    description: string;
    timestamp: number;
    confirmations?: number;
    blockNumber?: number;
    result?: any; // Token ID, listing ID, etc.
    error?: string;
}

interface TransactionStore {
    transactions: Transaction[];
    addTransaction: (tx: Omit<Transaction, 'timestamp' | 'status'>) => void;
    updateTransaction: (hash: string, updates: Partial<Transaction>) => void;
    removeTransaction: (hash: string) => void;
    clearOldTransactions: () => void;
    getPendingCount: () => number;
}

export const useTransactionStore = create<TransactionStore>()(
    persist(
        (set, get) => ({
            transactions: [],

            addTransaction: (tx) => {
                set((state) => ({
                    transactions: [
                        {
                            ...tx,
                            status: 'pending' as TransactionStatus,
                            timestamp: Date.now(),
                            confirmations: 0,
                        },
                        ...state.transactions,
                    ],
                }));
            },

            updateTransaction: (hash, updates) => {
                set((state) => ({
                    transactions: state.transactions.map((tx) =>
                        tx.hash === hash ? { ...tx, ...updates } : tx
                    ),
                }));
            },

            removeTransaction: (hash) => {
                set((state) => ({
                    transactions: state.transactions.filter((tx) => tx.hash !== hash),
                }));
            },

            clearOldTransactions: () => {
                const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
                set((state) => ({
                    transactions: state.transactions.filter(
                        (tx) => tx.timestamp > oneDayAgo || tx.status === 'pending'
                    ),
                }));
            },

            getPendingCount: () => {
                return get().transactions.filter((tx) => tx.status === 'pending').length;
            },
        }),
        {
            name: 'sungrid-transactions',
        }
    )
);
