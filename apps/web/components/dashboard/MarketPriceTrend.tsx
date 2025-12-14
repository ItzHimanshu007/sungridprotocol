'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export function MarketPriceTrend() {
    const { toast } = useToast();
    const [refreshing, setRefreshing] = useState(false);

    // Sample Data for Price Trend
    // 24 hours of data points
    const dataPoints = [
        22.5, 22.8, 23.0, 23.2, 23.5, 24.0, 24.5, 24.2, 23.8, 23.5, 23.0, 22.5,
        22.0, 21.5, 21.2, 21.5, 21.8, 22.2, 22.5, 22.8, 23.1, 23.4, 23.8, 24.0
    ];

    const minPrice = Math.min(...dataPoints);
    const maxPrice = Math.max(...dataPoints);
    const range = maxPrice - minPrice;

    // Generate SVG points
    const width = 100;
    const height = 40;
    const points = dataPoints.map((price, i) => {
        const x = (i / (dataPoints.length - 1)) * width;
        const normalizedY = (price - minPrice) / range;
        const y = height - (normalizedY * height); // Invert Y
        return `${x},${y}`;
    }).join(' ');

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            toast({
                title: "Data Refreshed",
                description: "Market prices updated from oracle."
            });
        }, 1000);
    };

    return (
        <Card className="shadow-lg border border-indigo-100 bg-white hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-indigo-600" />
                        Market Price Trend
                    </CardTitle>
                    <CardDescription>24 Hour Average Price (₹/kWh)</CardDescription>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className={`text-gray-400 hover:text-indigo-600 ${refreshing ? 'animate-spin' : ''}`}
                    onClick={handleRefresh}
                >
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-2 mb-4">
                    <div className="text-4xl font-black text-gray-900">₹24.00</div>
                    <div className="flex items-center text-green-600 font-bold mb-1">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        +6.2%
                    </div>
                </div>

                {/* SVG Chart */}
                <div className="h-48 w-full relative group">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible preserve-3d">
                        {/* Gradient Defs */}
                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Area Pattern */}
                        <path
                            d={`${points} L ${width},${height} L 0,${height} Z`}
                            fill="url(#lineGradient)"
                            className="opacity-50 transition-all duration-300 group-hover:opacity-70"
                        />

                        {/* Line */}
                        <polyline
                            points={points}
                            fill="none"
                            stroke="#4f46e5"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-md"
                        />

                        {/* Interactive Dot (simulated at end) */}
                        <circle cx={width} cy={points.split(' ').pop()?.split(',')[1]} r="2" fill="white" stroke="#4f46e5" strokeWidth="2" className="animate-pulse" />
                    </svg>

                    {/* Tooltip Simulation */}
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        Current: ₹24.00
                    </div>
                </div>

                <div className="mt-4 flex justify-between text-xs text-gray-400 font-medium">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>Now</span>
                </div>
            </CardContent>
        </Card>
    );
}
