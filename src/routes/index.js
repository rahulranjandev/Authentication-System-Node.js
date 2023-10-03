import { Router } from 'express';

const router = Router();

import authRoutes from './auth.routes.js';

const status = (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running',
  });
};

router.route('/').get(status);

router.use('/api/auth', authRoutes);

export default router;
