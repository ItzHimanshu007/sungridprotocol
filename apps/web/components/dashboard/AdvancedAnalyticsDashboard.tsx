'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Calendar, Zap, ArrowUpRight, ArrowDownRight, Sun, Battery, Wallet } from 'lucide-react';
import {
    ComposedChart,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Line
} from 'recharts';

// Realistic Sample Data representing a typical Prosumer week
const ANALYTICS_DATA = [
    { day: 'Mon', production: 42.5, consumption: 28.4, export: 14.1, earnings: 310.2, efficiency: 94 },
    { day: 'Tue', production: 45.2, consumption: 29.1, export: 16.1, earnings: 354.5, efficiency: 96 },
    { day: 'Wed', production: 38.9, consumption: 30.2, export: 8.7, earnings: 191.4, efficiency: 89 },
    { day: 'Thu', production: 48.6, consumption: 27.8, export: 20.8, earnings: 457.6, efficiency: 98 },
    { day: 'Fri', production: 44.1, consumption: 29.5, export: 14.6, earnings: 321.2, efficiency: 95 },
    { day: 'Sat', production: 52.3, consumption: 32.1, export: 20.2, earnings: 444.8, efficiency: 97 },
    { day: 'Sun', production: 50.8, consumption: 38.4, export: 12.4, earnings: 272.8, efficiency: 93 },
];

export function AdvancedAnalyticsDashboard() {
    const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

    // Calculate dynamic totals
    const totalProduction = ANALYTICS_DATA.reduce((acc, curr) => acc + curr.production, 0);
    const totalEarnings = ANALYTICS_DATA.reduce((acc, curr) => acc + curr.earnings, 0);
    const avgEfficiency = ANALYTICS_DATA.reduce((acc, curr) => acc + curr.efficiency, 0) / ANALYTICS_DATA.length;

    return (
        <Card className="col-span-2 shadow-2xl border-0 bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-800">
                            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
                                <BarChart3 className="h-6 w-6 text-white" />
                            </div>
                            Energy Analytics Studio
                        </CardTitle>
                        <CardDescription className="text-slate-500 font-medium mt-1">
                            Real-time generation, consumption, and revenue insights
                        </CardDescription>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
                        <button
                            onClick={() => setTimeRange('week')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${timeRange === 'week'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setTimeRange('month')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${timeRange === 'month'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Monthly
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                {/* Summary Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard
                        title="Total Production"
                        value={`${totalProduction.toFixed(1)} kWh`}
                        subValue="+12.5% vs last week"
                        icon={<Sun className="h-5 w-5" />}
                        trend="up"
                        color="orange"
                    />
                    <MetricCard
                        title="Net Earnings"
                        value={`₹${totalEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                        subValue="Avg. ₹22.5/kWh"
                        icon={<Wallet className="h-5 w-5" />}
                        trend="up"
                        color="green"
                    />
                    <MetricCard
                        title="System Efficiency"
                        value={`${avgEfficiency.toFixed(1)}%`}
                        subValue="Peak 98% (Thu)"
                        icon={<Zap className="h-5 w-5" />}
                        trend="stable"
                        color="blue"
                    />
                </div>

                {/* Main Chart Area */}
                <div className="h-[450px] w-full bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={ANALYTICS_DATA}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                            <defs>
                                <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }}
                                dy={10}
                            />
                            <YAxis
                                yAxisId="left"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                label={{ value: 'Earnings (₹)', angle: 90, position: 'insideRight', fill: '#94a3b8', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                    padding: '16px'
                                }}
                                itemStyle={{ padding: '2px 0' }}
                            />
                            <Legend
                                wrapperStyle={{ paddingTop: '20px' }}
                                iconType="circle"
                            />

                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="production"
                                name="Production"
                                stroke="#f59e0b"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorProd)"
                            />
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="consumption"
                                name="Consumption"
                                stroke="#6366f1"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorCons)"
                            />
                            <Bar
                                yAxisId="right"
                                dataKey="earnings"
                                name="Earnings (₹)"
                                fill="#10b981"
                                radius={[6, 6, 0, 0]}
                                barSize={16}
                                opacity={0.8}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="efficiency"
                                name="Efficiency %"
                                stroke="#ec4899"
                                strokeWidth={2}
                                dot={{ stroke: '#ec4899', strokeWidth: 2, r: 4, fill: '#fff' }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

function MetricCard({ title, value, subValue, icon, trend, color }: any) {
    const colorStyles = {
        orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', iconBg: 'bg-orange-100' },
        green: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', iconBg: 'bg-emerald-100' },
        blue: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', iconBg: 'bg-indigo-100' },
    };

    const style = colorStyles[color as keyof typeof colorStyles];

    return (
        <div className={`p-5 rounded-2xl border ${style.border} ${style.bg} transition-all duration-300 hover:shadow-md hover:-translate-y-1`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${style.iconBg} ${style.text}`}>
                    {icon}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-white/50">
                    {trend === 'up' && <ArrowUpRight className="h-3 w-3 text-green-600" />}
                    {trend === 'down' && <ArrowDownRight className="h-3 w-3 text-red-600" />}
                    {trend === 'stable' && <TrendingUp className="h-3 w-3 text-blue-600" />}
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h3>
                <p className={`text-sm font-semibold mt-1 ${style.text}`}>{subValue}</p>
            </div>
        </div>
    );
}
