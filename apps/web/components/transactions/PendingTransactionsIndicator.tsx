'use client';

import { useTransactionStore } from '@/store/transactionStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Clock, Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function PendingTransactionsIndicator() {
    const { transactions } = useTransactionStore();
    const pendingCount = transactions.filter((tx) => tx.status === 'pending').length;

    if (pendingCount === 0) {
        return null;
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="relative h-9 px-3 bg-yellow-50 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300 transition-all"
                >
                    <Loader2 className="h-4 w-4 mr-2 text-yellow-600 animate-spin" />
                    <span className="text-sm font-bold text-yellow-900">
                        {pendingCount} Pending
                    </span>
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-3 border-b">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Pending Transactions
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                        {pendingCount} {pendingCount === 1 ? 'transaction' : 'transactions'} being processed
                    </p>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {transactions
                        .filter((tx) => tx.status === 'pending')
                        .map((tx) => (
                            <PendingTransactionItem key={tx.hash} transaction={tx} />
                        ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}

function PendingTransactionItem({ transaction }: { transaction: any }) {
    const explorerUrl = `http://localhost:3000/tx/${transaction.hash}`;

    return (
        <div className="p-3 border-b last:border-b-0 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-start gap-3">
                <Loader2 className="h-4 w-4 text-yellow-600 animate-spin mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                        {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-mono truncate">
                            {transaction.hash.slice(0, 10)}...{transaction.hash.slice(-8)}
                        </span>
                        <span>•</span>
                        <span>{formatDistanceToNow(transaction.timestamp, { addSuffix: true })}</span>
                    </div>
                    {transaction.confirmations > 0 && (
                        <div className="mt-1">
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                {transaction.confirmations} {transaction.confirmations === 1 ? 'confirmation' : 'confirmations'}
                            </Badge>
                        </div>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 shrink-0"
                    onClick={() => window.open(explorerUrl, '_blank')}
                >
                    <ExternalLink className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
}

// Simpler badge version for mobile
export function PendingTransactionsBadge() {
    const { transactions } = useTransactionStore();
    const pendingCount = transactions.filter((tx) => tx.status === 'pending').length;

    if (pendingCount === 0) {
        return null;
    }

    return (
        <div className="relative">
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0 font-bold px-2 py-1 shadow-lg">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                {pendingCount}
            </Badge>
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
            </span>
        </div>
    );
}
