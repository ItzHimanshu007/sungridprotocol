'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SlidersHorizontal, X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterState {
    priceRange: [number, number];
    amountRange: [number, number];
    zones: string[];
    verifiedOnly: boolean;
    sortBy: string;
}

interface AdvancedFiltersProps {
    onFilterChange?: (filters: FilterState) => void;
}

export function AdvancedFilters({ onFilterChange }: AdvancedFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        priceRange: [0, 100],
        amountRange: [0, 50],
        zones: [],
        verifiedOnly: false,
        sortBy: 'price-low'
    });

    const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'];
    const activeFiltersCount =
        (filters.zones.length > 0 ? 1 : 0) +
        (filters.verifiedOnly ? 1 : 0) +
        (filters.priceRange[0] > 0 || filters.priceRange[1] < 100 ? 1 : 0) +
        (filters.amountRange[0] > 0 || filters.amountRange[1] < 50 ? 1 : 0);

    const toggleZone = (zone: string) => {
        setFilters(prev => ({
            ...prev,
            zones: prev.zones.includes(zone)
                ? prev.zones.filter(z => z !== zone)
                : [...prev.zones, zone]
        }));
    };

    const resetFilters = () => {
        const defaultFilters = {
            priceRange: [0, 100] as [number, number],
            amountRange: [0, 50] as [number, number],
            zones: [],
            verifiedOnly: false,
            sortBy: 'price-low'
        };
        setFilters(defaultFilters);
        onFilterChange?.(defaultFilters);
    };

    const applyFilters = () => {
        onFilterChange?.(filters);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <Button
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className="relative"
            >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                    <Badge
                        className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary"
                    >
                        {activeFiltersCount}
                    </Badge>
                )}
            </Button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Filter Panel */}
                    <Card className="absolute right-0 top-12 w-[350px] z-50 shadow-xl animate-in slide-in-from-top-2">
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    <h3 className="font-semibold">Advanced Filters</h3>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsOpen(false)}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Sort By */}
                            <div className="space-y-2">
                                <Label>Sort By</Label>
                                <Select
                                    value={filters.sortBy}
                                    onValueChange={(value: string) => setFilters(prev => ({ ...prev, sortBy: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                                        <SelectItem value="amount-low">Amount: Low to High</SelectItem>
                                        <SelectItem value="amount-high">Amount: High to Low</SelectItem>
                                        <SelectItem value="newest">Newest First</SelectItem>
                                        <SelectItem value="expiring">Expiring Soon</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Price per kWh (₹)</Label>
                                    <span className="text-sm text-muted-foreground">
                                        ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                                    </span>
                                </div>
                                <Slider
                                    min={0}
                                    max={100}
                                    step={5}
                                    value={filters.priceRange}
                                    onValueChange={(value: number[]) =>
                                        setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))
                                    }
                                    className="w-full"
                                />
                            </div>

                            {/* Amount Range */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Energy Amount (kWh)</Label>
                                    <span className="text-sm text-muted-foreground">
                                        {filters.amountRange[0]} - {filters.amountRange[1]} kWh
                                    </span>
                                </div>
                                <Slider
                                    min={0}
                                    max={50}
                                    step={5}
                                    value={filters.amountRange}
                                    onValueChange={(value: number[]) =>
                                        setFilters(prev => ({ ...prev, amountRange: value as [number, number] }))
                                    }
                                    className="w-full"
                                />
                            </div>

                            {/* Grid Zones */}
                            <div className="space-y-3">
                                <Label>Grid Zones</Label>
                                <div className="flex flex-wrap gap-2">
                                    {zones.map((zone) => (
                                        <Badge
                                            key={zone}
                                            variant={filters.zones.includes(zone) ? "default" : "outline"}
                                            className={cn(
                                                "cursor-pointer transition-all hover:scale-105",
                                                filters.zones.includes(zone) && "bg-primary"
                                            )}
                                            onClick={() => toggleZone(zone)}
                                        >
                                            {zone}
                                            {filters.zones.includes(zone) && (
                                                <X className="ml-1 h-3 w-3" />
                                            )}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Verified Only */}
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "h-4 w-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer",
                                        filters.verifiedOnly
                                            ? "bg-primary border-primary"
                                            : "border-gray-300"
                                    )}
                                        onClick={() => setFilters(prev => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))}
                                    >
                                        {filters.verifiedOnly && (
                                            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <Label className="cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))}>
                                        Verified sellers only
                                    </Label>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    Recommended
                                </Badge>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={resetFilters}
                                >
                                    Reset
                                </Button>
                                <Button
                                    className="flex-1 bg-gradient-to-r from-primary to-orange-600"
                                    onClick={applyFilters}
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
