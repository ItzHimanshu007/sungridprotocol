'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function CarbonOffsetCalculator() {
    const [kWh, setKWh] = useState('100');
    const carbonSaved = parseFloat(kWh) * 0.5; // 0.5 kg CO2 per kWh
    const treesEquivalent = (carbonSaved / 20).toFixed(1); // 1 tree absorbs ~20kg CO2/year

    return (
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-white/90 flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-white" />
                    CO₂ Impact
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="text-xs text-white/80 font-semibold">Solar Energy (kWh)</label>
                    <Input
                        type="number"
                        value={kWh}
                        onChange={(e) => setKWh(e.target.value)}
                        className="mt-1 bg-white/90 border-0 h-11 text-lg font-bold"
                        placeholder="Enter kWh"
                    />
                </div>
                <div className="p-4 bg-white/95 rounded-xl space-y-3 shadow-lg">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600 font-medium">CO₂ Saved:</span>
                        <span className="text-2xl font-black text-green-600">
                            {carbonSaved.toFixed(1)} kg
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">Trees Planted:</span>
                        <span className="text-lg font-bold text-emerald-600 flex items-center gap-1">
                            🌳 {treesEquivalent}
                        </span>
                    </div>
                </div>
                <p className="text-xs text-center text-white/90 font-medium pt-2">
                    ✨ Every kWh helps save our planet!
                </p>
            </CardContent>
        </Card>
    );
}
