import express from 'express';
import { PrismaClient } from '@prisma/client';
import { ETH_TO_INR } from '../config/contracts';

const router = express.Router();
const prisma = new PrismaClient();

// Get all active listings
router.get('/', async (req, res) => {
    try {
        const { zone, page = '1', limit = '20' } = req.query;

        const where: any = {
            isActive: true,
            expiresAt: { gt: new Date() },
        };

        if (zone) {
            where.gridZone = parseInt(zone as string);
        }

        const listings = await prisma.listing.findMany({
            where,
            include: {
                seller: {
                    select: {
                        walletAddress: true,
                        displayName: true,
                        reputationScore: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip: (parseInt(page as string) - 1) * parseInt(limit as string),
            take: parseInt(limit as string),
        });

        //Convert prices to INR
        const listingsWithINR = listings.map((listing: any) => ({
            ...listing,
            pricePerKwhETH: listing.pricePerKwh,
            pricePerKwhINR: (parseFloat(listing.pricePerKwh.toString()) * ETH_TO_INR).toFixed(2),
            totalPriceINR: (parseFloat(listing.pricePerKwh.toString()) * parseFloat(listing.kWhAmount.toString()) * ETH_TO_INR).toFixed(2),
        }));

        const total = await prisma.listing.count({ where });

        res.json({
            listings: listingsWithINR,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                pages: Math.ceil(total / parseInt(limit as string)),
            },
        });
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
});

// Get listing by ID
router.get('/:id', async (req, res) => {
    try {
        const listing = await prisma.listing.findUnique({
            where: { listingId: parseInt(req.params.id) },
            include: {
                seller: {
                    select: {
                        walletAddress: true,
                        displayName: true,
                        reputationScore: true,
                        totalEnergyProduced: true,
                        totalEnergySold: true,
                    },
                },
                orders: {
                    select: {
                        orderId: true,
                        kWhAmount: true,
                        totalPrice: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        const listingWithINR = {
            ...listing,
            pricePerKwhETH: listing.pricePerKwh,
            pricePerKwhINR: (parseFloat(listing.pricePerKwh.toString()) * ETH_TO_INR).toFixed(2),
            totalPriceINR: (parseFloat(listing.pricePerKwh.toString()) * parseFloat(listing.kWhAmount.toString()) * ETH_TO_INR).toFixed(2),
        };

        res.json(listingWithINR);
    } catch (error) {
        console.error('Error fetching listing:', error);
        res.status(500).json({ error: 'Failed to fetch listing' });
    }
});

// Get listings by zone with map data
router.get('/map/zones', async (req, res) => {
    try {
        const zones = await prisma.$queryRaw`
            SELECT 
                l."gridZone",
                COUNT(*)::int as "listingCount",
                SUM("kWhAmount")::decimal as "totalEnergy",
                AVG("pricePerKwh")::decimal as "avgPrice"
            FROM "Listing" l
            WHERE l."isActive" = true AND l."expiresAt" > NOW()
            GROUP BY l."gridZone"
        `;

        // Get zone details
        const zoneDetails = await prisma.gridZone.findMany({
            where: {
                zoneId: {
                    in: (zones as any[]).map(z => z.gridZone),
                },
            },
        });

        const zonesWithDetails = (zones as any[]).map((zone: any) => {
            const details = zoneDetails.find((d: any) => d.zoneId === zone.gridZone);
            return {
                ...zone,
                ...details,
                avgPriceINR: (parseFloat(zone.avgPrice) * ETH_TO_INR).toFixed(2),
            };
        });

        res.json(zonesWithDetails);
    } catch (error) {
        console.error('Error fetching zone data:', error);
        res.status(500).json({ error: 'Failed to fetch zone data' });
    }
});

export default router;
