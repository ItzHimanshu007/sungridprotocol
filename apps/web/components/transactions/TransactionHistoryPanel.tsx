'use client';

import { useTransactionStore, Transaction } from '@/store/transactionStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, CheckCircle2, XCircle, Loader2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const TX_TYPE_LABELS = {
    mint: 'Mint Energy',
    list: 'Create Listing',
    purchase: 'Purchase Energy',
    consume: 'Consume Energy',
    approve: 'Approve Contract',
    cancel: 'Cancel Listing',
};

const TX_TYPE_COLORS = {
    mint: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    list: 'bg-blue-100 text-blue-700 border-blue-200',
    purchase: 'bg-green-100 text-green-700 border-green-200',
    consume: 'bg-purple-100 text-purple-700 border-purple-200',
    approve: 'bg-gray-100 text-gray-700 border-gray-200',
    cancel: 'bg-red-100 text-red-700 border-red-200',
};

export function TransactionHistoryPanel() {
    const { transactions, removeTransaction } = useTransactionStore();

    if (transactions.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Clock className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">No Recent Transactions</h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                        Your transaction history will appear here once you start interacting with the platform.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg border-0">
            <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-indigo-600" />
                        Transaction History
                    </div>
                    <Badge variant="outline" className="bg-white">
                        {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                    {transactions.map((tx) => (
                        <TransactionItem key={tx.hash} transaction={tx} onRemove={removeTransaction} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function TransactionItem({ transaction, onRemove }: { transaction: Transaction; onRemove: (hash: string) => void }) {
    const getStatusIcon = () => {
        switch (transaction.status) {
            case 'pending':
                return <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />;
            case 'confirmed':
                return <CheckCircle2 className="h-4 w-4 text-green-600" />;
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-600" />;
        }
    };

    const getStatusBadge = () => {
        switch (transaction.status) {
            case 'pending':
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 font-semibold">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Pending {transaction.confirmations ? `(${transaction.confirmations})` : ''}
                    </Badge>
                );
            case 'confirmed':
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-semibold">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Confirmed
                    </Badge>
                );
            case 'failed':
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-semibold">
                        <XCircle className="h-3 w-3 mr-1" />
                        Failed
                    </Badge>
                );
        }
    };

    const explorerUrl = `http://localhost:3000/tx/${transaction.hash}`; // Replace with actual BaseScan URL

    return (
        <div className="p-4 hover:bg-gray-50/50 transition-colors group">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5">{getStatusIcon()}</div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={`text-xs font-semibold ${TX_TYPE_COLORS[transaction.type]}`}>
                                {TX_TYPE_LABELS[transaction.type]}
                            </Badge>
                            {getStatusBadge()}
                        </div>
                        <p className="text-sm text-gray-900 font-medium mb-1">{transaction.description}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="font-mono">
                                {transaction.hash.slice(0, 10)}...{transaction.hash.slice(-8)}
                            </span>
                            <span>•</span>
                            <span>{formatDistanceToNow(transaction.timestamp, { addSuffix: true })}</span>
                            {transaction.blockNumber && (
                                <>
                                    <span>•</span>
                                    <span>Block {transaction.blockNumber}</span>
                                </>
                            )}
                        </div>
                        {transaction.error && (
                            <p className="text-xs text-red-600 mt-2 bg-red-50 px-2 py-1 rounded">
                                Error: {transaction.error}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => window.open(explorerUrl, '_blank')}
                        title="View on Block Explorer"
                    >
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                    {transaction.status !== 'pending' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => onRemove(transaction.hash)}
                            title="Remove from history"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
