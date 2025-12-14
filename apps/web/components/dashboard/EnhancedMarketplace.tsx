'use client';

import { useState, useEffect, useMemo } from 'react';
import { useBlockchainListings, formatListing, BlockchainListing } from '@/hooks/useBlockchainListings';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    ShoppingCart,
    Zap,
    MapPin,
    Filter,
    ArrowUpRight,
    Sparkles,
    Leaf,
    ShieldCheck,
    Wallet,
    Loader2
} from 'lucide-react';
import { BuyEnergyModal } from '@/components/marketplace/BuyEnergyModal';
import { useAccount } from 'wagmi';

// --- Types ---
interface EnergyListing {
    id: string;
    seller: string;
    location: string;
    description: string;
    distance: number;
    amount: number;
    price: number;
    rating: number;
    verified: boolean;
    type: 'solar' | 'wind' | 'hydro';
    apiData?: any; // Data for the smart contract interaction
    isDemo?: boolean; // Flag to identify pre-feeded mock data
}

const SAMPLE_LISTINGS: EnergyListing[] = [
    {
        id: 'demo-solar-1',
        seller: '0xSolar...Farm',
        location: 'Zone 1 - Sunnyvale',
        description: 'Premium solar energy bundle from high-efficiency rooftop panels. Certified green.',
        distance: 2.5,
        amount: 450,
        price: 24.5,
        rating: 4.9,
        verified: true,
        type: 'solar',
        isDemo: true
    },
    {
        id: 'demo-wind-1',
        seller: '0xWind...Power',
        location: 'Zone 3 - Highland',
        description: 'Steady wind energy production. Perfect for industrial or heavy usage.',
        distance: 15.2,
        amount: 1200,
        price: 18.2,
        rating: 4.8,
        verified: true,
        type: 'wind',
        isDemo: true
    },
    {
        id: 'demo-solar-2',
        seller: '0xEco...Home',
        location: 'Zone 2 - Riverdale',
        description: 'Community solar garden share. Low transmission loss.',
        distance: 5.1,
        amount: 125,
        price: 22.0,
        rating: 4.7,
        verified: true,
        type: 'solar',
        isDemo: true
    }
];

export function EnhancedMarketplace() {
    // --- State ---
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
    const { listings: realListings, loading: blockchainLoading } = useBlockchainListings();
    const { isConnected } = useAccount();
    const router = useRouter();

    // --- Merge Real & Demo Data ---
    const displayedListings = useMemo(() => {
        // Convert blockchain listings to our UI format
        const mappedRealListings = realListings.map((l) => {
            const fmt = formatListing(l);
            return {
                id: l.listingId.toString(),
                seller: l.seller.slice(0, 6) + '...' + l.seller.slice(-4),
                location: `Grid Zone ${l.gridZone}`,
                description: 'Verifiable on-chain energy listing.',
                distance: 1.0 + (Number(l.listingId) % 10), // Deterministic mock distance
                amount: Number(fmt.kWhAmountFormatted),
                price: Number(fmt.pricePerKwhINR),
                rating: 5.0,
                verified: true,
                type: (Number(l.gridZone) === 3 ? 'wind' : 'solar') as 'solar' | 'wind', // Mock type based on zone
                isDemo: false,
                apiData: {
                    id: l.listingId.toString(),
                    listingId: Number(l.listingId),
                    tokenId: Number(l.tokenId),
                    kWhAmount: fmt.kWhAmountFormatted,
                    remainingAmount: fmt.remainingAmountFormatted,
                    pricePerKwh: fmt.pricePerKwhETH,
                    pricePerKwhRaw: l.pricePerKwh,
                    pricePerKwhINR: fmt.pricePerKwhINR,
                    totalPriceINR: fmt.totalPriceINR,
                    gridZone: Number(l.gridZone),
                    isActive: l.isActive,
                    createdAt: new Date().toISOString(),
                    expiresAt: fmt.expiresAtDate.toISOString(),
                    txHash: null,
                    seller: {
                        walletAddress: l.seller,
                        displayName: l.seller.slice(0, 6) + '...',
                        reputationScore: 100
                    }
                }
            };
        });

        // Merge Real Listings with Sample Listings
        // We prioritize Real Listings. If we have real listings, we show them first.
        return [...mappedRealListings, ...SAMPLE_LISTINGS];
    }, [realListings]);

    // --- Filtering ---
    const filteredListings = displayedListings.filter(item => {
        const matchesSearch =
            item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.seller.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];

        return matchesSearch && matchesPrice;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* --- Hero Section & Stats --- */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 via-green-900 to-emerald-900 shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=2574&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>

                <div className="relative p-8 md:p-12 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2">
                            <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30 border-green-500/50 backdrop-blur-md mb-2">
                                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live Market</span>
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                                Clean Energy <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                                    Marketplace
                                </span>
                            </h1>
                            <p className="text-gray-300 max-w-lg text-lg">
                                Buy and sell renewable energy directly on the blockchain. Verifiable, decentralized, and instant.
                            </p>
                        </div>

                        {/* Market Stats Cards */}
                        <div className="flex gap-4">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[140px]">
                                <div className="text-green-300 text-sm font-medium mb-1">Avg Price</div>
                                <div className="text-2xl font-bold">₹22.5<span className="text-xs text-gray-400 font-normal">/kWh</span></div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[140px]">
                                <div className="text-blue-300 text-sm font-medium mb-1">Active Volume</div>
                                <div className="text-2xl font-bold flex items-center gap-1">
                                    {displayedListings.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()} <span className="text-xs text-gray-400 font-normal">kWh</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Action Bar (Hidden on mobile) */}
                    <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <ShieldCheck className="w-4 h-4 text-green-400" /> All listings verified on-chain
                        </div>
                        <Link href="/create-listing">
                            <Button className="bg-white text-green-900 hover:bg-gray-100 font-bold shadow-lg transition-transform hover:scale-105">
                                <Zap className="w-4 h-4 mr-2 fill-green-900" /> Start Selling
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- Filters & Search Bar --- */}
            <div className="sticky top-4 z-30 bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between transition-all">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors w-5 h-5" />
                    <Input
                        placeholder="Search by zone, seller, or type..."
                        className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Button variant="outline" className="border-dashed border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600 h-10 px-4">
                        <Filter className="w-4 h-4 mr-2" /> Price
                    </Button>
                    <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-green-100 transition-colors px-3 py-1.5 h-auto text-sm">Zone A</Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-green-100 transition-colors px-3 py-1.5 h-auto text-sm">Zone B</Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-green-100 transition-colors px-3 py-1.5 h-auto text-sm">Solar</Badge>
                </div>
            </div>

            {/* --- Listings Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                {/* Show Loading only if checking blockchain AND no real listings found yet (optional optimization) */}
                {blockchainLoading && realListings.length === 0 && (
                    <div className="col-span-full text-center text-sm text-gray-400 mb-4 animate-pulse">Syncing with blockchain...</div>
                )}

                {filteredListings.length > 0 ? (
                    filteredListings.map((listing, index) => (
                        <MarketplaceCard key={listing.id} listing={listing} index={index} />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-semibold text-gray-600">No listings found</h3>
                        <p>Try adjusting your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Sub-Component: Listing Card ---
function MarketplaceCard({ listing, index }: { listing: EnergyListing; index: number }) {
    const [showBuyModal, setShowBuyModal] = useState(false);
    const router = useRouter();

    const handleBuyClick = () => {
        if (listing.isDemo) {
            // Smart redirection for demo items
            alert("This is a permanent sample listing. To interact with the blockchain, please create a new listing using 'Start Selling'. Your new listings will appear here automatically!");
        } else {
            setShowBuyModal(true);
        }
    };

    return (
        <>
            <div
                className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
            >
                {/* Image Area */}
                <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    {/* Placeholder Gradient if no image, or actual image if supported in future */}
                    <div className={`w-full h-full bg-gradient-to-br ${listing.type === 'wind' ? 'from-blue-200 to-cyan-100' : 'from-yellow-100 to-orange-100'} group-hover:scale-110 transition-transform duration-700 flex items-center justify-center`}>
                        {listing.type === 'wind' ? (
                            <Leaf className="w-16 h-16 text-blue-500/30" />
                        ) : (
                            <Zap className="w-16 h-16 text-yellow-500/30" />
                        )}
                    </div>

                    {/* Tags */}
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                        {listing.verified && (
                            <Badge className="bg-white/90 text-green-700 backdrop-blur hover:bg-white shadow-sm border-0 font-bold text-xs px-2.5">
                                <ShieldCheck className="w-3 h-3 mr-1" /> VERIFIED
                            </Badge>
                        )}
                        {!listing.isDemo && (
                            <Badge className="bg-blue-600 text-white shadow-sm border-0 font-bold text-xs px-2.5 animate-pulse">
                                LIVE ON CHAIN
                            </Badge>
                        )}
                    </div>

                    <div className="absolute bottom-4 left-4 z-20 text-white">
                        <div className="text-xs font-semibold opacity-90 uppercase tracking-widest mb-1">
                            {listing.location}
                        </div>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            {listing.amount} kWh
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-white shadow-inner flex items-center justify-center font-bold text-gray-500 text-sm">
                                {listing.seller[2]}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-900">Seller {listing.seller.slice(0, 4)}</div>
                                <div className="text-xs text-green-600 font-medium flex items-center">
                                    <Sparkles className="w-3 h-3 mr-1" /> 98% Reputation
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-gray-900">₹{listing.price}</div>
                            <div className="text-xs text-gray-400 font-medium">per kWh</div>
                        </div>
                    </div>

                    <p className="text-gray-500 text-sm line-clamp-2 mb-6 h-10">
                        {listing.description}
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                        <Button
                            className={`flex-1 font-bold h-12 text-md shadow-lg transition-transform active:scale-95
                                ${listing.isDemo
                                    ? 'bg-gray-900 hover:bg-gray-800 text-white'
                                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                                }
                            `}
                            onClick={handleBuyClick}
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {listing.isDemo ? 'Purchase (Demo)' : 'Buy Now'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal only renders for Real Listings */}
            {!listing.isDemo && listing.apiData && (
                <BuyEnergyModal
                    listing={listing.apiData}
                    open={showBuyModal}
                    onOpenChange={setShowBuyModal}
                    onSuccess={() => setShowBuyModal(false)}
                />
            )}
        </>
    );
}
