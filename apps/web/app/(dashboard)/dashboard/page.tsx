'use client';

import { EnhancedStatsCards } from '@/components/dashboard/EnhancedStatsCards';
import { LeaderboardPanel } from '@/components/dashboard/LeaderboardPanel';
import { NotificationCenter } from '@/components/dashboard/NotificationCenter';
import { EnergyPredictionPanel } from '@/components/dashboard/EnergyPredictionPanel';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { LivePriceTicker } from '@/components/dashboard/LivePriceTicker';
import { CarbonOffsetCalculator } from '@/components/dashboard/CarbonOffsetCalculator';
import { EnergyCalculator } from '@/components/dashboard/EnergyCalculator';
import { QuickActionsPanel } from '@/components/dashboard/QuickActionsPanel';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { EnergyFlowVisualization } from '@/components/dashboard/EnergyFlowVisualization';
import { AdvancedAnalyticsDashboard } from '@/components/dashboard/AdvancedAnalyticsDashboard';
import { GamificationPanel } from '@/components/dashboard/GamificationPanel';
import { WeatherSolarPredictor } from '@/components/dashboard/WeatherSolarPredictor';
import { EnhancedMarketplace } from '@/components/dashboard/EnhancedMarketplace';
import { MyPortfolioPanel } from '@/components/dashboard/MyPortfolioPanel';
import { MarketPriceTrend } from '@/components/dashboard/MarketPriceTrend';
import { NeighborhoodMap } from '@/components/dashboard/NeighborhoodMap';
import { ChainlinkOracleDashboard } from '@/components/dashboard/ChainlinkOracleDashboard';
import { Sparkles, Zap, TrendingUp, Award, Package, Map, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tabParam = searchParams.get('tab');

    const [activeView, setActiveView] = useState<'overview' | 'analytics' | 'marketplace' | 'portfolio' | 'neighborhood' | 'oracle'>(
        (tabParam as 'overview' | 'analytics' | 'marketplace' | 'portfolio' | 'neighborhood' | 'oracle') || 'overview'
    );

    // Sync activeView with URL parameter
    useEffect(() => {
        if (tabParam && ['overview', 'analytics', 'marketplace', 'portfolio', 'neighborhood', 'oracle'].includes(tabParam)) {
            setActiveView(tabParam as 'overview' | 'analytics' | 'marketplace' | 'portfolio' | 'neighborhood' | 'oracle');
        }
    }, [tabParam]);

    const handleTabChange = (tab: 'overview' | 'analytics' | 'marketplace' | 'portfolio' | 'neighborhood' | 'oracle') => {
        setActiveView(tab);
        router.push(`/dashboard?tab=${tab}`, { scroll: false });
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
            {/* Enhanced Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-5xl font-black tracking-tight bg-gradient-to-r from-orange-600 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
                        Dashboard
                    </h2>
                    <p className="text-muted-foreground mt-2 flex items-center gap-2 text-lg">
                        <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
                        Welcome to your solar energy command center ⚡
                    </p>
                </div>

                {/* View Tabs */}
                <div className="flex gap-2 p-1 bg-white rounded-xl shadow-lg border-2 border-gray-200">
                    <button
                        onClick={() => handleTabChange('overview')}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${activeView === 'overview'
                            ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        📊 Overview
                    </button>
                    <button
                        onClick={() => handleTabChange('analytics')}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${activeView === 'analytics'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        📈 Analytics
                    </button>
                    <button
                        onClick={() => handleTabChange('marketplace')}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${activeView === 'marketplace'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        🛒 Marketplace
                    </button>
                    <button
                        onClick={() => handleTabChange('portfolio')}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${activeView === 'portfolio'
                            ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        📦 Portfolio
                    </button>
                    <button
                        onClick={() => handleTabChange('neighborhood')}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${activeView === 'neighborhood'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        🏘️ Map
                    </button>
                    <button
                        onClick={() => handleTabChange('oracle')}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${activeView === 'oracle'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        🔗 Oracle
                    </button>
                </div>

                <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
                    <Zap className="h-5 w-5 text-green-600 animate-pulse" />
                    <span className="text-sm font-bold text-green-900">Live</span>
                </div>
            </div>

            {/* Overview View */}
            {activeView === 'overview' && (
                <>
                    {/* Enhanced Stats Cards */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="h-6 w-6 text-orange-600" />
                            Your Performance
                        </h3>
                        <EnhancedStatsCards />
                    </div>

                    {/* Energy Flow Visualization */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <EnergyFlowVisualization />
                        <WeatherSolarPredictor />
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <LivePriceTicker />
                        <QuickActionsPanel />
                        <CarbonOffsetCalculator />
                        <EnergyCalculator />
                    </div>

                    {/* AI Predictions & Gamification */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <EnergyPredictionPanel />
                        <GamificationPanel />
                    </div>

                    {/* Leaderboard & Notifications */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <LeaderboardPanel />
                        <NotificationCenter />
                    </div>

                    {/* Activity Feed & Tips */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <RecentActivityFeed />
                        </div>
                        <div className="space-y-4">
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 border-2 border-yellow-200 hover:shadow-xl transition-shadow group">
                                <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                                    💡 Pro Tip
                                    <Sparkles className="h-5 w-5 text-yellow-600 group-hover:rotate-12 transition-transform" />
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    List your excess solar energy during <strong>peak hours (12 PM - 4 PM)</strong> to earn up to <strong className="text-orange-600">30% more</strong>! 🚀
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 hover:shadow-xl transition-shadow group">
                                <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                                    🌍 Impact
                                    <Award className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    You've helped offset <strong className="text-green-600">125kg of CO₂</strong> this month. That's equivalent to planting <strong>6 trees</strong>! 🌱
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-fuchsia-50 border-2 border-purple-200 hover:shadow-xl transition-shadow">
                                <MarketOverview />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Analytics View */}
            {activeView === 'analytics' && (
                <div className="space-y-6">
                    <AdvancedAnalyticsDashboard />

                    <div className="grid gap-6 md:grid-cols-2">
                        <EnergyPredictionPanel />
                        <div className="space-y-6">
                            <EnhancedStatsCards />
                            <MarketPriceTrend />
                        </div>
                    </div>
                </div>
            )}

            {/* Marketplace View */}
            {activeView === 'marketplace' && (
                <div className="space-y-6">
                    <EnhancedMarketplace />
                    <div className="grid gap-6 md:grid-cols-3">
                        <LivePriceTicker />
                        <QuickActionsPanel />
                        <CarbonOffsetCalculator />
                    </div>
                </div>
            )}

            {/* Portfolio View */}
            {activeView === 'portfolio' && (
                <div className="space-y-6">
                    <MyPortfolioPanel />
                </div>
            )}

            {/* Neighborhood View */}
            {activeView === 'neighborhood' && (
                <div className="space-y-6">
                    <NeighborhoodMap />
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="p-6 rounded-2xl bg-white shadow-lg border border-gray-100">
                            <h3 className="font-bold text-xl mb-4 text-gray-900 border-b pb-2">Community Goals</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1 font-semibold">
                                        <span>Neighborhood Renewables</span>
                                        <span className="text-green-600">72%</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[72%] rounded-full animate-in fade-in slide-in-from-left duration-1000"></div>
                                    </div>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                                    <div className="font-bold text-orange-800 mb-1">🔥 Summer Challenge</div>
                                    <p className="text-sm text-orange-600">Generate 500 kWh locally to unlock the "Solar Champion" badge for the entire block!</p>
                                </div>
                            </div>
                        </div>
                        <WeatherSolarPredictor />
                    </div>
                </div>
            )}

            {/* Oracle View - Chainlink Integration */}
            {activeView === 'oracle' && (
                <div className="space-y-6">
                    <ChainlinkOracleDashboard />
                </div>
            )}
        </div>
    );
}
