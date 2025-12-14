'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { Trophy, TrendingUp, Zap, Award } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
    rank: number;
    address: string;
    name: string;
    energySold: number;
    earnings: number;
    efficiency: number;
    badge: 'gold' | 'silver' | 'bronze' | null;
}

export function LeaderboardPanel() {
    const { toast } = useToast();
    const leaders: LeaderboardEntry[] = [
        {
            rank: 1,
            address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
            name: 'SolarMax Pro',
            energySold: 15420,
            earnings: 98250,
            efficiency: 98,
            badge: 'gold'
        },
        {
            rank: 2,
            address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
            name: 'GreenEnergy Hub',
            energySold: 12850,
            earnings: 82100,
            efficiency: 95,
            badge: 'silver'
        },
        {
            rank: 3,
            address: '0x1234567890abcdef1234567890abcdef12345678',
            name: 'EcoWarrior',
            energySold: 10200,
            earnings: 65300,
            efficiency: 92,
            badge: 'bronze'
        },
        {
            rank: 4,
            address: '0xabcdef1234567890abcdef1234567890abcdef12',
            name: 'SunPower Elite',
            energySold: 9500,
            earnings: 60800,
            efficiency: 90,
            badge: null
        },
        {
            rank: 5,
            address: '0x9876543210fedcba9876543210fedcba98765432',
            name: 'CleanGrid Master',
            energySold: 8700,
            earnings: 55600,
            efficiency: 88,
            badge: null
        },
    ];

    const getBadgeColor = (badge: string | null) => {
        switch (badge) {
            case 'gold':
                return 'from-yellow-400 to-amber-500';
            case 'silver':
                return 'from-gray-300 to-gray-400';
            case 'bronze':
                return 'from-orange-400 to-amber-600';
            default:
                return 'from-gray-200 to-gray-300';
        }
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return { icon: Trophy, color: 'text-yellow-500' };
        if (rank === 2) return { icon: Award, color: 'text-gray-400' };
        if (rank === 3) return { icon: Award, color: 'text-orange-500' };
        return { icon: TrendingUp, color: 'text-blue-500' };
    };

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-amber-500" />
                            Top Producers Leaderboard
                        </CardTitle>
                        <CardDescription>
                            Leading energy producers in your network
                        </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        This Month
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {leaders.map((leader, index) => {
                        const { icon: RankIcon, color: rankColor } = getRankIcon(leader.rank);

                        return (
                            <div
                                key={leader.address}
                                onClick={() => toast({
                                    title: `Viewing ${leader.name}`,
                                    description: "Profile Details: 100% Reputation Score. (Demo)",
                                })}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer group",
                                    leader.rank <= 3 ? 'bg-gradient-to-r opacity-90' : 'bg-gray-50 hover:bg-gray-100',
                                    leader.rank === 1 && 'from-yellow-50 to-amber-50 border-2 border-yellow-200',
                                    leader.rank === 2 && 'from-gray-50 to-slate-50 border-2 border-gray-200',
                                    leader.rank === 3 && 'from-orange-50 to-amber-50 border-2 border-orange-200',
                                )}
                            >
                                {/* Rank Badge */}
                                <div className="relative">
                                    <div className={cn(
                                        "h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg",
                                        `bg-gradient-to-br ${getBadgeColor(leader.badge)}`,
                                        leader.badge ? 'text-white shadow-lg' : 'text-gray-600'
                                    )}>
                                        {leader.rank <= 3 ? (
                                            <RankIcon className="h-6 w-6" />
                                        ) : (
                                            leader.rank
                                        )}
                                    </div>
                                    {leader.rank === 1 && (
                                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full animate-pulse" />
                                    )}
                                </div>

                                {/* User Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                                            {leader.name}
                                        </h4>
                                        {leader.badge && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs capitalize"
                                            >
                                                {leader.badge}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono truncate">
                                        {leader.address.slice(0, 8)}...{leader.address.slice(-6)}
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-xs text-muted-foreground">Energy</div>
                                        <div className="text-sm font-bold">
                                            {(leader.energySold / 1000).toFixed(1)}k
                                        </div>
                                        <div className="text-xs text-muted-foreground">kWh</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Earnings</div>
                                        <div className="text-sm font-bold text-emerald-600">
                                            ₹{(leader.earnings / 1000).toFixed(1)}k
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Efficiency</div>
                                        <div className={cn(
                                            "text-sm font-bold",
                                            leader.efficiency >= 95 ? 'text-emerald-600' :
                                                leader.efficiency >= 90 ? 'text-blue-600' :
                                                    'text-orange-600'
                                        )}>
                                            {leader.efficiency}%
                                        </div>
                                    </div>
                                </div>

                                {/* Animated Progress Bar */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full bg-gradient-to-r transition-all duration-1000",
                                            `${getBadgeColor(leader.badge)}`
                                        )}
                                        style={{
                                            width: `${leader.efficiency}%`,
                                            transitionDelay: `${index * 100}ms`
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Your Rank */}
                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                #12
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Your Rank</p>
                                <p className="text-xs text-muted-foreground">Keep pushing to break into top 10!</p>
                            </div>
                        </div>
                        <Badge className="bg-blue-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Active
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
