'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clock, ArrowUpCircle, ArrowDownCircle, CheckCircle, Zap } from 'lucide-react';
import { formatINR } from '@/lib/currency';

interface Activity {
    id: string;
    type: 'buy' | 'sell' | 'mint';
    amount: number;
    price: number;
    time: string;
    status: 'pending' | 'completed';
}

const DEMO_ACTIVITIES: Activity[] = [
    {
        id: '1',
        type: 'sell',
        amount: 50,
        price: 14250,
        time: '2 hours ago',
        status: 'completed',
    },
    {
        id: '2',
        type: 'buy',
        amount: 30,
        price: 8550,
        time: '5 hours ago',
        status: 'completed',
    },
    {
        id: '3',
        type: 'mint',
        amount: 100,
        price: 0,
        time: '1 day ago',
        status: 'completed',
    },
];

export function RecentActivityFeed() {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {DEMO_ACTIVITIES.map((activity) => (
                    <div
                        key={activity.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${activity.type === 'sell'
                                ? 'bg-green-100'
                                : activity.type === 'buy'
                                    ? 'bg-blue-100'
                                    : 'bg-yellow-100'
                                }`}>
                                {activity.type === 'sell' ? (
                                    <ArrowUpCircle className="h-4 w-4 text-green-600" />
                                ) : activity.type === 'buy' ? (
                                    <ArrowDownCircle className="h-4 w-4 text-blue-600" />
                                ) : (
                                    <Zap className="h-4 w-4 text-yellow-600" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium">
                                    {activity.type === 'sell' ? 'Sold' : activity.type === 'buy' ? 'Bought' : 'Minted'}{' '}
                                    {activity.amount} kWh
                                </p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            {activity.price > 0 && (
                                <p className="text-sm font-bold text-green-600">
                                    {formatINR(activity.price)}
                                </p>
                            )}
                            {activity.status === 'completed' && (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                    <CheckCircle className="h-3 w-3" />
                                    <span>Complete</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <Link href="/dashboard?tab=portfolio" className="w-full">
                    <Button variant="outline" className="w-full text-xs">
                        View All Transactions
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
