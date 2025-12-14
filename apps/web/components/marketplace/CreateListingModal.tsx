'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function CreateListingModal() {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        // Simulate contract transaction
        setTimeout(() => {
            setIsLoading(false);
            setOpen(false);
            toast({
                title: "Listing Created!",
                description: "Your energy tokens have been listed on the marketplace.",
            });
        }, 2000);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-slate-900 text-white hover:bg-slate-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Listing
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>List Your Energy</DialogTitle>
                    <DialogDescription>
                        Set the price and amount of energy you want to sell to the grid.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <div className="col-span-3 relative">
                                <Input id="amount" type="number" placeholder="100" className="pl-9" required />
                                <Sun className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                                <span className="absolute right-3 top-3 text-gray-500 text-sm">kWh</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                                Price
                            </Label>
                            <div className="col-span-3 relative">
                                <Input id="price" type="number" step="0.0001" placeholder="0.05" className="col-span-3" required />
                                <span className="absolute right-12 top-2.5 text-gray-500 text-sm">ETH/kWh</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="duration" className="text-right">
                                Duration
                            </Label>
                            <Select defaultValue="24h">
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="24h">24 Hours</SelectItem>
                                    <SelectItem value="3d">3 Days</SelectItem>
                                    <SelectItem value="7d">7 Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                            {isLoading ? "Confirming..." : "Create Listing"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
