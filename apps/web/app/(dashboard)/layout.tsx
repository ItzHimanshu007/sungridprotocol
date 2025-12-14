import { Sidebar } from '@/components/layout/Sidebar';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NotificationPopover } from '@/components/layout/NotificationPopover';
import { PendingTransactionsIndicator } from '@/components/transactions/PendingTransactionsIndicator';
import { TransactionTrackerInit } from '@/components/transactions/TransactionTrackerInit';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full relative">
            <TransactionTrackerInit />
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar />
            </div>
            <main className="md:pl-72">
                <div className="flex items-center justify-end p-4 border-b gap-4 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                    <PendingTransactionsIndicator />
                    <NotificationPopover />
                    <ConnectButton />
                </div>
                {children}
            </main>
        </div>
    );
}
