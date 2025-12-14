'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, Zap, DollarSign, Users, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface StatCard {
    title: string;
    value: string;
    change: number;
    trend: 'up' | 'down';
    icon: any;
    color: string;
    bgGradient: string;
    description: string;
}

export function EnhancedStatsCards() {
    const [isVisible, setIsVisible] = useState(false);
    const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0, 0, 0]);

    const stats: StatCard[] = [
        {
            title: 'Energy Sold',
            value: '2,847 kWh',
            change: 12.5,
            trend: 'up',
            icon: Zap,
            color: 'text-amber-600',
            bgGradient: 'from-amber-50 to-orange-50',
            description: 'This month'
        },
        {
            title: 'Total Earnings',
            value: '₹18,432',
            change: 8.2,
            trend: 'up',
            icon: DollarSign,
            color: 'text-emerald-600',
            bgGradient: 'from-emerald-50 to-teal-50',
            description: 'All time'
        },
        {
            title: 'Active Buyers',
            value: '156',
            change: -3.1,
            trend: 'down',
            icon: Users,
            color: 'text-blue-600',
            bgGradient: 'from-blue-50 to-indigo-50',
            description: 'Last 30 days'
        },
        {
            title: 'Efficiency Score',
            value: '94%',
            change: 5.3,
            trend: 'up',
            icon: Award,
            color: 'text-purple-600',
            bgGradient: 'from-purple-50 to-pink-50',
            description: 'Performance rating'
        },
    ];

    useEffect(() => {
        setIsVisible(true);

        // Animate numbers counting up
        const targets = [2847, 18432, 156, 94];
        const duration = 1500;
        const steps = 60;
        const increment = duration / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            setAnimatedValues(targets.map(target =>
                Math.floor(target * Math.min(progress, 1))
            ));

            if (currentStep >= steps) {
                clearInterval(timer);
            }
        }, increment);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                const TrendIcon = stat.trend === 'up' ? ArrowUpIcon : ArrowDownIcon;

                return (
                    <Card
                        key={stat.title}
                        className={cn(
                            "relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer group",
                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                        style={{ transitionDelay: `${index * 100}ms` }}
                    >
                        {/* Gradient Background */}
                        <div className={cn(
                            "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                            stat.bgGradient
                        )} />

                        {/* Animated Border */}
                        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className={cn("absolute inset-0 rounded-lg", stat.bgGradient)}
                                style={{
                                    clipPath: 'polygon(0 0, 100% 0, 100% 2px, 0 2px, 0 100%, 2px 100%, 2px 2px, calc(100% - 2px) 2px, calc(100% - 2px) calc(100% - 2px), 2px calc(100% - 2px), 2px 100%, 100% 100%, 100% calc(100% - 2px), 0 calc(100% - 2px))'
                                }}
                            />
                        </div>

                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                                `bg-gradient-to-br ${stat.bgGradient}`
                            )}>
                                <Icon className={cn("h-5 w-5", stat.color)} />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-2xl font-bold tracking-tight">
                                {stat.value}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                                <div className={cn(
                                    "flex items-center text-xs font-medium rounded-full px-2 py-1",
                                    stat.trend === 'up'
                                        ? "text-emerald-700 bg-emerald-50"
                                        : "text-red-700 bg-red-50"
                                )}>
                                    <TrendIcon className="h-3 w-3 mr-1" />
                                    {Math.abs(stat.change)}%
                                </div>
                            </div>

                            {/* Mini Sparkline Effect */}
                            <div className="mt-3 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-1000 bg-gradient-to-r",
                                        stat.bgGradient
                                    )}
                                    style={{
                                        width: isVisible ? `${Math.abs(stat.change) * 10}%` : '0%',
                                        transitionDelay: `${index * 150}ms`
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
