'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets, Eye, Gauge } from 'lucide-react';

interface WeatherData {
    condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
    temperature: number;
    humidity: number;
    windSpeed: number;
    uvIndex: number;
    prediction: number; // kWh expected
}

interface ForecastDay {
    day: string;
    condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy';
    high: number;
    low: number;
    expectedProduction: number;
}

export function WeatherSolarPredictor() {
    const [currentWeather, setCurrentWeather] = useState<WeatherData>({
        condition: 'sunny',
        temperature: 28,
        humidity: 65,
        windSpeed: 12,
        uvIndex: 8,
        prediction: 95
    });

    const forecast: ForecastDay[] = [
        { day: 'Today', condition: 'sunny', high: 32, low: 24, expectedProduction: 95 },
        { day: 'Tomorrow', condition: 'sunny', high: 31, low: 23, expectedProduction: 92 },
        { day: 'Wed', condition: 'partly-cloudy', high: 29, low: 22, expectedProduction: 78 },
        { day: 'Thu', condition: 'cloudy', high: 27, low: 21, expectedProduction: 65 },
        { day: 'Fri', condition: 'rainy', high: 26, low: 20, expectedProduction: 42 },
        { day: 'Sat', condition: 'partly-cloudy', high: 28, low: 21, expectedProduction: 75 },
        { day: 'Sun', condition: 'sunny', high: 30, low: 23, expectedProduction: 88 },
    ];

    const getWeatherIcon = (condition: string) => {
        switch (condition) {
            case 'sunny':
                return <Sun className="h-12 w-12 text-yellow-500" />;
            case 'partly-cloudy':
                return <Cloud className="h-12 w-12 text-gray-400" />;
            case 'cloudy':
                return <Cloud className="h-12 w-12 text-gray-600" />;
            case 'rainy':
                return <CloudRain className="h-12 w-12 text-blue-500" />;
            default:
                return <Sun className="h-12 w-12 text-yellow-500" />;
        }
    };

    const getProductionColor = (production: number) => {
        if (production >= 85) return 'text-green-600';
        if (production >= 60) return 'text-yellow-600';
        return 'text-orange-600';
    };

    return (
        <Card className="shadow-xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sun className="h-6 w-6 text-yellow-500" />
                    Weather & Solar Forecast
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Current Conditions */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-sm font-semibold opacity-90">Current Conditions</div>
                            <div className="text-6xl font-black mt-2">{currentWeather.temperature}°C</div>
                            <div className="text-lg capitalize mt-1">{currentWeather.condition}</div>
                        </div>
                        <div className="transform scale-150">
                            {getWeatherIcon(currentWeather.condition)}
                        </div>
                    </div>

                    {/* Solar Prediction */}
                    <div className="mt-6 pt-4 border-t border-white/30">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold">Expected Production Today</span>
                            <span className="text-2xl font-bold">{currentWeather.prediction} kWh</span>
                        </div>
                        <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-500 shadow-lg"
                                style={{ width: `${currentWeather.prediction}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <WeatherDetailCard
                        icon={<Droplets className="h-5 w-5 text-blue-600" />}
                        label="Humidity"
                        value={`${currentWeather.humidity}%`}
                        gradient="from-blue-400 to-cyan-500"
                    />
                    <WeatherDetailCard
                        icon={<Wind className="h-5 w-5 text-gray-600" />}
                        label="Wind Speed"
                        value={`${currentWeather.windSpeed} km/h`}
                        gradient="from-gray-400 to-gray-600"
                    />
                    <WeatherDetailCard
                        icon={<Eye className="h-5 w-5 text-purple-600" />}
                        label="UV Index"
                        value={`${currentWeather.uvIndex}/10`}
                        gradient="from-purple-400 to-pink-500"
                    />
                    <WeatherDetailCard
                        icon={<Gauge className="h-5 w-5 text-green-600" />}
                        label="Efficiency"
                        value="94%"
                        gradient="from-green-400 to-emerald-500"
                    />
                </div>

                {/* 7-Day Forecast */}
                <div className="space-y-3">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <Cloud className="h-5 w-5" />
                        7-Day Solar Production Forecast
                    </h3>

                    <div className="space-y-2">
                        {forecast.map((day, index) => (
                            <div
                                key={day.day}
                                className="flex items-center gap-4 p-4 rounded-xl bg-white shadow hover:shadow-md transition-all group border border-gray-100"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Day */}
                                <div className="w-20 font-bold text-gray-900">
                                    {day.day}
                                </div>

                                {/* Weather Icon */}
                                <div className="transform group-hover:scale-110 transition-transform">
                                    {getWeatherIcon(day.condition)}
                                </div>

                                {/* Temperature */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-900 font-semibold">{day.high}°</span>
                                        <span className="text-gray-500 text-sm">{day.low}°</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"
                                            style={{ width: `${((day.high - day.low) / 20) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Production Prediction */}
                                <div className="text-right">
                                    <div className={`text-2xl font-bold ${getProductionColor(day.expectedProduction)}`}>
                                        {day.expectedProduction}
                                    </div>
                                    <div className="text-xs text-gray-500">kWh</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Insight */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                            <Gauge className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1">AI Recommendation</h4>
                            <p className="text-sm text-gray-700">
                                ⚡ Excellent solar conditions today! Consider selling energy at <strong>premium rates</strong>
                                between 12-3 PM. Rain expected Friday - plan accordingly.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function WeatherDetailCard({ icon, label, value, gradient }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    gradient: string;
}) {
    return (
        <div className="p-4 rounded-xl bg-white shadow hover:shadow-md transition-all border border-gray-100">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} text-white`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <div className="text-xs text-gray-600">{label}</div>
                    <div className="text-lg font-bold text-gray-900">{value}</div>
                </div>
            </div>
        </div>
    );
}
