'use client';

import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Package, History, Zap, TrendingUp, AlertCircle, RefreshCw, Leaf, CheckCircle2, XCircle, ShieldCheck, Plus } from 'lucide-react';
import { useBlockchainListings, useBuyerOrders, formatListing, BlockchainListing, BlockchainOrder } from '@/hooks/useBlockchainListings';
import { CONTRACTS, ABIS } from '@/lib/contracts';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

// Demo Data for Empty State
const DEMO_ORDERS: any[] = [
    {
        orderId: 9901,
        buyer: '0xYou',
        seller: '0xSolarFarmA',
        listingId: 101,
        kWhAmount: 125000000000000000000n, // 125 kWh
        totalPrice: 15000000000000000n, // 0.015 ETH
        status: 2, // Completed
        createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 2),
        isDemo: true
    },
    {
        orderId: 9902,
        buyer: '0xYou',
        seller: '0xWindFarmB',
        listingId: 102,
        kWhAmount: 50000000000000000000n, // 50 kWh
        totalPrice: 4000000000000000n, // 0.004 ETH
        status: 1, // Delivered
        createdAt: BigInt(Math.floor(Date.now() / 1000) - 3600 * 5),
        isDemo: true
    }
];

export function MyPortfolioPanel() {
    const { address, isConnected } = useAccount();
    const { allListings, loading: listingsLoading } = useBlockchainListings();
    const { orders, loading: ordersLoading } = useBuyerOrders(address);
    const { toast } = useToast();

    const myListings = allListings.filter(l => l.seller === address);

    // If real orders exist, use them. Otherwise show demo.
    const displayOrders = (orders && orders.length > 0) ? orders : DEMO_ORDERS;
    const isShowingDemoOrders = (!orders || orders.length === 0);

    if (!isConnected) {
        return (
            <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Wallet</h3>
                    <p className="text-gray-500 max-w-sm">Connect your wallet to access your energy assets, track consumption, and manage listings.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Portfolio Summary Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 border-0 shadow-lg text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2 opacity-90">
                            <Zap className="h-5 w-5" />
                            <span className="font-semibold">Total Energy Owned</span>
                        </div>
                        <div className="text-4xl font-black">
                            {displayOrders.reduce((acc, o) => acc + Number(o.kWhAmount) / 1e18, 0).toFixed(1)} kWh
                        </div>
                        <div className="mt-2 text-indigo-100 text-sm flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" /> 100% Green Certified
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-indigo-100 shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2 text-gray-500">
                            <History className="h-5 w-5 text-indigo-600" />
                            <span className="font-semibold">Transaction Volume</span>
                        </div>
                        <div className="text-4xl font-bold text-gray-900">
                            {displayOrders.length}
                        </div>
                        <div className="mt-2 text-gray-400 text-sm">
                            Total orders processed
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2 text-green-700">
                            <Leaf className="h-5 w-5" />
                            <span className="font-semibold">Carbon Offset</span>
                        </div>
                        <div className="text-4xl font-bold text-green-800">
                            {(displayOrders.reduce((acc, o) => acc + Number(o.kWhAmount) / 1e18, 0) * 0.85).toFixed(1)} kg
                        </div>
                        <div className="mt-2 text-green-600 text-sm">
                            CO₂ avoided
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-xl border-0 bg-white/50 backdrop-blur-md overflow-hidden">
                <CardHeader className="border-b border-gray-100 bg-white/80">
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xl">
                            <Package className="h-6 w-6 text-indigo-600" />
                            My Portfolio
                        </div>
                        {isShowingDemoOrders && (
                            <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-700">
                                👀 Viewing Demo Data
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <Tabs defaultValue="assets" className="w-full">
                        <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8 bg-gray-100/50 p-1">
                            <TabsTrigger value="assets" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-bold">
                                <Zap className="h-4 w-4 mr-2" />
                                My Assets
                            </TabsTrigger>
                            <TabsTrigger value="listings" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-bold">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                My Listings
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="assets" className="space-y-4">
                            {ordersLoading ? (
                                <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-indigo-600" /></div>
                            ) : (
                                <div className="space-y-4">
                                    {displayOrders.map((order, i) => (
                                        <OrderCard
                                            key={order.orderId.toString() + i}
                                            order={order}
                                            listings={allListings}
                                            isDemo={!!order.isDemo}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="listings" className="space-y-4">
                            {listingsLoading ? (
                                <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-indigo-600" /></div>
                            ) : myListings.length === 0 ? (
                                <EmptyState
                                    icon={<Package className="h-12 w-12 text-gray-300" />}
                                    title="No Active Listings"
                                    description="You don't have any active listings. Start selling energy to earn!"
                                    action={
                                        <Link href="/create-listing">
                                            <Button className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Create Listing
                                            </Button>
                                        </Link>
                                    }
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {myListings.map(listing => (
                                        <ListingItem key={listing.listingId.toString()} listing={listing} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

function EmptyState({ icon, title, description, action }: { icon: any, title: string, description: string, action?: React.ReactNode }) {
    return (
        <div className="text-center py-16 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
            <div className="mx-auto flex items-center justify-center mb-4">{icon}</div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-gray-500 max-w-sm mx-auto">{description}</p>
            {action}
        </div>
    );
}

function OrderCard({ order, listings, isDemo }: { order: BlockchainOrder | any; listings: BlockchainListing[]; isDemo: boolean }) {
    const statuses = ['Pending', 'Delivered', 'Completed', 'Disputed', 'Refunded'];
    const statusColors = [
        'bg-yellow-100 text-yellow-700 border-yellow-200',
        'bg-blue-100 text-blue-700 border-blue-200',
        'bg-green-100 text-green-700 border-green-200',
        'bg-red-100 text-red-700 border-red-200',
        'bg-gray-100 text-gray-700 border-gray-200'
    ];

    // Check status. For demo, we might mock it.
    const statusIdx = Number(order.status) || 0;
    const canConsume = statusIdx === 1 || statusIdx === 2; // Delivered or Completed

    const amount = Number(order.kWhAmount) / 1e18;
    const price = Number(order.totalPrice) / 1e18;

    return (
        <div className="group flex flex-col md:flex-row items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-indigo-100">
            <div className="flex items-center gap-5 w-full md:w-auto">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-center shrink-0">
                    <Zap className="h-7 w-7 text-indigo-600" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 text-lg">{amount.toFixed(2)} kWh Bundle</h4>
                        {isDemo && <Badge variant="secondary" className="text-[10px] h-5 px-1.5">DEMO</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                        <span>Order #{order.orderId.toString()}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{new Date(Number(order.createdAt) * 1000).toLocaleDateString()}</span>
                        {isDemo && <span className="text-indigo-400">• Simulated</span>}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right mr-4">
                    <div className="font-bold text-gray-900 text-lg">Ξ {price.toFixed(5)}</div>
                    <Badge variant="outline" className={`mt-1 font-semibold ${statusColors[statusIdx]}`}>
                        {statuses[statusIdx] || 'Unknown'}
                    </Badge>
                </div>

                {canConsume ? (
                    <ConsumeButton order={order} listings={listings} isDemo={isDemo} />
                ) : (
                    <Button disabled variant="ghost" size="sm" className="opacity-50">
                        Pending Delivery
                    </Button>
                )}
            </div>
        </div>
    );
}

function ConsumeButton({ order, listings, isDemo }: { order: BlockchainOrder; listings: BlockchainListing[]; isDemo: boolean }) {
    const { writeContract, isPending } = useWriteContract();
    const { toast } = useToast();

    // Find the listing to get the TokenID
    // For demo orders, listingId might not exist in real listings.
    const listing = listings.find(l => Number(l.listingId) === Number(order.listingId));
    const tokenId = listing?.tokenId;

    const handleConsume = () => {
        if (isDemo) {
            toast({
                title: "Simulated Consumption",
                description: "This is a demo order. In production, this would burn the NFT on-chain.",
            });
            return;
        }

        if (!tokenId) {
            toast({ title: "Error", description: "Could not find token details for this order.", variant: "destructive" });
            return;
        }

        writeContract({
            address: CONTRACTS.EnergyToken as `0x${string}`,
            abi: ABIS.EnergyToken as any,
            functionName: 'consumeEnergy',
            args: [tokenId, order.kWhAmount],
        }, {
            onSuccess: () => {
                toast({ title: "Energy Consumed", description: "You have verified consumption of this energy. The NFT has been burned." });
            },
            onError: (e) => {
                toast({ title: "Consumption Failed", description: e.message || "Failed to consume energy.", variant: "destructive" });
            }
        });
    };

    return (
        <Button
            size="default"
            className={cn(
                "font-bold transition-all shadow-md active:scale-95",
                isDemo ? "bg-gray-800 hover:bg-gray-700" : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
            )}
            onClick={handleConsume}
            disabled={(!isDemo && isPending)}
        >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <TrendingUp className="h-4 w-4 mr-2" />}
            {isDemo ? 'Simulate Use' : 'Consume Energy'}
        </Button>
    );
}

function ListingItem({ listing }: { listing: BlockchainListing }) {
    const formatted = formatListing(listing as any);
    const { writeContract, isPending } = useWriteContract();

    const handleCancel = () => {
        writeContract({
            address: CONTRACTS.Marketplace as `0x${string}`,
            abi: ABIS.Marketplace as any,
            functionName: 'cancelListing',
            args: [listing.listingId],
        });
    };

    return (
        <div className="group p-5 bg-white border border-gray-200 rounded-2xl hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Package className="h-24 w-24 text-indigo-600 -rotate-12 transform translate-x-4 -translate-y-4" />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                            <Zap className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">Listing #{listing.listingId.toString()}</span>
                            <h3 className="font-black text-2xl text-gray-900 mt-1">{formatted.kWhAmountFormatted} <span className="text-sm font-medium text-gray-500">kWh</span></h3>
                        </div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 font-bold px-2 py-1">Active Sale</Badge>
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                    <div>
                        <div className="text-xs text-gray-400 font-medium uppercase mb-1">Unit Price</div>
                        <div className="font-bold text-lg text-gray-900">₹{formatted.pricePerKwhINR}</div>
                    </div>

                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isPending}
                        className="h-9 px-4 font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                        {isPending ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <XCircle className="h-3 w-3 mr-2" />}
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}
