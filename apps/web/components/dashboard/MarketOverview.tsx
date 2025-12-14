'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMarketStats } from '@/hooks/useMarketData';
import { Users, Globe, Zap, Leaf } from 'lucide-react';

export function MarketOverview() {
    const { data: stats, isLoading, error } = useMarketStats();

    if (isLoading) return <div className="text-sm text-gray-500">Loading market data...</div>;
    if (error) return <div className="text-sm text-red-500">Failed to load market data</div>;
    if (!stats) return null;

    return (
        <div className="grid gap-4 md:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Network Volume</CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalVolume} kWh</div>
                    <p className="text-xs text-muted-foreground">Total traded</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Active Producers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeProducers}</div>
                    <p className="text-xs text-muted-foreground">Online now</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.averagePrice}</div>
                    <p className="text-xs text-muted-foreground">per kWh</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">CO₂ Offset</CardTitle>
                    <Leaf className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.carbonOffset}t</div>
                    <p className="text-xs text-muted-foreground">Total saved</p>
                </CardContent>
            </Card>
        </div>
    );
}
