import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { Providers } from './providers';
import { DisclaimerModal } from '@/components/DisclaimerModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'SunGrid Protocol - Blockchain Energy Marketplace',
    description: 'Blockchain-based renewable energy credit marketplace prototype',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <DisclaimerModal />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
