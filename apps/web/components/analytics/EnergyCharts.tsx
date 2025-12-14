'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const energyData = [
    { time: '00:00', generation: 0, consumption: 0.8 },
    { time: '04:00', generation: 0, consumption: 0.6 },
    { time: '06:00', generation: 0.5, consumption: 0.9 },
    { time: '08:00', generation: 1.5, consumption: 1.2 },
    { time: '10:00', generation: 3.2, consumption: 1.4 },
    { time: '12:00', generation: 4.8, consumption: 1.5 },
    { time: '14:00', generation: 4.5, consumption: 1.6 },
    { time: '16:00', generation: 3.2, consumption: 1.8 },
    { time: '18:00', generation: 1.2, consumption: 2.5 },
    { time: '20:00', generation: 0, consumption: 2.2 },
    { time: '23:59', generation: 0, consumption: 1.1 },
];

const financialData = [
    { month: 'Jan', earnings: 120, savings: 45 },
    { month: 'Feb', earnings: 135, savings: 50 },
    { month: 'Mar', earnings: 160, savings: 55 },
    { month: 'Apr', earnings: 210, savings: 65 },
    { month: 'May', earnings: 255, savings: 80 },
    { month: 'Jun', earnings: 310, savings: 95 },
];

export function EnergyCharts() {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Energy Overview (24h)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={energyData}>
                                <defs>
                                    <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EAB308" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="generation"
                                    stroke="#EAB308"
                                    fillOpacity={1}
                                    fill="url(#colorGen)"
                                    name="Solar Generation (kWh)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="consumption"
                                    stroke="#3B82F6"
                                    fillOpacity={1}
                                    fill="url(#colorCons)"
                                    name="Consumption (kWh)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-2 md:col-span-1">
                <CardHeader>
                    <CardTitle>Financial Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={financialData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis tickFormatter={(val) => `$${val}`} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="earnings" fill="#22c55e" name="Earnings ($)" />
                                <Bar dataKey="savings" fill="#3b82f6" name="Bill Savings ($)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-2 md:col-span-1">
                <CardHeader>
                    <CardTitle>Grid Contribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={financialData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="earnings" stroke="#8884d8" name="Power Exported (kWh)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
