'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Bell,
    Check,
    CheckCheck,
    Zap,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    Info,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
    id: string;
    type: 'success' | 'info' | 'warning' | 'transaction';
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: any;
    color: string;
}

export function NotificationCenter() {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'success',
            title: 'Energy Sold Successfully',
            message: 'You sold 25 kWh to 0x742d...bEb for ₹450',
            time: '2 min ago',
            read: false,
            icon: Zap,
            color: 'text-emerald-600'
        },
        {
            id: '2',
            type: 'transaction',
            title: 'Payment Received',
            message: 'Transaction confirmed. ₹450 credited to your wallet',
            time: '5 min ago',
            read: false,
            icon: DollarSign,
            color: 'text-green-600'
        },
        {
            id: '3',
            type: 'info',
            title: 'Peak Hours Alert',
            message: 'Energy demand is high. Great time to list your energy!',
            time: '15 min ago',
            read: true,
            icon: TrendingUp,
            color: 'text-blue-600'
        },
        {
            id: '4',
            type: 'warning',
            title: 'Low Inventory',
            message: 'Only 10 kWh remaining in your available balance',
            time: '1 hour ago',
            read: true,
            icon: AlertTriangle,
            color: 'text-orange-600'
        },
        {
            id: '5',
            type: 'info',
            title: 'New Buyer in Network',
            message: 'A new buyer joined your grid zone',
            time: '2 hours ago',
            read: true,
            icon: Info,
            color: 'text-indigo-600'
        },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <div className="relative">
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold animate-pulse">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            Notifications
                        </CardTitle>
                        <CardDescription>
                            Stay updated with your energy activities
                        </CardDescription>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-xs"
                        >
                            <CheckCheck className="h-3 w-3 mr-1" />
                            Mark all read
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-2">
                        {notifications.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification, index) => {
                                const Icon = notification.icon;

                                return (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            "group relative p-4 rounded-lg border transition-all duration-300 hover:shadow-md cursor-pointer",
                                            !notification.read
                                                ? "bg-blue-50/50 border-blue-200 hover:bg-blue-100/50"
                                                : "bg-white hover:bg-gray-50",
                                            "animate-in slide-in-from-right"
                                        )}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        {/* Unread Indicator */}
                                        {!notification.read && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l-lg" />
                                        )}

                                        <div className="flex gap-3">
                                            {/* Icon */}
                                            <div className={cn(
                                                "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center",
                                                !notification.read ? "bg-blue-100" : "bg-gray-100"
                                            )}>
                                                <Icon className={cn("h-5 w-5", notification.color)} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className={cn(
                                                        "text-sm font-semibold",
                                                        !notification.read && "text-blue-900"
                                                    )}>
                                                        {notification.title}
                                                    </h4>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeNotification(notification.id);
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-xs text-muted-foreground">
                                                        {notification.time}
                                                    </span>
                                                    {!notification.read && (
                                                        <Badge variant="secondary" className="text-xs h-5">
                                                            New
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
