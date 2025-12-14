'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatINR } from '@/lib/currency';
import { useEthUsdPrice, useEthToInr } from '@/hooks/useChainlinkOracle';
import { parseEther } from 'viem';
import { Badge } from '@/components/ui/badge';

export function LivePriceTicker() {
    const { price: ethUsdPrice, priceFormatted, isLoading, refetch } = useEthUsdPrice();
    const { inrValue } = useEthToInr(parseEther('0.0001')); // Price for 0.0001 ETH (typical energy price)

    const [previousPrice, setPreviousPrice] = useState(ethUsdPrice);
    const [trend, setTrend] = useState<'up' | 'down'>('up');

    useEffect(() => {
        // Update trend when price changes
        if (ethUsdPrice !== previousPrice && previousPrice > 0) {
            setTrend(ethUsdPrice > previousPrice ? 'up' : 'down');
            setPreviousPrice(ethUsdPrice);
        }
    }, [ethUsdPrice, previousPrice]);

    useEffect(() => {
        // Refresh price every 30 seconds
        const interval = setInterval(() => {
            refetch();
        }, 30000);

        return () => clearInterval(interval);
    }, [refetch]);

    const priceChange = previousPrice > 0
        ? ((ethUsdPrice - previousPrice) / previousPrice * 100)
        : 0;

    // Calculate energy price in INR (assuming 0.0001 ETH per kWh base price)
    const energyPriceInr = inrValue;

    return (
        <Card className="bg-gradient-to-br from-blue-500 to-purple-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-white/90 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-white animate-pulse" />
                        Live ETH Price (Chainlink)
                    </CardTitle>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <Zap className="h-3 w-3 mr-1" />
                        Oracle
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* ETH/USD Price */}
                <div>
                    <div className="text-xs text-white/70 font-medium mb-1">ETH/USD</div>
                    <div className="flex items-baseline gap-2">
                        {isLoading ? (
                            <div className="h-10 w-32 bg-white/20 rounded animate-pulse" />
                        ) : (
                            <>
                                <span className="text-4xl font-black text-white">
                                    {priceFormatted}
                                </span>
                                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${trend === 'up'
                                        ? 'bg-green-500/30 text-white'
                                        : 'bg-red-500/30 text-white'
                                    }`}>
                                    {trend === 'up' ? (
                                        <TrendingUp className="h-3 w-3" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3" />
                                    )}
                                    <span className="text-xs font-bold">
                                        {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Energy Price in INR */}
                <div className="pt-3 border-t border-white/20">
                    <div className="text-xs text-white/70 font-medium mb-1">Energy Price</div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">
                            {formatINR(energyPriceInr)}
                        </span>
                        <span className="text-sm text-white/80 font-semibold">/kWh</span>
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                        Based on 0.0001 ETH/kWh
                    </div>
                </div>

                {/* Oracle Info */}
                <div className="text-xs text-white/90 font-medium pt-2 border-t border-white/20 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                        🔗 Chainlink Data Feed
                    </span>
                    <span className="flex items-center gap-1">
                        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                        Live
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
