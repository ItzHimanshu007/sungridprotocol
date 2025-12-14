'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Wallet, TrendingUp, CheckCircle2, AlertCircle, Loader2, Info, Receipt, Fuel } from 'lucide-react';
import { usePurchaseEnergy } from '@/hooks/useMarketplace';
import { ApiListing } from '@/hooks/useListings';
import { useAccount, useBalance } from 'wagmi';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface BuyEnergyModalProps {
    listing: ApiListing | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function BuyEnergyModal({ listing, open, onOpenChange, onSuccess }: BuyEnergyModalProps) {
    const [amount, setAmount] = useState('');
    const { address, isConnected } = useAccount();
    const { data: balance } = useBalance({ address });
    const { purchaseEnergy, isPending, isSuccess, hash } = usePurchaseEnergy();

    // Reset state on close/open
    useEffect(() => {
        if (open) setAmount('');
    }, [open]);

    if (!listing) return null;

    const maxAmount = parseFloat(listing.remainingAmount);
    const purchaseAmount = parseFloat(amount) || 0;
    const pricePerKwhETH = parseFloat(listing.pricePerKwh);
    const pricePerKwhINR = parseFloat(listing.pricePerKwhINR);

    // Calculations
    const basePriceETH = purchaseAmount * pricePerKwhETH;
    const estimatedGasETH = 0.00015; // Mock gas estimate
    const platformFeeETH = basePriceETH * 0.01; // 1% fee
    const totalPriceETH = basePriceETH + platformFeeETH + (purchaseAmount > 0 ? estimatedGasETH : 0);

    const totalPriceINR = purchaseAmount * pricePerKwhINR; // Simplified for display

    const handleBuy = async () => {
        if (!isConnected || !amount || purchaseAmount <= 0 || purchaseAmount > maxAmount) {
            return;
        }

        try {
            const kWhAmountBigInt = BigInt(Math.floor(purchaseAmount * 1e18));

            // PRECISE CALCULATION:
            // Use the raw BigInt price from blockchain to avoid floating point errors.
            // Formula: (Amount_in_Wei_Units * Price_Per_Unit_Wei) / 1e18
            const priceVal = listing.pricePerKwhRaw ? BigInt(listing.pricePerKwhRaw) : BigInt(Math.floor(pricePerKwhETH * 1e18));
            const valueInWei = (kWhAmountBigInt * priceVal) / 1000000000000000000n;

            console.log('💸 Buying Energy:', {
                amount: purchaseAmount,
                amountWei: kWhAmountBigInt.toString(),
                priceRaw: priceVal.toString(),
                valueToSend: valueInWei.toString(),
                feeIncluded: false // Fee is usually deducted from seller
            });

            await purchaseEnergy({
                listingId: BigInt(listing.listingId),
                kWhAmount: kWhAmountBigInt,
                value: valueInWei,
            });

            // Wait a bit for success state
            setTimeout(() => {
                onSuccess?.();
                setAmount('');
            }, 3000);
        } catch (error) {
            console.error('Purchase failed:', error);
        }
    };

    const handleClose = () => {
        if (!isPending) {
            onOpenChange(false);
            setAmount('');
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 shadow-2xl">
                {/* Header Gradient */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black flex items-center gap-2 text-white">
                            <Zap className="h-6 w-6 text-yellow-300 fill-yellow-300 animate-pulse" />
                            Purchase Energy
                        </DialogTitle>
                        <DialogDescription className="text-green-100">
                            Secure clean energy directly from this producer.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6">
                    {!isConnected ? (
                        <div className="py-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <Wallet className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Wallet Not Connected</h3>
                            <p className="text-gray-500 mb-6">Connect your wallet to purchase energy.</p>
                        </div>
                    ) : isSuccess ? (
                        <div className="py-8 text-center animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-black text-green-700 mb-2">Purchase Successful!</h3>
                            <p className="text-gray-600 mb-6">Your energy tokens have been transferred.</p>

                            {hash && (
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-left mb-6">
                                    <Label className="text-xs text-gray-500 font-semibold uppercase">Transaction Hash</Label>
                                    <p className="text-xs font-mono text-gray-700 break-all mt-1">{hash}</p>
                                </div>
                            )}

                            <div className="grid gap-3">
                                <Button onClick={() => window.location.href = '/dashboard?tab=assets'} className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 shadow-md">
                                    View in Portfolio
                                </Button>
                                <Button variant="ghost" onClick={handleClose} className="w-full text-gray-500">
                                    Close
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Seller/Listing Snapshot */}
                            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                        {listing.seller.displayName?.[0] || 'S'}
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-600 font-bold uppercase">Seller</p>
                                        <p className="font-semibold text-gray-900 text-sm">
                                            {listing.seller.displayName || 'Solar Producer'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-blue-600 font-bold uppercase">Available</p>
                                    <p className="font-bold text-gray-900">{maxAmount.toLocaleString()} kWh</p>
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="amount" className="text-gray-700 font-semibold">Buying Amount (kWh)</Label>
                                    <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200" onClick={() => setAmount(maxAmount.toString())}>
                                        Max: {maxAmount}
                                    </Badge>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        max={maxAmount}
                                        min="0"
                                        step="1"
                                        disabled={isPending}
                                        className="pr-16 h-14 text-2xl font-bold border-gray-300 focus:border-green-500 focus:ring-green-100"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                                        kWh
                                    </div>
                                </div>
                                {purchaseAmount > maxAmount && (
                                    <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" /> Exceeds availability
                                    </p>
                                )}
                            </div>

                            {/* Receipt Summary */}
                            {purchaseAmount > 0 && (
                                <Card className="bg-gray-50 border border-gray-200 p-5 space-y-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Receipt className="h-4 w-4 text-gray-500" />
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction Summary</span>
                                    </div>

                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Energy Cost ({purchaseAmount} kWh)</span>
                                        <span>{basePriceETH.toFixed(6)} ETH</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span className="flex items-center gap-1"><Info className="h-3 w-3" /> Platform Fee (1%)</span>
                                        <span>{platformFeeETH.toFixed(6)} ETH</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span className="flex items-center gap-1"><Fuel className="h-3 w-3" /> Est. Network Fee</span>
                                        <span>{estimatedGasETH.toFixed(5)} ETH</span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                                        <span className="font-bold text-gray-900">Total Total</span>
                                        <div className="text-right">
                                            <div className="text-xl font-black text-green-700">{totalPriceETH.toFixed(5)} ETH</div>
                                            <div className="text-xs text-gray-500">≈ ₹{totalPriceINR.toFixed(2)}</div>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* Action Button */}
                            <Button
                                onClick={handleBuy}
                                disabled={
                                    isPending ||
                                    !amount ||
                                    purchaseAmount <= 0 ||
                                    purchaseAmount > maxAmount
                                }
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold h-14 text-lg shadow-lg"
                            >
                                {isPending ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Confirming on Blockchain...
                                    </div>
                                ) : (
                                    `Pay ${purchaseAmount > 0 ? (basePriceETH + estimatedGasETH).toFixed(5) : '0.00'} ETH`
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
