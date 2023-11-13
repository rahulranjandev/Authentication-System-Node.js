import express from 'express';
import * as Sentry from '@sentry/node';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { connectDB } from './utils/connectDB.js';
import { PORT, NODE_ENV, SENTRY_DSN } from './config/config.js';

import router from './routes/index.js';
import validateIP from './middlewares/validateIP.js';

console.log(`NODE_ENV: ${NODE_ENV}`);

const app = express();

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 10 requests per windowMs
  standardHeaders: false, // include headers with requests, like X-Forwarded-For, Remote-Addr
  legacyHeaders: false, // include X-Real-IP header and use this IP address instead of the remote address
  message: 'Too many requests from this IP, please try again later.',
});

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

// Sentry Init (Error Tracking)
Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context, so that all
app.use(
  Sentry.Handlers.requestHandler({
    ip: true,
    request: ['headers', 'method', 'query_string', 'url'],
    serverName: true,
    transaction: true,
  }),
);

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// Main Routes
app.use('/', validateIP, router);

// The error handler must be before any other error middleware and after all controllers
app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Capture all 404 and 500 errors
      if (error.status === 404 || error.status === 500) {
        return true;
      }
      return false;
    },
  }),
);

// Optional fallthrough error handler
app.use((err, req, res, next) => {
  res.status(500);
  res.send(res.sentry + '\n');
});

// Debug Sentry
app.get('/debug-sentry', async (req, res) => {
  res.send('Debug Sentry');
  throw new Error('My first Sentry error!');
});

// UnKnown Routes
app.all('*', (req, res, next) => {
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
  console.log(`  App is running at http://localhost:${PORT} in ${NODE_ENV} mode`);
  console.log('  Press CTRL-C to stop');

  connectDB();
});
