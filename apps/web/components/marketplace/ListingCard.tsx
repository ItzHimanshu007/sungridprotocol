'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sun, Zap, Clock, ShieldCheck } from 'lucide-react';
import { weiToINR, formatINR } from '@/lib/currency';

export interface Listing {
    id: string;
    seller: string;
    tokenId: string;
    amount: number; // kWh
    price: number; // ETH per kWh
    zone: string;
    expiresIn: string;
    verified: boolean;
    disabled?: boolean;
}

interface ListingCardProps {
    listing: Listing;
    onBuy: (listing: Listing) => void;
    disabled?: boolean;
}

export function ListingCard({ listing, onBuy, disabled }: ListingCardProps) {
    const ETH_TO_INR = 285000;
    const priceINR = listing.price * ETH_TO_INR;
    const totalCostINR = priceINR * listing.amount;

    return (
        <Card className="hover:shadow-lg transition-shadow border-slate-200">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <Badge variant={listing.verified ? "default" : "secondary"} className={listing.verified ? "bg-green-500 hover:bg-green-600" : ""}>
                        {listing.verified ? <ShieldCheck className="h-3 w-3 mr-1" /> : null}
                        {listing.verified ? "Verified Producer" : "Unverified"}
                    </Badge>
                    <Badge variant="outline" className="text-slate-500">
                        Zone {listing.zone}
                    </Badge>
                </div>
                <CardTitle className="text-xl mt-2 flex items-center">
                    <Sun className="h-5 w-5 text-yellow-500 mr-2" />
                    {listing.amount} kWh
                </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Price per kWh:</span>
                        <div className="text-right">
                            <span className="font-semibold text-lg block">₹{priceINR.toFixed(2)}</span>
                            <span className="text-xs text-muted-foreground">{listing.price.toFixed(6)} ETH</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Total Cost:</span>
                        <div className="text-right">
                            <span className="font-bold text-green-600 block">
                                {formatINR(totalCostINR)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {(listing.price * listing.amount).toFixed(6)} ETH
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                        <div className="flex items-center">
                            <Zap className="h-3 w-3 mr-1" />
                            Seller: {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {listing.expiresIn} left
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                    onClick={() => onBuy(listing)}
                    disabled={disabled || listing.disabled}
                >
                    Buy Energy
                </Button>
            </CardFooter>
        </Card>
    );
}
