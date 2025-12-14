'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sun, Wifi, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function DeviceManager() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg">Smart Devices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Sun className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium leading-none">Smart Inverter</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <Activity className="h-3 w-3 mr-1" />
                                <span className="text-green-600">Producing 2.4 kW</span>
                            </div>
                        </div>
                    </div>
                    <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Wifi className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium leading-none">Smart Meter Gateway</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-[10px] h-5">Online</Badge>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground mb-1">Auto-Upload</span>
                        <Switch defaultChecked />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
