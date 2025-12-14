import { Router } from 'express';

const router = Router();

router.get('/stats', (req, res) => {
    // Mock data for now
    res.json({
        totalVolume: '1.5M',
        activeProducers: 1250,
        averagePrice: 0.12, // $ per kWh
        carbonOffset: 950 // tons
    });
});

export default router;
