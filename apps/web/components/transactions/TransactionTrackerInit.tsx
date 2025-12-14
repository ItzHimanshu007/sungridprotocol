'use client';

import { useTransactionTracker } from '@/hooks/useTransactionTracker';

export function TransactionTrackerInit() {
    useTransactionTracker();
    return null;
}
