import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      process.env.CORS_ORIGIN
    ].filter(Boolean);

    console.log('CORS Check - Origin:', origin);
    console.log('CORS Check - Allowed:', allowedOrigins);

    if (allowedOrigins.includes(origin)) {
      console.log('CORS: Origin allowed');
      callback(null, true);
    } else {
      console.log('❌ CORS: Origin blocked');
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Disable for development
}));

app.use(compression());

// Enhanced morgan logging
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :req[authorization]'));

// Apply CORS
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: { 
    success: false,
    message: 'Too many requests from this IP, please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n ${req.method} ${req.originalUrl}`);
  console.log(' Headers:', {
    'content-type': req.headers['content-type'],
    'authorization': req.headers['authorization'] ? `Bearer ${req.headers['authorization'].split(' ')[1]?.substring(0, 20)}...` : 'None',
    'origin': req.headers['origin']
  });
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(' Body keys:', Object.keys(req.body));
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'SQL Server',
    environment: process.env.NODE_ENV || 'development',
    cors: process.env.CORS_ORIGIN || 'http://localhost:3000'
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);

// Basic API info
app.get('/api/v1', (req, res) => {
  res.json({ 
    message: 'PersonaTrade API is running with SQL Server!',
    version: '1.0.0',
    database: 'SQL Server',
    environment: process.env.NODE_ENV || 'development',
    endpoints: [
      'GET /health',
      'GET /api/v1',
      'POST /api/v1/auth/register',
      'POST /api/v1/auth/login',
      'GET /api/v1/auth/me',
      'POST /api/v1/auth/logout'
    ]
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', err.stack);
  
  // CORS error
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({ 
      success: false,
      message: 'CORS policy violation',
      error: 'Origin not allowed'
    });
    return;
  }
  
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 - Route not found:', req.originalUrl);
  res.status(404).json({ 
    success: false,
    message: `Route ${req.originalUrl} not found` 
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('Starting PersonaTrade API Server...');
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Database: ${process.env.DB_NAME || 'PersonaTrade'} on ${process.env.DB_HOST || 'localhost'}`);
    console.log(`CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
    console.log(`JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'MISSING!'}`);
    
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API info: http://localhost:${PORT}/api/v1`);
      console.log('PersonaTrade API is ready!');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();