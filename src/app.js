import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { connectDB } from './utils/connectDB.js';
import { PORT, NODE_ENV } from './config/config.js';

import router from './routes/index.js';
import validateIP from './middlewares/validateIP.js';

console.log(`NODE_ENV: ${NODE_ENV}`);

const app = express();

// Trust the X-Forwarded-For header
app.enable('trust proxy', 1);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: false, // include headers with requests, like X-Forwarded-For, Remote-Addr
  legacyHeaders: false, // include X-Real-IP header and use this IP address instead of the remote address
  message: 'Too many requests from this IP, please try again later.',
  statusCode: 429,
  validate: { trustProxy: false },
});

// Validate IP Middleware
app.use(limiter);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie Parser
app.use(cookieParser());

// Set Static Folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDirectory = path.join(__dirname, 'logs');

// Create the logs directory if it doesn't exist
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

// Create a write stream
const accessLogStream = fs.createWriteStream(path.join(logsDirectory, 'access.log'), { flags: 'a' });

// Morgan Logger
app.use(
  morgan(
    `:remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
`,
    { stream: accessLogStream },
  ),
);

app.use(
  morgan(
    `:remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
`,
  ),
);

// Cors
app.use(cors());

// Set Security HTTP Headers
app.use(helmet());

// Main Routes
app.use('/', validateIP, router);

// UnKnown Routes
app.all('/*splat', (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use((err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Start Server and Connect to DB
app.listen(PORT ?? 3333, () => {
  console.log(`App is running at http://localhost:${PORT} in ${NODE_ENV} mode`);
  console.log('Press CTRL-C to stop');

  connectDB();
});
