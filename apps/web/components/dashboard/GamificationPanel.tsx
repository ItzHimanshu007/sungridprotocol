'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Award, Sparkles, Zap, Target, Crown, Medal } from 'lucide-react';

interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    unlocked: boolean;
    progress: number;
    maxProgress: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    reward: string;
}

export function GamificationPanel() {
    const [selectedTab, setSelectedTab] = useState<'achievements' | 'badges'>('achievements');

    const achievements: Achievement[] = [
        {
            id: '1',
            name: 'Solar Pioneer',
            description: 'Generate 1,000 kWh of solar energy',
            icon: <Sun className="h-6 w-6" />,
            unlocked: true,
            progress: 1000,
            maxProgress: 1000,
            rarity: 'common',
            reward: '50 SUN tokens'
        },
        {
            id: '2',
            name: 'Energy Mogul',
            description: 'Earn ₹10,000 from energy sales',
            icon: <TrendingUp className="h-6 w-6" />,
            unlocked: true,
            progress: 12500,
            maxProgress: 10000,
            rarity: 'rare',
            reward: '200 SUN tokens'
        },
        {
            id: '3',
            name: 'Community Hero',
            description: 'Supply energy to 50 neighbors',
            icon: <Users className="h-6 w-6" />,
            unlocked: false,
            progress: 37,
            maxProgress: 50,
            rarity: 'epic',
            reward: '500 SUN tokens'
        },
        {
            id: '4',
            name: 'Green Guardian',
            description: 'Offset 1 ton of CO₂',
            icon: <Leaf className="h-6 w-6" />,
            unlocked: false,
            progress: 680,
            maxProgress: 1000,
            rarity: 'epic',
            reward: '750 SUN tokens'
        },
        {
            id: '5',
            name: 'Legend of the Grid',
            description: 'Be in top 10 traders for 30 days',
            icon: <Crown className="h-6 w-6" />,
            unlocked: false,
            progress: 15,
            maxProgress: 30,
            rarity: 'legendary',
            reward: '2000 SUN tokens + NFT Badge'
        },
    ];

    const userLevel = 12;
    const currentXP = 2450;
    const nextLevelXP = 3000;
    const xpProgress = (currentXP / nextLevelXP) * 100;

    return (
        <Card className="shadow-xl border-2 border-amber-100 bg-gradient-to-br from-amber-50 via-white to-yellow-50">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-amber-600" />
                        <span className="text-2xl">Achievements</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg">
                        <Crown className="h-5 w-5" />
                        <span className="font-bold">Level {userLevel}</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* XP Progress Bar */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Experience</span>
                        <span className="text-sm font-bold text-purple-600">
                            {currentXP} / {nextLevelXP} XP
                        </span>
                    </div>
                    <div className="w-full h-4 bg-white rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 relative overflow-hidden"
                            style={{ width: `${xpProgress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/30 animate-pulse" />
                        </div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1 text-center">
                        {nextLevelXP - currentXP} XP to level {userLevel + 1}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200">
                    <button
                        onClick={() => setSelectedTab('achievements')}
                        className={`flex items-center gap-2 px-4 py-2 font-semibold transition-all ${selectedTab === 'achievements'
                                ? 'border-b-2 border-amber-500 text-amber-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Award className="h-4 w-4" />
                        Achievements
                    </button>
                    <button
                        onClick={() => setSelectedTab('badges')}
                        className={`flex items-center gap-2 px-4 py-2 font-semibold transition-all ${selectedTab === 'badges'
                                ? 'border-b-2 border-amber-500 text-amber-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Medal className="h-4 w-4" />
                        Badges
                    </button>
                </div>

                {/* Achievements List */}
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {achievements.map((achievement) => (
                        <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <StatBadge
                        icon={<Trophy className="h-5 w-5 text-yellow-600" />}
                        label="Unlocked"
                        value={`${achievements.filter(a => a.unlocked).length}/${achievements.length}`}
                    />
                    <StatBadge
                        icon={<Star className="h-5 w-5 text-purple-600" />}
                        label="Total XP"
                        value="24.5k"
                    />
                    <StatBadge
                        icon={<Sparkles className="h-5 w-5 text-pink-600" />}
                        label="Rank"
                        value="#42"
                    />
                </div>
            </CardContent>
        </Card>
    );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
    const rarityColors = {
        common: 'from-gray-400 to-gray-600',
        rare: 'from-blue-400 to-blue-600',
        epic: 'from-purple-400 to-purple-600',
        legendary: 'from-yellow-400 to-orange-600'
    };

    const rarityBorders = {
        common: 'border-gray-300',
        rare: 'border-blue-300',
        epic: 'border-purple-300',
        legendary: 'border-yellow-300'
    };

    const progress = Math.min((achievement.progress / achievement.maxProgress) * 100, 100);

    return (
        <div
            className={`p-4 rounded-xl border-2 ${rarityBorders[achievement.rarity]} bg-white shadow-md hover:shadow-lg transition-all ${achievement.unlocked ? 'opacity-100' : 'opacity-75'
                } group hover:scale-[1.02]`}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`p-3 rounded-xl bg-gradient-to-br ${rarityColors[achievement.rarity]} text-white relative`}>
                    {achievement.icon}
                    {achievement.unlocked && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                            <Check className="h-3 w-3 text-white" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                        <div>
                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                {achievement.name}
                                <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white uppercase tracking-wide`}>
                                    {achievement.rarity}
                                </span>
                            </h4>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {!achievement.unlocked && (
                        <>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                                <div
                                    className={`h-full bg-gradient-to-r ${rarityColors[achievement.rarity]} transition-all duration-500`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {achievement.progress} / {achievement.maxProgress}
                            </div>
                        </>
                    )}

                    {/* Reward */}
                    <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-amber-600">
                        <Sparkles className="h-3 w-3" />
                        {achievement.reward}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBadge({ icon, label, value }: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex flex-col items-center p-3 rounded-lg bg-white shadow hover:shadow-md transition-shadow">
            <div className="mb-1">{icon}</div>
            <div className="text-xs text-gray-600">{label}</div>
            <div className="text-lg font-bold text-gray-900">{value}</div>
        </div>
    );
}

// Additional Icon Components
function Sun({ className }: { className?: string }) {
    return <Zap className={className} />;
}

function TrendingUp({ className }: { className?: string }) {
    return <Target className={className} />;
}

function Users({ className }: { className?: string }) {
    return <Award className={className} />;
}

function Leaf({ className }: { className?: string }) {
    return <Sparkles className={className} />;
}

function Check({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );
}
