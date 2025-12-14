'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Zap, Upload, CheckCircle2, Loader2, MapPin, Fuel, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
import { uploadListingMetadata, uploadImage } from '@/lib/ipfs';
import { CONTRACTS, ABIS } from '@/lib/contracts';
import { useToast } from '@/components/ui/use-toast';
import { parseEther, decodeEventLog, formatEther } from 'viem';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSubmitTransaction } from '@/hooks/useTransactionTracker';

export default function CreateListingPage() {
    const { address, isConnected } = useAccount();
    const { toast } = useToast();
    const router = useRouter();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();
    const { submitTransaction } = useSubmitTransaction();

    // Form State
    const [formData, setFormData] = useState({
        kWhAmount: '',
        pricePerKwh: '',
        location: '',
        description: '',
        duration: '7' // days
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Progress State
    const [status, setStatus] = useState<'idle' | 'uploading' | 'minting' | 'approving' | 'listing' | 'success'>('idle');

    // Handle Image Selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            // Create local preview URL
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        }
    };

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected) {
            toast({ title: "Wallet not connected", description: "Please connect your wallet first", variant: "destructive" });
            return;
        }

        if (!publicClient) {
            toast({ title: "Error", description: "Blockchain client not initialized", variant: "destructive" });
            return;
        }

        setStatus('uploading');
        try {
            // 1. Upload Image to IPFS
            let imageUri = '';
            if (imageFile) {
                imageUri = await uploadImage(imageFile);
            }

            // 2. Upload Metadata to IPFS
            const metadataUri = await uploadListingMetadata({
                name: `${formData.kWhAmount} kWh Energy Token`,
                description: formData.description,
                image: imageUri,
                location: formData.location,
                gridZone: 1, // Default to zone 1 for now
                seller: address || '',
                attributes: [
                    { trait_type: 'Energy Amount', value: formData.kWhAmount },
                    { trait_type: 'Location', value: formData.location }
                ]
            });

            console.log('Metadata uploaded:', metadataUri);

            // 3. Mint Token
            setStatus('minting');
            const amountWei = parseEther(formData.kWhAmount);

            const mintTxHash = await submitTransaction(
                writeContractAsync({
                    address: CONTRACTS.EnergyToken as `0x${string}`,
                    abi: ABIS.EnergyToken as any,
                    functionName: 'mintEnergy',
                    args: [address!, amountWei, 1n, metadataUri],
                }),
                'mint',
                `Minting ${formData.kWhAmount} kWh Energy Token`
            ) as `0x${string}`;

            const mintReceipt = await publicClient.waitForTransactionReceipt({ hash: mintTxHash });

            // Extract Token ID
            let tokenId: bigint | undefined;
            for (const log of mintReceipt.logs) {
                try {
                    const decoded = decodeEventLog({
                        abi: ABIS.EnergyToken as any,
                        data: log.data,
                        topics: log.topics,
                    });
                    if ((decoded as any).eventName === 'EnergyMinted') {
                        tokenId = (decoded as any).args.tokenId;
                        break;
                    }
                } catch (err) {
                    continue;
                }
            }

            if (!tokenId) throw new Error("Failed to capture Token ID");

            // 4. Approve Marketplace
            setStatus('approving');
            const isApproved = await publicClient.readContract({
                address: CONTRACTS.EnergyToken as `0x${string}`,
                abi: ABIS.EnergyToken as any,
                functionName: 'isApprovedForAll',
                args: [address!, CONTRACTS.Marketplace],
            });

            if (!isApproved) {
                const approveTxHash = await submitTransaction(
                    writeContractAsync({
                        address: CONTRACTS.EnergyToken as `0x${string}`,
                        abi: ABIS.EnergyToken as any,
                        functionName: 'setApprovalForAll',
                        args: [CONTRACTS.Marketplace, true],
                    }),
                    'approve',
                    'Approving Marketplace Contract'
                ) as `0x${string}`;
                await publicClient.waitForTransactionReceipt({ hash: approveTxHash });
            }

            // 5. Create Listing
            setStatus('listing');
            const priceWei = parseEther(formData.pricePerKwh);
            const durationSeconds = BigInt(formData.duration) * 24n * 60n * 60n;

            const listTxHash = await submitTransaction(
                writeContractAsync({
                    address: CONTRACTS.Marketplace as `0x${string}`,
                    abi: ABIS.Marketplace as any,
                    functionName: 'createListing',
                    args: [tokenId, amountWei, priceWei, durationSeconds],
                }),
                'list',
                `Listing ${formData.kWhAmount} kWh for sale`
            ) as `0x${string}`;

            await publicClient.waitForTransactionReceipt({ hash: listTxHash });

            setStatus('success');
            toast({
                title: "Listing Live!",
                description: "Your energy is now available on the SunGrid marketplace."
            });

            setTimeout(() => {
                router.push('/dashboard?tab=marketplace');
            }, 3000);

        } catch (error: any) {
            console.error('Error creating listing:', error);
            setStatus('idle');
            toast({
                title: "Error",
                description: error.message || "Failed to create listing",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Create Listing
                    </h1>
                    <p className="text-gray-500 mt-1 text-lg">
                        Turn your excess solar production into tradeable assets.
                    </p>
                </div>
                {status === 'success' && (
                    <Button variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Listing Active
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN: FORM */}
                <div className="lg:col-span-7 space-y-6">
                    <Card className="border shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between gap-2 text-xl w-full">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                    Energy Details
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFormData({
                                        kWhAmount: '50',
                                        pricePerKwh: '0.0001',
                                        location: 'Demo Zone A',
                                        description: 'High efficiency solar panels - Verified Source.',
                                        duration: '7'
                                    })}
                                    className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                >
                                    ✨ Demo Fill
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-gray-600 font-medium">Energy Amount (kWh)</Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                placeholder="100"
                                                className="pl-4 h-11 text-lg font-semibold"
                                                value={formData.kWhAmount}
                                                onChange={(e) => setFormData({ ...formData, kWhAmount: e.target.value })}
                                                required
                                                disabled={status !== 'idle'}
                                            />
                                            <div className="absolute right-3 top-3 text-sm text-gray-400 font-bold">kWh</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-600 font-medium flex justify-between items-center">
                                            Price per kWh (ETH)
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-5 px-2 text-[10px] text-green-600 bg-green-50 hover:bg-green-100 uppercase tracking-wide font-bold"
                                                onClick={() => setFormData(prev => ({ ...prev, pricePerKwh: '0.00012' }))}
                                            >
                                                Use Market Avg
                                            </Button>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                step="0.000001"
                                                placeholder="0.0001"
                                                className="pl-4 h-11 text-lg font-semibold"
                                                value={formData.pricePerKwh}
                                                onChange={(e) => setFormData({ ...formData, pricePerKwh: e.target.value })}
                                                required
                                                disabled={status !== 'idle'}
                                            />
                                            <div className="absolute right-3 top-3 text-sm text-gray-400 font-bold">ETH</div>
                                        </div>
                                        <p className="text-xs text-gray-400 text-right">
                                            ≈ ₹{(Number(formData.pricePerKwh || 0) * 225000).toFixed(2)} INR
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-600 font-medium">Location / Zone</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            className="pl-10 h-11"
                                            placeholder="e.g. Zone A, Downtown Solar Array"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            required
                                            disabled={status !== 'idle'}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-600 font-medium">Description</Label>
                                    <Textarea
                                        placeholder="Describe your energy source quality..."
                                        className="resize-none h-24"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        disabled={status !== 'idle'}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-600 font-medium">Proof of Generation (Image)</Label>
                                    <div className={`border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-all cursor-pointer relative group ${status !== 'idle' ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={handleImageChange}
                                            disabled={status !== 'idle'}
                                        />
                                        <div className="flex flex-col items-center justify-center gap-2 text-gray-400 group-hover:text-green-600 transition-colors">
                                            <Upload className="h-8 w-8" />
                                            <span className="font-medium text-sm">
                                                {imageFile ? imageFile.name : "Drop image or click to upload"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transition-all"
                                    disabled={status !== 'idle' || !isConnected}
                                >
                                    {status === 'idle' ? (
                                        <span className="flex items-center gap-2">
                                            Prepare Listing <ArrowRight className="h-5 w-5" />
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Processing Transaction... <Loader2 className="h-5 w-5 animate-spin" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: PREVIEW & STEPS */}
                <div className="lg:col-span-5 space-y-8">

                    {/* Real-time Preview */}
                    <div className="sticky top-8 space-y-6">
                        <Label className="text-gray-500 font-semibold uppercase tracking-wider text-xs">Live Preview</Label>
                        <Card className="overflow-hidden border-2 border-green-100 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform">
                            <div className="h-48 bg-gray-100 relative">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Energy Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                                        <Zap className="h-12 w-12 text-green-200" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-green-800 shadow-sm">
                                    VERIFIED SOURCE
                                </div>
                            </div>
                            <CardContent className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                                            {formData.kWhAmount || '0'} kWh Bundle
                                        </h3>
                                        <div className="flex items-center text-gray-500 text-sm mt-1">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {formData.location || 'Unknown Location'}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-black text-green-600">
                                            {formData.pricePerKwh || '0'} ETH
                                        </div>
                                        <div className="text-xs text-gray-400">per kWh</div>
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 italic border border-gray-100 min-h-[60px]">
                                    "{formData.description || 'No description provided yet...'}"
                                </div>
                            </CardContent>
                            <CardFooter className="bg-gray-50/50 p-4 border-t flex justify-between items-center text-sm">
                                <span className="text-gray-500">Seller</span>
                                <span className="font-mono font-medium text-gray-900">
                                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}
                                </span>
                            </CardFooter>
                        </Card>

                        {/* Transaction Stepper */}
                        {status !== 'idle' && (
                            <div className="bg-white rounded-xl shadow-lg border p-6 animate-in slide-in-from-bottom-4">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                                    Blockchain Processing
                                </h3>
                                <div className="space-y-4">
                                    <StepItem
                                        label="Upload to IPFS"
                                        status={getStepStatus(status, 'uploading')}
                                    />
                                    <StepItem
                                        label="Mint Energy Token"
                                        status={getStepStatus(status, 'minting')}
                                        subtext="Creating unique NFT asset"
                                    />
                                    <StepItem
                                        label="Approve Marketplace"
                                        status={getStepStatus(status, 'approving')}
                                        subtext="Authorizing smart contract"
                                    />
                                    <StepItem
                                        label="Create Listing"
                                        status={getStepStatus(status, 'listing')}
                                        subtext="Finalizing trade offer"
                                    />
                                </div>

                                {status === 'success' && (
                                    <div className="mt-6 pt-4 border-t text-center">
                                        <p className="text-green-600 font-bold mb-2">Listing Successfully Created!</p>
                                        <Link href="/dashboard?tab=marketplace">
                                            <Button variant="outline" size="sm">Go to Marketplace</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Gas Estimator */}
                        {status === 'idle' && (
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex items-center justify-between text-sm text-blue-800">
                                <span className="flex items-center gap-2">
                                    <Fuel className="h-4 w-4" /> Est. Gas Cost
                                </span>
                                <span className="font-mono font-bold">~0.0025 ETH</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Logic to determine step state
function getStepStatus(currentStatus: string, stepName: string) {
    const order = ['uploading', 'minting', 'approving', 'listing', 'success'];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepName);

    if (currentStatus === 'success') return 'completed';
    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'loading';
    return 'pending';
}

function StepItem({ label, status, subtext }: { label: string, status: 'pending' | 'loading' | 'completed', subtext?: string }) {
    return (
        <div className={`flex items-start gap-3 ${status === 'pending' ? 'opacity-40' : 'opacity-100'} transition-opacity`}>
            <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                ${status === 'completed' ? 'bg-green-600 border-green-600 text-white' : ''}
                ${status === 'loading' ? 'border-green-600 text-green-600' : ''}
                ${status === 'pending' ? 'border-gray-300 text-gray-300' : ''}
            `}>
                {status === 'completed' && <CheckCircle2 className="h-3.5 w-3.5" />}
                {status === 'loading' && <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />}
                {status === 'pending' && <div className="w-2 h-2 bg-gray-300 rounded-full" />}
            </div>
            <div>
                <div className={`font-semibold text-sm ${status === 'loading' ? 'text-green-700' : 'text-gray-900'}`}>
                    {label}
                </div>
                {status === 'loading' && subtext && (
                    <div className="text-xs text-green-600 mt-0.5">{subtext}</div>
                )}
            </div>
        </div>
    );
}
