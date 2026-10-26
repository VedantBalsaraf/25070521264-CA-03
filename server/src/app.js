import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import borrowRoutes from './routes/borrowRoutes.js';
import impactRoutes from './routes/impactRoutes.js';
import { globalErrorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// In development the app can be opened as localhost, 127.0.0.1, or over the LAN
// (Vite prints network URLs). Allowing only one exact origin meant every other
// way of opening the app failed CORS, so dev allows any local address.
const LOCAL_ORIGIN =
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(:\d+)?$/;

app.use(cors({
  origin: (origin, callback) => {
    // No origin: same-origin requests, curl, Postman, server-to-server.
    if (!origin) return callback(null, true);
    if (config.nodeEnv === 'development' && LOCAL_ORIGIN.test(origin)) {
      return callback(null, true);
    }
    if (origin === config.clientUrl) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // Express 5 leaves req.body undefined for requests without a body (e.g. a
  // PUT with no payload). Default it to {} so controllers can destructure safely.
  if (req.body === undefined) req.body = {};
  next();
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'BorrowCircles API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/impact', impactRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;