import { Router } from 'express';

const router = Router();

import { ShortenController } from '../controllers/shortenController.js';
const Shorten = new ShortenController();

import authRoutes from './auth.route.js';
import userRoutes from './user.route.js';
import shortenRoutes from './shorten.route.js';

const status = (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running',
  });
};

router.route('/').get(status);

router.use('/api/auth', authRoutes);
router.use('/api/user', userRoutes);
router.use('/api', shortenRoutes);
router.get('/:shortUrl', Shorten.getUrl);

export default router;
