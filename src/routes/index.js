import { Router } from 'express';

const router = Router();

import authRoutes from './auth.route.js';
import userRoutes from './user.route.js';

const status = (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running',
  });
};

router.route('/').get(status);

router.use('/api/auth', authRoutes);
router.use('/api/user', userRoutes);

export default router;
