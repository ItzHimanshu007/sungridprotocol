'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Home, Users, Battery, Zap, TrendingUp, Gauge } from 'lucide-react';

export function EnergyFlowVisualization() {
    // Realistic simulation state (Residential Prosumer Scale ~5kW system)
    const [production, setProduction] = useState(4.8);
    const [consumption, setConsumption] = useState(1.2);
    const [batteryLevel, setBatteryLevel] = useState(78);

    // Simulate live fluctuations
    useEffect(() => {
        const interval = setInterval(() => {
            setProduction(prev => {
                const fluctuation = (Math.random() - 0.5) * 0.4;
                return Math.max(0, Math.min(7.5, parseFloat((prev + fluctuation).toFixed(2))));
            });
            setConsumption(prev => {
                const fluctuation = (Math.random() - 0.5) * 0.2;
                return Math.max(0.5, Math.min(3.5, parseFloat((prev + fluctuation).toFixed(2))));
            });

            // Slowly charge battery if surplus, discharge if deficit
            setBatteryLevel(prev => {
                const isCharging = Math.random() > 0.3; // Mostly charging during day
                const change = isCharging ? 0.1 : -0.05;
                return Math.min(100, Math.max(0, parseFloat((prev + change).toFixed(1))));
            });
        }, 2000); // Smoother 2s updates
        return () => clearInterval(interval);
    }, []);

    const surplus = parseFloat((production - consumption).toFixed(2));
    const isSelling = surplus > 0;
    const gridValue = Math.abs(surplus);

    return (
        <Card className="overflow-hidden bg-white border-none shadow-2xl ring-1 ring-gray-100 h-full">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                <CardTitle className="flex items-center gap-3 text-xl font-black text-gray-800">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        <Zap className="h-5 w-5 text-yellow-600 animate-pulse" />
                    </div>
                    Live Energy Matrix
                    <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                        <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Connected</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-8 relative">

                {/* Visual Flow Container */}
                <div className="relative h-64 w-full max-w-md mx-auto">

                    {/* SOLAR (TOP) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                        <FlowNode
                            icon={<Sun className="h-6 w-6 text-orange-500" />}
                            label="Solar PV"
                            value={production.toFixed(2)}
                            unit="kW"
                            color="orange"
                            glow
                        />
                    </div>

                    {/* HOUSE (BOTTOM LEFT) */}
                    <div className="absolute bottom-0 left-0 z-10">
                        <FlowNode
                            icon={<Home className="h-6 w-6 text-blue-500" />}
                            label="Home Load"
                            value={consumption.toFixed(2)}
                            unit="kW"
                            color="blue"
                        />
                    </div>

                    {/* GRID (BOTTOM RIGHT) */}
                    <div className="absolute bottom-0 right-0 z-10">
                        <FlowNode
                            icon={<Users className="h-6 w-6 text-purple-500" />}
                            label={isSelling ? "Exporting" : "Importing"}
                            value={gridValue.toFixed(2)}
                            unit="kW"
                            color="purple"
                            statusColor={isSelling ? 'text-green-600' : 'text-red-600'}
                        />
                    </div>

                    {/* BATTERY (CENTER LEFT) */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 z-10">
                        <div className="flex flex-col items-center gap-1">
                            <div className="relative">
                                <Battery className={`h-10 w-10 ${batteryLevel > 20 ? 'text-green-500' : 'text-red-500'} rotate-[-90deg]`} />
                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                                    <Zap className="h-3 w-3 fill-current text-green-500" />
                                </div>
                            </div>
                            <span className="text-xs font-bold text-gray-600">{batteryLevel.toFixed(1)}%</span>
                        </div>
                    </div>

                    {/* HUB (CENTER) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                        <div className="relative w-24 h-24 bg-white rounded-full shadow-xl border-4 border-gray-50 flex flex-col items-center justify-center">
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Net Flow</span>
                            <div className={`text-2xl font-black ${isSelling ? 'text-green-500' : 'text-orange-500'}`}>
                                {isSelling ? '+' : '-'}{gridValue.toFixed(2)}
                            </div>
                            <span className="text-xs font-semibold text-gray-400">kW</span>
                        </div>
                    </div>

                    {/* ANIMATED LINES / SVG OVERLAY */}
                    <svg className="absolute inset-0 w-full h-full -z-0 pointer-events-none stroke-current text-gray-200">
                        {/* Solar to Hub */}
                        <path d="M 50% 15% L 50% 35%" strokeWidth="4" strokeDasharray="6 4" className="animate-[dash_1s_linear_infinite]" />
                        {/* Hub to Home */}
                        <path d="M 45% 60% L 20% 85%" strokeWidth="4" strokeDasharray="6 4" className="animate-[dash_1s_linear_infinite]" style={{ animationDirection: 'reverse' }} />
                        {/* Hub to Grid */}
                        <path d="M 55% 60% L 80% 85%" strokeWidth="4" strokeDasharray="6 4" className={`animate-[dash_1s_linear_infinite] ${isSelling ? '' : 'stroke-red-200'}`} />
                    </svg>
                </div>

                {/* Footer Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-6 border-t border-gray-50">
                    <MetricFooterItem label="Daily Production" value="28.4 kWh" icon={<Sun className="h-3 w-3" />} color="text-orange-600" />
                    <MetricFooterItem label="Self Sufficiency" value="86%" icon={<Gauge className="h-3 w-3" />} color="text-green-600" />
                    <MetricFooterItem label="Est. Earnings" value="₹145.20" icon={<TrendingUp className="h-3 w-3" />} color="text-purple-600" />
                </div>

                <style jsx>{`
                    @keyframes dash {
                        to {
                            stroke-dashoffset: -20;
                        }
                    }
                `}</style>
            </CardContent>
        </Card>
    );
}

function FlowNode({ icon, label, value, unit, color, glow, statusColor }: any) {
    const colorStyles = {
        orange: 'bg-orange-50 text-orange-600 border-orange-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
    };
    const style = colorStyles[color as keyof typeof colorStyles];

    return (
        <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${glow ? 'scale-110' : ''}`}>
            <div className={`p-3 rounded-2xl border-2 ${style} ${glow ? 'shadow-lg shadow-orange-100 ring-2 ring-orange-100 ring-offset-2' : 'shadow-sm'}`}>
                {icon}
            </div>
            <div className="text-center">
                <div className={`text-sm font-bold text-gray-900 ${statusColor}`}>{value} <span className="text-xs font-normal text-gray-500">{unit}</span></div>
                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{label}</div>
            </div>
        </div>
    );
}

function MetricFooterItem({ label, value, icon, color }: any) {
    return (
        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
            <div className={`flex items-center gap-1 text-xs font-bold ${color} mb-1`}>
                {icon} {label}
            </div>
            <div className="text-lg font-black text-gray-800">{value}</div>
        </div>
    );
}
