import { Router } from 'express';

const router = Router();

import { AuthMiddleware, OnlyAdminAccess } from '../middlewares/authMiddleware.js';
import { UserController } from '../controllers/userController.js';

const authMiddleware = new AuthMiddleware();
const AdminAccess = new OnlyAdminAccess();
const User = new UserController();

router.get('/', authMiddleware.isAuthenticated, authMiddleware.requireUser, User.getUser);

router.get(
  '/all',

  authMiddleware.isAuthenticated,
  authMiddleware.requireUser,
  AdminAccess.onlyAdmimAccess(true),

  User.getAllUsers,
);

router.put('/', authMiddleware.isAuthenticated, authMiddleware.requireUser, User.updateUserProfile);

router.put('/deactivate-account', authMiddleware.isAuthenticated, authMiddleware.requireUser, User.deactivateAccount);

export default router;
