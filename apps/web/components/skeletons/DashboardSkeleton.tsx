import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

export function DashboardSkeleton() {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen animate-in fade-in duration-500">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-10 w-48 bg-gray-200/50 rounded-lg animate-pulse" />
                    <div className="h-4 w-64 bg-gray-200/50 rounded-lg animate-pulse" />
                </div>

                {/* Tabs Skeleton */}
                <div className="flex gap-2 p-1 bg-white/50 rounded-xl shadow-sm border border-gray-100">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-10 w-24 bg-gray-200/50 rounded-lg animate-pulse" />
                    ))}
                </div>

                <div className="h-10 w-24 bg-green-50 rounded-full border border-green-100 animate-pulse flex items-center justify-center">
                    <Zap className="h-4 w-4 text-green-200/50" />
                </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Areas */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1 h-[400px] border-0 shadow-sm bg-white/80">
                    <CardHeader>
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                        <div className="h-64 w-64 rounded-full border-4 border-gray-100 animate-pulse" />
                    </CardContent>
                </Card>
                <Card className="col-span-1 h-[400px] border-0 shadow-sm bg-white/80">
                    <CardHeader>
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 w-full bg-gray-100 rounded-lg animate-pulse" />
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 rounded-2xl bg-white/60 border border-gray-100 animate-pulse" />
                ))}
            </div>
        </div>
    );
}
