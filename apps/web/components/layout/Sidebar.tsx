'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Settings,
    Sun,
} from 'lucide-react';

const routes = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
        color: "text-sky-500",
        description: "Overview, Analytics & Marketplace"
    },
    {
        label: 'Settings',
        icon: Settings,
        href: '/settings',
        color: "text-gray-400",
        description: "Account & Preferences"
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14 group">
                    <div className="relative w-8 h-8 mr-4">
                        <Sun className="h-8 w-8 text-yellow-500 group-hover:rotate-180 transition-transform duration-700" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        SunGrid
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname.startsWith(route.href) ? "text-white bg-white/10" : "text-zinc-400",
                            )}
                        >
                            <div className="flex flex-col flex-1">
                                <div className="flex items-center">
                                    <route.icon className={cn("h-5 w-5 mr-3 group-hover:scale-110 transition-transform", route.color)} />
                                    {route.label}
                                </div>
                                <span className="text-xs text-zinc-500 ml-8 mt-1">{route.description}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}


