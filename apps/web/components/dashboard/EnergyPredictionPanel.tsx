'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Brain, Zap, Sun, Cloud, CloudRain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export function EnergyPredictionPanel() {
    const predictions = [
        { time: '6 AM', actual: 2, predicted: 2.5, weather: 'sunny' },
        { time: '9 AM', actual: 8, predicted: 7.5, weather: 'sunny' },
        { time: '12 PM', actual: 15, predicted: 16, weather: 'sunny' },
        { time: '3 PM', actual: 18, predicted: 17, weather: 'partly-cloudy' },
        { time: '6 PM', actual: 10, predicted: 11, weather: 'cloudy' },
        { time: '9 PM', actual: 0, predicted: 0, weather: 'cloudy' },
    ];

    const getWeatherIcon = (weather: string) => {
        switch (weather) {
            case 'sunny': return <Sun className="h-3 w-3 text-yellow-500" />;
            case 'partly-cloudy': return <Cloud className="h-3 w-3 text-gray-400" />;
            case 'cloudy': return <Cloud className="h-3 w-3 text-gray-500" />;
            case 'rainy': return <CloudRain className="h-3 w-3 text-blue-500" />;
            default: return <Sun className="h-3 w-3" />;
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-purple-600" />
                            AI Energy Predictions
                        </CardTitle>
                        <CardDescription>
                            Smart forecasting based on weather and historical data
                        </CardDescription>
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600">
                        <Zap className="h-3 w-3 mr-1" />
                        AI Powered
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                {/* Chart */}
                <div className="h-[250px] mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={predictions}>
                            <defs>
                                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                            <YAxis stroke="#6b7280" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    padding: '8px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="predicted"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                fill="url(#colorPredicted)"
                                name="Predicted (kWh)"
                            />
                            <Area
                                type="monotone"
                                dataKey="actual"
                                stroke="#10b981"
                                strokeWidth={2}
                                fill="url(#colorActual)"
                                name="Actual (kWh)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Insights */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Smart Insights</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <span className="text-xs font-medium text-green-900">Peak Production</span>
                            </div>
                            <p className="text-xs text-green-700">
                                Expected at <strong>3 PM today</strong> with 18 kWh output
                            </p>
                        </div>

                        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                            <div className="flex items-center gap-2 mb-1">
                                <Sun className="h-4 w-4 text-blue-600" />
                                <span className="text-xs font-medium text-blue-900">Best Selling Time</span>
                            </div>
                            <p className="text-xs text-blue-700">
                                List energy between <strong>12 PM - 4 PM</strong> for max profit
                            </p>
                        </div>

                        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                            <div className="flex items-center gap-2 mb-1">
                                <Brain className="h-4 w-4 text-purple-600" />
                                <span className="text-xs font-medium text-purple-900">Accuracy</span>
                            </div>
                            <p className="text-xs text-purple-700">
                                Model accuracy: <strong>94.2%</strong> over last 30 days
                            </p>
                        </div>

                        <div className="p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                            <div className="flex items-center gap-2 mb-1">
                                <Cloud className="h-4 w-4 text-amber-600" />
                                <span className="text-xs font-medium text-amber-900">Weather Impact</span>
                            </div>
                            <p className="text-xs text-amber-700">
                                Partly cloudy afternoon may reduce output by <strong>15%</strong>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Hourly Forecast */}
                <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-3">Hourly Forecast</h4>
                    <div className="grid grid-cols-6 gap-2">
                        {predictions.map((pred, idx) => (
                            <div
                                key={pred.time}
                                className="text-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <p className="text-xs font-medium text-gray-600">{pred.time}</p>
                                <div className="my-1 flex justify-center">
                                    {getWeatherIcon(pred.weather)}
                                </div>
                                <p className="text-xs font-bold text-purple-600">{pred.predicted} kW</p>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
