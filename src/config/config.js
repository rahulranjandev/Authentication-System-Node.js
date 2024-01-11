import { config } from 'dotenv';

const PATH = '.env';

if (!PATH) {
  throw new Error('The .env file is missing');
}

config({ path: PATH });

export const {
  HOST,
  NODE_ENV,
  PORT,
  MONGODB_URI,
  JWT_SECRET,
  SENTRY_DSN,
  ACCESS_TOKEN_PRIVATE_KEY,
  ACCESS_TOKEN_PUBLIC_KEY,
  REFRESH_TOKEN_PRIVATE_KEY,
  REFRESH_TOKEN_PUBLIC_KEY,
  GITHUB_OAUTH_CLIENT_ID,
  GITHUB_OAUTH_CLIENT_SECRET,
  GITHUB_OAUTH_REDIRECT_URL,
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_REDIRECT_URL,
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  FROM_SUPPORT_EMAIL,
  FROM_SENDER_EMAIL,
  SUPPORT_EMAIL,
  LOGO_URL,
  LARGE_LOGO_URL,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
} = process.env;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is missing');
}

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing');
}

if (!GITHUB_OAUTH_CLIENT_ID) {
  throw new Error('GITHUB_OAUTH_CLIENT_ID is missing');
}

if (!GITHUB_OAUTH_CLIENT_SECRET) {
  throw new Error('GITHUB_OAUTH_CLIENT_SECRET is missing');
}

if (!GITHUB_OAUTH_REDIRECT_URL) {
  throw new Error('GITHUB_OAUTH_REDIRECT_URL is missing');
}

if (!GOOGLE_OAUTH_CLIENT_ID) {
  throw new Error('GOOGLE_OAUTH_CLIENT_ID is missing');
}

if (!GOOGLE_OAUTH_CLIENT_SECRET) {
  throw new Error('GOOGLE_OAUTH_CLIENT_SECRET is missing');
}

if (!GOOGLE_OAUTH_REDIRECT_URL) {
  throw new Error('GOOGLE_OAUTH_REDIRECT_URL is missing');
}

if (!MAILGUN_API_KEY) {
  throw new Error('MAILGUN_API_KEY is missing');
}

if (!MAILGUN_DOMAIN) {
  throw new Error('MAILGUN_DOMAIN is missing');
}

if (!FROM_SUPPORT_EMAIL) {
  throw new Error('FROM_SUPPORT_EMAIL is missing');
}

if (!FROM_SENDER_EMAIL) {
  throw new Error('FROM_SENDER_EMAIL is missing');
}

if (!AWS_ACCESS_KEY_ID) {
  throw new Error('AWS_ACCESS_KEY_ID is missing');
}

if (!AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS_SECRET_ACCESS_KEY is missing');
}

if (!AWS_REGION) {
  throw new Error('AWS_REGION is missing');
}
