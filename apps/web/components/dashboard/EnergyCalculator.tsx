'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { formatINR } from '@/lib/currency';

export function EnergyCalculator() {
    const [consumption, setConsumption] = useState('300');
    const [solarCapacity, setSolarCapacity] = useState('5');

    const monthlyConsumption = parseFloat(consumption);
    const capacity = parseFloat(solarCapacity);
    const monthlyProduction = capacity * 4 * 30; // 4 hours/day avg
    const savings = Math.min(monthlyConsumption, monthlyProduction);
    const savingsINR = savings * 7; // ₹7 per kWh grid rate
    const yearlyINR = savingsINR * 12;

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-blue-600" />
                    Energy Savings Calculator
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div>
                    <label className="text-xs text-muted-foreground">Monthly Consumption (kWh)</label>
                    <Input
                        type="number"
                        value={consumption}
                        onChange={(e) => setConsumption(e.target.value)}
                        className="mt-1"
                        placeholder="e.g., 300"
                    />
                </div>
                <div>
                    <label className="text-xs text-muted-foreground">Solar Panel Capacity (kW)</label>
                    <Input
                        type="number"
                        value={solarCapacity}
                        onChange={(e) => setSolarCapacity(e.target.value)}
                        className="mt-1"
                        placeholder="e.g., 5"
                    />
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">Monthly Production:</span>
                        <span className="text-sm font-bold text-blue-600">
                            {monthlyProduction.toFixed(0)} kWh
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">Monthly Savings:</span>
                        <span className="text-sm font-bold text-green-600">
                            {formatINR(savingsINR)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-xs font-medium">Yearly Savings:</span>
                        <span className="text-lg font-bold text-green-600">
                            {formatINR(yearlyINR)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
