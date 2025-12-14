'use client';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, Check, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

const mockNotifications = [
    {
        id: '1',
        title: 'Energy Sold',
        description: 'You sold 12kWh to Neighbor #4291',
        time: '2 mins ago',
        read: false,
    },
    {
        id: '2',
        title: 'Battery Full',
        description: 'Your storage system reached 100% capacity',
        time: '1 hour ago',
        read: false,
    },
    {
        id: '3',
        title: 'Listing Expired',
        description: 'Your listing for 50kWh has expired',
        time: '5 hours ago',
        read: true,
    },
    {
        id: '4',
        title: 'System Update',
        description: 'Smart Meter firmware updated successfully',
        time: '1 day ago',
        read: true,
    },
];

export function NotificationPopover() {
    const [notifications, setNotifications] = useState(mockNotifications);
    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-background" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold leading-none">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-auto py-1 text-muted-foreground hover:text-foreground"
                            onClick={markAllRead}
                        >
                            Mark all read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    <div className="flex flex-col">
                        {notifications.map((notification) => (
                            <button
                                key={notification.id}
                                className={`flex flex-col items-start gap-1 p-4 text-left transition-colors hover:bg-muted/50 border-b last:border-0 ${!notification.read ? 'bg-muted/20' : ''
                                    }`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="flex w-full items-start justify-between">
                                    <span className="font-medium text-sm">
                                        {notification.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                        {notification.time}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {notification.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
