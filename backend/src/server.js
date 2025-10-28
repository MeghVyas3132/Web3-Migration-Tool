const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const deploymentRoutes = require('./routes/deployments');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// CORS configuration
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost on any port in development
    if (process.env.NODE_ENV !== 'production') {
      if (/^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
        return callback(null, true);
      }
    }
    
    // In production, check against whitelist
    const whitelist = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// API routes
app.use('/api/v1/deployments', deploymentRoutes);

// API root endpoint
app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    message: 'Web3 Migration Tool API v1',
    endpoints: ['/deployments']
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Web3 Migration Tool API is running' 
  });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/v1`);
});

module.exports = app;
