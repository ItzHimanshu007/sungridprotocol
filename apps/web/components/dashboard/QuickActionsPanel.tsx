'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Zap, Plus, ShoppingCart, TrendingUp, Wallet } from 'lucide-react';

export function QuickActionsPanel() {
    return (
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-white/90 flex items-center gap-2">
                    ⚡ Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
                <Link href="/create-listing" className="w-full">
                    <Button
                        variant="outline"
                        className="w-full h-20 flex-col gap-2 bg-white/90 hover:bg-white border-0 shadow-md hover:shadow-lg transition-all hover:scale-105"
                    >
                        <Plus className="h-6 w-6 text-yellow-600" />
                        <span className="text-sm font-bold text-gray-900">Sell Energy</span>
                    </Button>
                </Link>
                <Link href="/dashboard?tab=marketplace" className="w-full">
                    <Button
                        variant="outline"
                        className="w-full h-20 flex-col gap-2 bg-white/90 hover:bg-white border-0 shadow-md hover:shadow-lg transition-all hover:scale-105"
                    >
                        <ShoppingCart className="h-6 w-6 text-green-600" />
                        <span className="text-sm font-bold text-gray-900">Buy Energy</span>
                    </Button>
                </Link>
                <Link href="/create-listing" className="w-full">
                    <Button
                        variant="outline"
                        className="w-full h-20 flex-col gap-2 bg-white/90 hover:bg-white border-0 shadow-md hover:shadow-lg transition-all hover:scale-105"
                    >
                        <Zap className="h-6 w-6 text-orange-600 fill-orange-600" />
                        <span className="text-sm font-bold text-gray-900">Mint NFT</span>
                    </Button>
                </Link>
                <Link href="/dashboard?tab=portfolio" className="w-full">
                    <Button
                        variant="outline"
                        className="w-full h-20 flex-col gap-2 bg-white/90 hover:bg-white border-0 shadow-md hover:shadow-lg transition-all hover:scale-105"
                    >
                        <Wallet className="h-6 w-6 text-blue-600" />
                        <span className="text-sm font-bold text-gray-900">Portfolio</span>
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
