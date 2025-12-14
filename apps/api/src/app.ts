import express from 'express';
import cors from 'cors';
import marketRoutes from './routes/market.routes';
import listingsRoutes from './routes/listings';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/market', marketRoutes);
app.use('/api/listings', listingsRoutes);

// Start blockchain indexer (optional - requires PostgreSQL)
// Uncomment the following lines after setting up PostgreSQL:
// import { indexer } from './services/indexer';
// indexer.start().catch(console.error);

export default app;

