import jwt from 'jsonwebtoken';
import {
  NODE_ENV,
  JWT_SECRET,
  ACCESS_TOKEN_PRIVATE_KEY,
  ACCESS_TOKEN_PUBLIC_KEY,
  REFRESH_TOKEN_PRIVATE_KEY,
  REFRESH_TOKEN_PUBLIC_KEY,
} from '../config/config.js';

// Token Keys
const accessTokenPrivateKey = ACCESS_TOKEN_PRIVATE_KEY;
const accessTokenPublicKey = ACCESS_TOKEN_PUBLIC_KEY;
const refreshTokenPrivateKey = REFRESH_TOKEN_PRIVATE_KEY;
const refreshTokenPublicKey = REFRESH_TOKEN_PUBLIC_KEY;
const jwtSecret = JWT_SECRET;

// Sign a token with the private key
const signedToken = (payload) => jwt.sign(payload, jwtSecret, { expiresIn: '1d' });

// Verify a token with the public key
const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    console.error(error);
    return null;
  }
};

// New Signed Token with Refresh Token
const newSignedToken = (payload, keyName, options = {}) => {
  const actualKey = keyName === 'accessTokenPrivateKey' ? accessTokenPrivateKey : refreshTokenPrivateKey;

  const decodedKey = Buffer.from(actualKey, 'base64').toString('ascii');

  return jwt.sign(payload, decodedKey, { ...options, algorithm: 'RS256' });
};

// Verify a token with the public key
const verifyNewToken = (token, keyName) => {
  try {
    const actualKey = keyName === 'accessTokenPublicKey' ? accessTokenPublicKey : refreshTokenPublicKey;

    const decodedKey = Buffer.from(actualKey, 'base64').toString('ascii');

    const verify = jwt.verify(token, decodedKey);

    return {
      vaild: true,
      expired: false,
      verify,
    };
  } catch (err) {
    console.error(err);
    return {
      vaild: false,
      expired: err.name === 'TokenExpiredError',
      verify: null,
    };
  }
};

const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: NODE_ENV === 'production',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
};

const getCookieOptions = (expiresIn) => ({
  httpOnly: true,
  sameSite: 'strict',
  secure: NODE_ENV === 'production',
  expires: new Date(Date.now() + expiresIn),
});

const createAccessToken = (payload) => {
  return newSignedToken(payload, 'accessTokenPrivateKey', {
    expiresIn: '15m',
  });
};

const createRefreshToken = (payload) => {
  return newSignedToken(payload, 'refreshTokenPrivateKey', {
    expiresIn: '7d',
  });
};

const verifyAccessToken = (token) => verifyNewToken(token, 'accessTokenPublicKey');

const verifyRefreshToken = (token) => verifyNewToken(token, 'refreshTokenPublicKey');

const setAccessTokenCookie = (accessToken, res) => {
  const options = getCookieOptions('15m');
  res.cookie('access_token', accessToken, options);
};

const setRefreshTokenCookie = (refreshToken, res) => {
  const options = getCookieOptions('7d');
  res.cookie('refresh_token', refreshToken, options);
};

const removeAccessTokenCookie = (res) => {
  const options = getCookieOptions('-1s');
  res.cookie('access_token', '', options);
};

const removeRefreshTokenCookie = (res) => {
  const options = getCookieOptions('-1s');
  res.cookie('refresh_token', '', options);
};

export {
  signedToken,
  verifyToken,
  newSignedToken,
  verifyNewToken,
  getCookieOptions,
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  removeAccessTokenCookie,
  removeRefreshTokenCookie,
  cookieOptions,
};
