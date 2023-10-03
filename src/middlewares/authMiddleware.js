import User from '../models/userModel.js';
import { verifyToken } from '../utils/jwt.js';

// Authentication Middleware
class AuthMiddleware {
  isAuthenticated = async (req, res, next) => {
    try {
      let access_token;

      // Get token from header
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        access_token = req.headers.authorization.split(' ')[1];
      } else if (req.cookies.access_token) {
        access_token = req.cookies.access_token;
      }

      if (!access_token) {
        return res.status(401).json({
          message: 'You are not logged in! Please log in to get access.',
        });
      }

      // Verification token
      const decoded = verifyToken(access_token);

      if (!decoded) {
        return res.status(401).json({
          message: 'Invalid Credential. Please log in again!',
        });
      }

      // Check if user still exists
      const currentUser = await User.findOne({ _id: decoded.user.id });

      if (!currentUser) {
        return res.status(401).json({
          message: 'Credential is expired. Please log in again!',
        });
      }

      // GRANT ACCESS TO PROTECTED ROUTE
      res.locals.user = decoded.user;
      next();
    } catch (err) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  // Logged User Middleware
  requireUser = (req, res, next) => {
    try {
      const user = res.locals.user;

      if (!user) {
        return res.status(401).json({
          message: 'Invalid Credential. Please log in again!',
        });
      }

      next();
    } catch (err) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };
}

// Authorization Middleware
class OnlyAdminAccess {
  onlyAdmimAccess =
    (...allowedRoles) =>
    (req, res, next) => {
      const user = res.locals.user;

      if (!allowedRoles.includes(user.admin)) {
        return res.status(403).json({
          message: 'You are not authorized, only admin can access',
        });
      }

      next();
    };
}

export { AuthMiddleware, OnlyAdminAccess };
