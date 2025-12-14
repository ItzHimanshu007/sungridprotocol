'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Battery, Zap, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function BatteryStatus() {
    const batteryLevel = 78; // Mocked

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Battery Storage</CardTitle>
                <Battery className={`h-4 w-4 ${batteryLevel > 20 ? 'text-green-500' : 'text-red-500'}`} />
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between mb-2">
                    <div className="text-2xl font-bold">{batteryLevel}%</div>
                    <span className="text-sm text-muted-foreground">10.5 kWh / 13.5 kWh</span>
                </div>
                <Progress value={batteryLevel} className="h-2 mb-4" />

                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex flex-col">
                        <span className="text-muted-foreground p-1">Status</span>
                        <span className="font-semibold flex items-center p-1">
                            <Zap className="h-3 w-3 mr-1 text-yellow-500" /> Discharging
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground p-1">Health</span>
                        <span className="font-semibold text-green-600 p-1">Good (98%)</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
