const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const deploymentRoutes = require('./routes/deployments');
const subdomainRoutes = require('./routes/subdomains');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/deployments', deploymentRoutes);
app.use('/api/v1/subdomains', subdomainRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Web3 Migration Tool API is running' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/v1`);
});

module.exports = app;
