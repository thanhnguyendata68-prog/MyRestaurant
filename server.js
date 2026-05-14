import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from './config/config.js';
import orderRoutes from './server/routes/order.routes.js';

// The error querySrv ECONNREFUSED is still happening because of a DNS resolution issue on Windows (very common with mongodb+srv:// connections).
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(config.mongoUri, {
  serverSelectionTimeoutMS: 60000,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api', orderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'My Restaurant API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      orders: {
        create: 'POST /api/orders',
        getAll: 'GET /api/orders',
        getOne: 'GET /api/orders/:id',
        updateStatus: 'PATCH /api/orders/:id/status',
        delete: 'DELETE /api/orders/:id'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    details: err.message 
  });
});

// Start server
const PORT = config.port || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
});

export default app;
