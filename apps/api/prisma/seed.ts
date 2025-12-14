import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Seed Grid Zones for Indian cities
    const gridZones = [
        {
            zoneId: 1,
            name: 'Civil Lines',
            neighborhood: 'Civil Lines',
            city: 'Jaipur',
            state: 'Rajasthan',
            region: 'North',
            country: 'India',
            postalCode: '302006',
            centerLat: 26.9124,
            centerLng: 75.7873,
            radiusKm: 5,
            pricePerKwhINR: 8.5,
            demandMultiplier: 1.2,
        },
        {
            zoneId: 2,
            name: 'Vaishali Nagar',
            neighborhood: 'Vaishali Nagar',
            city: 'Jaipur',
            state: 'Rajasthan',
            region: 'North',
            country: 'India',
            postalCode: '302021',
            centerLat: 26.9200,
            centerLng: 75.7230,
            radiusKm: 4,
            pricePerKwhINR: 9.0,
            demandMultiplier: 1.3,
        },
        {
            zoneId: 3,
            name: 'Malviya Nagar',
            neighborhood: 'Malviya Nagar',
            city: 'Jaipur',
            state: 'Rajasthan',
            region: 'North',
            country: 'India',
            postalCode: '302017',
            centerLat: 26.8540,
            centerLng: 75.8119,
            radiusKm: 5,
            pricePerKwhINR: 8.8,
            demandMultiplier: 1.25,
        },
        {
            zoneId: 4,
            name: 'Connaught Place',
            neighborhood: 'Connaught Place',
            city: 'Delhi',
            state: 'Delhi',
            region: 'North',
            country: 'India',
            postalCode: '110001',
            centerLat: 28.6315,
            centerLng: 77.2167,
            radiusKm: 3,
            pricePerKwhINR: 11.0,
            demandMultiplier: 1.5,
        },
        {
            zoneId: 5,
            name: 'Dwarka',
            neighborhood: 'Dwarka Sector 10',
            city: 'Delhi',
            state: 'Delhi',
            region: 'North',
            country: 'India',
            postalCode: '110075',
            centerLat: 28.5921,
            centerLng: 77.0460,
            radiusKm: 6,
            pricePerKwhINR: 9.5,
            demandMultiplier: 1.3,
        },
        {
            zoneId: 6,
            name: 'Andheri West',
            neighborhood: 'Andheri West',
            city: 'Mumbai',
            state: 'Maharashtra',
            region: 'West',
            country: 'India',
            postalCode: '400053',
            centerLat: 19.1136,
            centerLng: 72.8479,
            radiusKm: 5,
            pricePerKwhINR: 12.0,
            demandMultiplier: 1.6,
        },
        {
            zoneId: 7,
            name: 'Bandra',
            neighborhood: 'Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            region: 'West',
            country: 'India',
            postalCode: '400050',
            centerLat: 19.0596,
            centerLng: 72.8295,
            radiusKm: 4,
            pricePerKwhINR: 13.5,
            demandMultiplier: 1.7,
        },
        {
            zoneId: 8,
            name: 'Koramangala',
            neighborhood: 'Koramangala 5th Block',
            city: 'Bangalore',
            state: 'Karnataka',
            region: 'South',
            country: 'India',
            postalCode: '560095',
            centerLat: 12.9352,
            centerLng: 77.6245,
            radiusKm: 5,
            pricePerKwhINR: 10.5,
            demandMultiplier: 1.4,
        },
        {
            zoneId: 9,
            name: 'Whitefield',
            neighborhood: 'Whitefield',
            city: 'Bangalore',
            state: 'Karnataka',
            region: 'South',
            country: 'India',
            postalCode: '560066',
            centerLat: 12.9698,
            centerLng: 77.7499,
            radiusKm: 6,
            pricePerKwhINR: 9.8,
            demandMultiplier: 1.35,
        },
        {
            zoneId: 10,
            name: 'Mansarovar',
            neighborhood: 'Mansarovar',
            city: 'Jaipur',
            state: 'Rajasthan',
            region: 'North',
            country: 'India',
            postalCode: '302020',
            centerLat: 26.8700,
            centerLng: 75.7500,
            radiusKm: 5,
            pricePerKwhINR: 8.7,
            demandMultiplier: 1.22,
        },
    ];

    console.log('Creating grid zones...');
    for (const zone of gridZones) {
        await prisma.gridZone.upsert({
            where: { zoneId: zone.zoneId },
            update: zone,
            create: zone,
        });
    }
    console.log(`✅ Created ${gridZones.length} grid zones`);

    // Seed Demo Users
    const demoUsers = [
        {
            walletAddress: '0x1234567890123456789012345678901234567890',
            displayName: 'Solar Producer A',
            role: UserRole.PRODUCER,
            reputationScore: 85,
            totalEnergyProduced: 1500,
        },
        {
            walletAddress: '0x2345678901234567890123456789012345678901',
            displayName: 'Green Energy Co',
            role: UserRole.PRODUCER,
            reputationScore: 92,
            totalEnergyProduced: 2800,
        },
        {
            walletAddress: '0x3456789012345678901234567890123456789012',
            displayName: 'Consumer B',
            role: UserRole.CONSUMER,
            reputationScore: 75,
            totalEnergyBought: 500,
        },
        {
            walletAddress: '0x4567890123456789012345678901234567890123',
            displayName: 'Eco Trader',
            role: UserRole.BOTH,
            reputationScore: 88,
            totalEnergyProduced: 800,
            totalEnergySold: 600,
            totalEnergyBought: 200,
        },
    ];

    console.log('Creating demo users...');
    for (const user of demoUsers) {
        await prisma.user.upsert({
            where: { walletAddress: user.walletAddress },
            update: user,
            create: user,
        });
    }
    console.log(`✅ Created ${demoUsers.length} demo users`);

    // Seed Demo Listings
    const seller1 = await prisma.user.findUnique({
        where: { walletAddress: '0x1234567890123456789012345678901234567890' },
    });

    const seller2 = await prisma.user.findUnique({
        where: { walletAddress: '0x2345678901234567890123456789012345678901' },
    });

    if (seller1 && seller2) {
        const demoListings = [
            {
                listingId: 1,
                sellerId: seller1.id,
                tokenId: 1,
                kWhAmount: 100,
                remainingAmount: 75,
                pricePerKwh: 0.00012, // in ETH
                gridZone: 1,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                txHash: '0xabc123...',
            },
            {
                listingId: 2,
                sellerId: seller1.id,
                tokenId: 2,
                kWhAmount: 50,
                remainingAmount: 50,
                pricePerKwh: 0.00011,
                gridZone: 2,
                expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                txHash: '0xdef456...',
            },
            {
                listingId: 3,
                sellerId: seller2.id,
                tokenId: 3,
                kWhAmount: 200,
                remainingAmount: 180,
                pricePerKwh: 0.00013,
                gridZone: 3,
                expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                txHash: '0xghi789...',
            },
            {
                listingId: 4,
                sellerId: seller2.id,
                tokenId: 4,
                kWhAmount: 150,
                remainingAmount: 120,
                pricePerKwh: 0.00010,
                gridZone: 1,
                expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                txHash: '0xjkl012...',
            },
        ];

        console.log('Creating demo listings...');
        for (const listing of demoListings) {
            await prisma.listing.upsert({
                where: { listingId: listing.listingId },
                update: listing,
                create: listing,
            });
        }
        console.log(`✅ Created ${demoListings.length} demo listings`);
    }

    console.log('✅ Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
