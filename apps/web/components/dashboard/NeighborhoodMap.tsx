'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Map, Zap, User, Star, ArrowRight, Loader2 } from 'lucide-react';

// Dynamically import MapContainer and other Leaflet components to avoid SSR issues
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

interface Producer {
    id: string;
    name: string;
    lat: number;
    lng: number;
    energy: number; // kWh
    price: number; // ₹/kWh
    rating: number;
    type: 'solar' | 'wind' | 'biomass';
}

// Mock Data: Centered around LNMIIT Jaipur (approx location)
const CENTER_LAT = 26.9363;
const CENTER_LNG = 75.9235;

const MOCK_PRODUCERS: Producer[] = [
    { id: '1', name: 'Campus Solar Array A', lat: 26.9380, lng: 75.9250, energy: 1500, price: 12.5, rating: 4.9, type: 'solar' },
    { id: '2', name: 'Faculty Housing Block B', lat: 26.9350, lng: 75.9220, energy: 450, price: 11.0, rating: 4.7, type: 'solar' },
    { id: '3', name: 'Main Gate Wind Turbine', lat: 26.9390, lng: 75.9210, energy: 800, price: 10.5, rating: 4.5, type: 'wind' },
    { id: '4', name: 'Hostel Roof Project', lat: 26.9340, lng: 75.9260, energy: 320, price: 13.0, rating: 4.2, type: 'solar' },
    { id: '5', name: 'Nearby Farm Biogas', lat: 26.9320, lng: 75.9290, energy: 2000, price: 9.5, rating: 4.8, type: 'biomass' },
];

export function NeighborhoodMap() {
    const [isMounted, setIsMounted] = useState(false);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

    useEffect(() => {
        setIsMounted(true);
        // Simulate getting user location
        setUserLocation([CENTER_LAT, CENTER_LNG]);

        // Use a fix for Leaflet default icons if needed, but we'll try standard first
        // and if icons are broken, we might need a custom icon solution. 
        // For now, simpler is better.
    }, []);

    if (!isMounted) {
        return (
            <Card className="h-[600px] flex items-center justify-center bg-gray-50 border-0 shadow-inner">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                    <p className="text-gray-500 font-medium">Loading Neighborhood Grid...</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="shadow-xl bg-white border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-indigo-900">
                            <Map className="h-6 w-6 text-indigo-600" />
                            Neighborhood Energy Grid
                        </CardTitle>
                        <CardDescription className="text-indigo-600/80 font-medium">
                            Find verified renewable energy producers near you
                        </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-white text-indigo-600 shadow-sm px-4 py-2 text-sm font-semibold">
                        📍 {MOCK_PRODUCERS.length} Active Producers Nearby
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0 relative h-[600px]">
                {/* Leaflet Map */}
                <div className="absolute inset-0 z-0">
                    <MapContainer
                        center={[CENTER_LAT, CENTER_LNG]}
                        zoom={15}
                        scrollWheelZoom={false}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Producers Markers */}
                        {MOCK_PRODUCERS.map((producer) => (
                            <Marker key={producer.id} position={[producer.lat, producer.lng]}>
                                <Popup>
                                    <div className="p-1 min-w-[200px]">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold text-gray-900 text-lg">{producer.name}</h3>
                                            <Badge className={
                                                producer.type === 'solar' ? 'bg-orange-100 text-orange-700' :
                                                    producer.type === 'wind' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-green-100 text-green-700'
                                            }>{producer.type.toUpperCase()}</Badge>
                                        </div>

                                        <div className="space-y-2 mb-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Available:</span>
                                                <span className="font-bold text-gray-900">{producer.energy} kWh</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Price:</span>
                                                <span className="font-bold text-green-600">₹{producer.price}/kWh</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Rating:</span>
                                                <div className="flex items-center text-yellow-500 font-bold">
                                                    <Star className="h-3 w-3 fill-current mr-1" />
                                                    {producer.rating}
                                                </div>
                                            </div>
                                        </div>

                                        <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                                            Buy Energy <ArrowRight className="h-3 w-3 ml-1" />
                                        </Button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {/* User Location Marker (Different Color theoretically, but standard marker for now) */}
                        <Marker position={[CENTER_LAT, CENTER_LNG]}>
                            <Popup>
                                <div className="font-bold text-center">🏠 You are here</div>
                            </Popup>
                        </Marker>

                    </MapContainer>
                </div>

                {/* Overlay Info Panel */}
                <div className="absolute top-4 right-4 z-[1000] w-72 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-100 hidden md:block">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        Grid Snapshot
                    </h4>
                    <div className="space-y-4">
                        <div className="p-3 bg-indigo-50 rounded-lg">
                            <div className="text-xs text-indigo-600 font-bold uppercase mb-1">Avg Local Price</div>
                            <div className="text-2xl font-black text-indigo-900">₹11.3<span className="text-sm text-indigo-400 font-medium">/kWh</span></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-green-50 rounded-lg">
                                <div className="text-xs text-green-600 font-bold uppercase mb-1">Solar</div>
                                <div className="font-bold text-green-900">65%</div>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="text-xs text-blue-600 font-bold uppercase mb-1">Wind</div>
                                <div className="font-bold text-blue-900">35%</div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 italic text-center mt-2">
                            * Data updated live from Smart Meters
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
