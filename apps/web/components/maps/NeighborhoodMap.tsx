'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Dynamically import map components to avoid SSR issues
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
const Circle = dynamic(
    () => import('react-leaflet').then((mod) => mod.Circle),
    { ssr: false }
);

interface ZoneData {
    gridZone: number;
    name: string;
    neighborhood: string;
    city: string;
    centerLat: number;
    centerLng: number;
    listingCount: number;
    totalEnergy: string;
    avgPriceINR: string;
}

// Jaipur, India coordinates (default center - LNMIIT area)
const JAIPUR_CENTER: [number, number] = [26.9365, 75.9231];

// Demo zones for Jaipur neighborhoods
const DEMO_ZONES: ZoneData[] = [
    {
        gridZone: 1,
        name: 'LNMIIT Campus',
        neighborhood: 'Rupa ki Nangal',
        city: 'Jaipur',
        centerLat: 26.9365,
        centerLng: 75.9231,
        listingCount: 0,
        totalEnergy: '0',
        avgPriceINR: '0',
    },
    {
        gridZone: 2,
        name: 'Malviya Nagar',
        neighborhood: 'Malviya Nagar',
        city: 'Jaipur',
        centerLat: 26.8523,
        centerLng: 75.8264,
        listingCount: 0,
        totalEnergy: '0',
        avgPriceINR: '0',
    },
    {
        gridZone: 3,
        name: 'Vaishali Nagar',
        neighborhood: 'Vaishali Nagar',
        city: 'Jaipur',
        centerLat: 26.9158,
        centerLng: 75.7334,
        listingCount: 0,
        totalEnergy: '0',
        avgPriceINR: '0',
    },
];

export function NeighborhoodMap() {
    const [zones, setZones] = useState<ZoneData[]>(DEMO_ZONES);
    const [isLoading, setIsLoading] = useState(true);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        // Wait for client-side rendering
        setMapReady(true);
        fetchZoneData();
    }, []);

    const fetchZoneData = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/listings/map/zones');
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    setZones(data);
                }
            }
        } catch (error) {
            console.log('Using demo zone data');
            // Keep demo zones
        } finally {
            setIsLoading(false);
        }
    };

    if (!mapReady) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Energy Listings Map</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-yellow-500" />
                    Neighborhood Energy Map - Jaipur
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Discover solar energy available in your neighborhood • INR Pricing
                </p>
            </CardHeader>
            <CardContent>
                <div className="h-[500px] rounded-lg overflow-hidden border-2 border-yellow-200">
                    <MapContainer
                        center={JAIPUR_CENTER}
                        zoom={12}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {zones.map((zone) => (
                            <div key={zone.gridZone}>
                                <Circle
                                    center={[zone.centerLat, zone.centerLng]}
                                    radius={zone.listingCount > 0 ? 3000 : 1500}
                                    pathOptions={{
                                        color: zone.listingCount > 0 ? '#fbbf24' : '#93c5fd',
                                        fillColor: zone.listingCount > 0 ? '#fbbf24' : '#bfdbfe',
                                        fillOpacity: 0.4,
                                        weight: 2,
                                    }}
                                />
                                <Marker position={[zone.centerLat, zone.centerLng]}>
                                    <Popup>
                                        <div className="p-3 min-w-[200px]">
                                            <h3 className="font-bold text-lg text-yellow-600">
                                                {zone.neighborhood}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">{zone.city}, Rajasthan</p>
                                            <div className="mt-3 space-y-2 border-t pt-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-medium">Zone ID:</span>
                                                    <span className="text-xs">{zone.gridZone}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-medium">Active Listings:</span>
                                                    <span className="text-xs font-bold">{zone.listingCount}</span>
                                                </div>
                                                {zone.listingCount > 0 ? (
                                                    <>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs font-medium">Available Energy:</span>
                                                            <span className="text-xs">{parseFloat(zone.totalEnergy).toFixed(2)} kWh</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs font-medium">Avg. Price:</span>
                                                            <span className="text-xs font-bold text-green-600">₹{zone.avgPriceINR}/kWh</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-xs text-gray-500 italic mt-2">
                                                        No active listings • Be the first to list energy here!
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            </div>
                        ))}
                    </MapContainer>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-300 border-2 border-blue-400"></div>
                        <span>Available Zones</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-yellow-300 border-2 border-yellow-400"></div>
                        <span>Active Listings</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
