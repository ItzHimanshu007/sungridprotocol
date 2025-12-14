'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAccount } from 'wagmi';
import { Loader2, Zap, Coins, Settings, Database, ShieldCheck, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function DemoControls() {
    const { address, isConnected } = useAccount();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const runSeed = async () => {
        setLoading('seed');
        try {
            const res = await fetch('/api/seed', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                toast({ title: 'Marketplace Seeded', description: 'Added 2 sellers and active listings.' });
                window.location.reload();
            } else {
                throw new Error(data.error);
            }
        } catch (e: any) {
            toast({ title: 'Seed Failed', description: e.message, variant: 'destructive' });
        } finally {
            setLoading(null);
        }
    };

    const getEth = async () => {
        if (!address) return;
        setLoading('faucet');
        try {
            const res = await fetch('/api/faucet', {
                method: 'POST',
                body: JSON.stringify({ address })
            });
            const data = await res.json();
            if (data.success) {
                toast({ title: 'ETH Sent', description: 'Sent 10 Test ETH to your wallet.' });
            } else {
                throw new Error(data.error);
            }
        } catch (e: any) {
            toast({ title: 'Faucet Failed', description: e.message, variant: 'destructive' });
        } finally {
            setLoading(null);
        }
    };

    if (!mounted || !isConnected) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <Card className="mb-4 p-4 w-72 shadow-2xl border-2 border-indigo-100 animate-in slide-in-from-bottom-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Settings className="h-5 w-5 text-indigo-600" />
                            Demo Controls
                        </h3>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={getEth}
                            disabled={!!loading}
                        >
                            {loading === 'faucet' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Coins className="h-4 w-4 mr-2 text-yellow-500" />}
                            Get 10 Test ETH
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={runSeed}
                            disabled={!!loading}
                        >
                            {loading === 'seed' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2 text-blue-500" />}
                            Seed Marketplace Data
                        </Button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-center text-gray-500">
                        Use these tools to populate the local blockchain with test data.
                    </div>
                </Card>
            )}

            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="h-14 w-14 rounded-full shadow-xl bg-indigo-600 hover:bg-indigo-700 text-white p-0 flex items-center justify-center transition-transform hover:scale-110"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Database className="h-6 w-6" />}
            </Button>
        </div>
    );
}
