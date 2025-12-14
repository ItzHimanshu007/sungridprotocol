'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Sun,
    Zap,
    Shield,
    TrendingUp,
    ArrowRight,
    Leaf,
    Globe,
    Award,
    Users,
    BarChart3,
    Sparkles,
    Battery,
    CloudSun,
    Trophy,
    Target
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function LandingPage() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(251, 191, 36, 0.15) 1px, transparent 0)',
                        backgroundSize: '50px 50px',
                        transform: `translateY(${scrollY * 0.3}px)`
                    }}
                />
            </div>

            {/* Floating Elements */}
            <FloatingElements />

            {/* Hero Section */}
            <section className="relative container mx-auto px-4 py-32 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                    <div className="absolute top-40 right-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                    <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
                </div>

                <div className="text-center max-w-5xl mx-auto relative">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full px-6 py-3 mb-8 border border-yellow-200 shadow-lg transform hover:scale-105 transition-transform">
                        <Sun className="h-5 w-5 text-yellow-600 animate-spin-slow" />
                        <span className="text-yellow-900 font-semibold text-sm">
                            🚀 Decentralized Energy Credit Trading
                        </span>
                        <Sparkles className="h-4 w-4 text-yellow-600" />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
                        SunGrid Protocol
                    </h1>

                    <div className="flex justify-center mb-6">
                        <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-base font-bold animate-pulse border border-orange-200 shadow-sm">
                            📚 Educational Prototype
                        </span>
                    </div>

                    <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Blockchain-Based Renewable Energy Credit Marketplace.
                        <br />
                        A prototype exploring peer-to-peer energy credit trading.
                    </p>

                    <div className="mx-auto mb-10 max-w-[600px] bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-sm text-yellow-800 shadow-sm">
                        <p className="flex items-center justify-center gap-2">
                            <Shield className="h-4 w-4" />
                            <strong>Note:</strong> This is a simulation using Solar Energy Credits (SEC). No physical energy transfer occurs.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link href="/dashboard">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-8 py-6 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all group"
                            >
                                🚀 Launch Demo
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="https://github.com/himanshucodes101/sungrid-protocol" target="_blank">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-gray-800 text-gray-800 hover:bg-gray-900 hover:text-white font-bold px-8 py-6 text-lg shadow-lg transform hover:scale-105 transition-all"
                            >
                                View Code
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-600" />
                            <span>Blockchain Secured</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            <span>Sepolia Testnet</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-purple-600" />
                            <span>Open Source</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-white py-24">
                <div className="container mx-auto px-4 grid gap-12 md:grid-cols-3">
                    <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-gray-50 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="p-4 bg-green-100 rounded-full mb-2">
                            <Leaf className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold">Transparent Price Discovery</h3>
                        <p className="text-gray-500">
                            Market-driven pricing for renewable energy credits directly between producers and consumers.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-gray-50 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="p-4 bg-blue-100 rounded-full mb-2">
                            <Shield className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold">Trustless Settlement</h3>
                        <p className="text-gray-500">
                            Smart contracts act as trustless escrow, ensuring secure release of funds only upon verification.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-gray-50 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="p-4 bg-orange-100 rounded-full mb-2">
                            <Zap className="h-8 w-8 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-bold">P2P Market Concept</h3>
                        <p className="text-gray-500">
                            Demonstrating the feasibility of decentralized energy markets using blockchain technology.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-gradient-to-b from-white to-amber-50 py-24">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
                    <p className="text-center text-gray-600 mb-16 text-lg">Simulation workflow</p>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Connection Lines (Desktop only) */}
                        <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 via-orange-300 to-amber-300 -z-10" />

                        <EnhancedStepCard
                            step="1"
                            icon={<Battery className="h-8 w-8" />}
                            title="Connect Meter"
                            description="Simulate linking a smart solar meter to the SunGrid network"
                            color="yellow"
                        />
                        <EnhancedStepCard
                            step="2"
                            icon={<CloudSun className="h-8 w-8" />}
                            title="Generate Credits"
                            description="Solar production is tokenized into Energy Credits (SEC)"
                            color="orange"
                        />
                        <EnhancedStepCard
                            step="3"
                            icon={<Sparkles className="h-8 w-8" />}
                            title="List for Sale"
                            description="Create a sell order on the transparent marketplace"
                            color="amber"
                        />
                        <EnhancedStepCard
                            step="4"
                            icon={<Target className="h-8 w-8" />}
                            title="Trade & Settle"
                            description="Buyers purchase credits, smart contract handles settlement"
                            color="yellow"
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm">
                        © 2024 SunGrid Protocol. Educational Prototype. Not for commercial use. 🌍
                    </p>
                </div>
            </footer>
        </div>
    );
}

function FloatingElements() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-float-slow opacity-60" />
            <div className="absolute top-1/3 right-20 w-3 h-3 bg-orange-400 rounded-full animate-float-medium opacity-60" />
            <div className="absolute top-2/3 left-1/4 w-5 h-5 bg-amber-400 rounded-full animate-float-fast opacity-60" />
            <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-yellow-500 rounded-full animate-float-slow opacity-60" />
        </div>
    );
}

function AnimatedStatCard({ value, label, icon, color }: {
    value: string;
    label: string;
    icon: React.ReactNode;
    color: string;
}) {
    const colorClasses = {
        yellow: 'text-yellow-400',
        blue: 'text-blue-400',
        green: 'text-green-400',
        emerald: 'text-emerald-400'
    };

    return (
        <div className="group hover:scale-105 transition-transform">
            <div className={`${colorClasses[color as keyof typeof colorClasses]} mb-4 flex justify-center transform group-hover:rotate-12 transition-transform`}>
                {icon}
            </div>
            <div className="text-5xl font-black mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {value}
            </div>
            <div className="text-gray-400 uppercase tracking-wider text-sm font-semibold">{label}</div>
        </div>
    );
}

function SuperFeatureCard({ icon, title, description, gradient }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
}) {
    return (
        <div className="group relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <div className={`mb-6 inline-block p-4 rounded-xl bg-gradient-to-br ${gradient} text-white transform group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
}

function EnhancedStepCard({ step, icon, title, description, color }: {
    step: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}) {
    const colorClasses = {
        yellow: 'from-yellow-400 to-yellow-600 ring-yellow-300',
        orange: 'from-orange-400 to-orange-600 ring-orange-300',
        amber: 'from-amber-400 to-amber-600 ring-amber-300'
    };

    const bgClass = colorClasses[color as keyof typeof colorClasses];

    return (
        <div className="text-center group">
            <div className={`w-24 h-24 bg-gradient-to-br ${bgClass} text-white rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-lg ring-4 ring-offset-4 group-hover:scale-110 transition-transform relative`}>
                <span className="absolute">{step}</span>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {icon}
                </div>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
}
