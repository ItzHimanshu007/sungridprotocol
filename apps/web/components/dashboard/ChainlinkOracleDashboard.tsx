'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccount } from 'wagmi';
import {
    useOracleDashboard,
    useZoneTransmissionLoss,
    useEthUsdPrice,
    useCalculateNetEnergy
} from '@/hooks/useChainlinkOracle';
import { TrendingUp, Zap, CheckCircle2, Activity, DollarSign, Percent } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ChainlinkOracleDashboard() {
    const { address } = useAccount();
    const oracleData = useOracleDashboard(address);
    const { lossPercentage } = useZoneTransmissionLoss(1); // Default to Zone 1 (Rajasthan)
    const { priceFormatted, isLoading: priceLoading } = useEthUsdPrice();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="h-6 w-6 text-blue-500" />
                        Chainlink Oracle Dashboard
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Decentralized data feeds and automated meter verification
                    </p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <div className="flex items-center gap-1">
                        <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                        Live Data
                    </div>
                </Badge>
            </div>

            {/* Price Feeds */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            ETH/USD Price Feed
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {priceLoading ? (
                            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                        ) : (
                            <div className="text-3xl font-bold text-green-600">
                                {priceFormatted}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            Chainlink Data Feed
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <Percent className="h-4 w-4" />
                            Transmission Loss
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">
                            {lossPercentage.toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Zone 1 (Rajasthan)
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Verification Rate
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-600">
                            {oracleData.production.verificationRate}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Auto-verified by Oracle
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Production Stats */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        Energy Production Statistics
                    </CardTitle>
                    <CardDescription>
                        Tracked via Chainlink oracle smart meter feeds
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Total Energy Produced
                                </span>
                                <Badge variant="secondary">Raw</Badge>
                            </div>
                            <div className="text-2xl font-bold">
                                {oracleData.production.totalFormatted} kWh
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Verified Energy
                                </span>
                                <Badge variant="secondary" className="bg-green-50 text-green-700">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Verified
                                </Badge>
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                                {oracleData.production.verifiedFormatted} kWh
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Total Readings
                                </span>
                                <Badge variant="outline">{oracleData.readings.total}</Badge>
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                                {oracleData.readings.total}
                            </div>
                        </div>
                    </div>

                    {/* Latest Reading */}
                    {oracleData.readings.hasVerified && oracleData.readings.latest && (
                        <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold">Latest Verified Reading</h4>
                                <Badge variant="default" className="bg-green-600">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Verified
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Energy:</span>
                                    <div className="font-semibold">
                                        {oracleData.readings.latest.energyProducedFormatted} kWh
                                    </div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Loss:</span>
                                    <div className="font-semibold">
                                        {oracleData.readings.latest.transmissionLoss}%
                                    </div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Timestamp:</span>
                                    <div className="font-semibold">
                                        {new Date(oracleData.readings.latest.timestamp * 1000).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Status:</span>
                                    <div className="font-semibold text-green-600">
                                        Verified ✓
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!address && (
                        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
                            <p className="text-sm text-amber-700">
                                Connect your wallet to view your production statistics
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Oracle Features */}
            <Card>
                <CardHeader>
                    <CardTitle>🔗 Decentralized Oracle Features</CardTitle>
                    <CardDescription>
                        Powered by Chainlink for trustless automation
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                <DollarSign className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Real-Time Price Feeds</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Chainlink Data Feeds provide tamper-proof ETH/USD prices for accurate energy valuation
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100">
                            <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                                <Percent className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Transmission Loss Calculation</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Automated grid zone-based loss rates ensure fair energy accounting
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Automated Verification</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Chainlink Automation verifies meter readings without manual intervention
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100">
                            <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                                <Activity className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">IoT Smart Meter Integration</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Direct submission from IoT devices eliminates centralization risks
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
