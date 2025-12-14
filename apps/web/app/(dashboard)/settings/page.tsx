'use client';

import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAccount } from 'wagmi';
import { Moon, Sun, Laptop, Wallet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const { address, isConnected } = useAccount();
    const { toast } = useToast();

    const handleSaveProfile = () => {
        toast({
            title: "Profile Updated",
            description: "Your profile information has been saved.",
        });
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>
                            Manage your public profile information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>SG</AvatarFallback>
                            </Avatar>
                            <Button variant="outline">Change Avatar</Button>
                        </div>
                        <Separator />
                        <div className="grid gap-2">
                            <Label htmlFor="name">Display Name</Label>
                            <Input id="name" placeholder="John Doe" defaultValue="Himanshu Jasoriya" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="john@example.com" defaultValue="himanshu@sungrid.com" />
                        </div>
                        <Button onClick={handleSaveProfile}>Save Changes</Button>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>
                                Customize the interface theme.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-2">
                                <Button
                                    variant={theme === 'light' ? 'default' : 'outline'}
                                    className="w-full"
                                    onClick={() => setTheme('light')}
                                >
                                    <Sun className="h-4 w-4 mr-2" />
                                    Light
                                </Button>
                                <Button
                                    variant={theme === 'dark' ? 'default' : 'outline'}
                                    className="w-full"
                                    onClick={() => setTheme('dark')}
                                >
                                    <Moon className="h-4 w-4 mr-2" />
                                    Dark
                                </Button>
                                <Button
                                    variant={theme === 'system' ? 'default' : 'outline'}
                                    className="w-full"
                                    onClick={() => setTheme('system')}
                                >
                                    <Laptop className="h-4 w-4 mr-2" />
                                    System
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Wallet</CardTitle>
                            <CardDescription>
                                Connected wallet information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                                <Wallet className="h-4 w-4 text-slate-500" />
                                <span className="text-sm font-mono truncate">
                                    {isConnected ? address : 'Not Connected'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="auto-sign">Auto-sign transactions</Label>
                                <Switch id="auto-sign" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="col-span-2 md:col-span-3">
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>
                            Configure how you receive alerts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Energy Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive alerts when battery is low or production drops.
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Marketplace Updates</Label>
                                <p className="text-sm text-muted-foreground">
                                    Get notified when your listings are sold.
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Marketing Emails</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive news and updates about SunGrid Protocol.
                                </p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
