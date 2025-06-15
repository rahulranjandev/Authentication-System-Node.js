import crypto from 'crypto';
import axios from 'axios';
import User from '../models/userModel.js';
import { updateUserSchema } from '../schemas/userSchema.js';
import { SendEmailUtil } from '../utils/sendEmail.js';

/**
 * @todo Get to the user's profile (GET) DONE ✅
 * @todo Get all users (GET) for admin access only DONE ✅
 * @todo Update the user's profile (PUT) for name, email, and photo DONE ✅
 * @todo Deactivate the user's account (PUT)
 * @todo Send an email to the user (POST) for account deactivation or deletion confirmation
 * @todo Confirm the user's account deletion (PUT)
 * @todo Delete the user's account (DELETE)
 * @todo Get all logged sessions (GET) user's sessions like IP address, browser, and location and Logout of all sessions (GET) for security purposes
 * @todo Connect to GitHub and Google (GET) for OAuth authentication and Update the user's profile (PUT) for name, email, and photo
 * @todo Notify the user of a new message (GET)
 * @todo Enable two-factor authentication (GET) for security purposes and Disable two-factor authentication (GET) for security purposes
 * @todo Export the user's data (GET) for GDPR compliance and Download the user's data (GET) for GDPR compliance
 */

export class UserController {
  constructor() {
    this.sendEmail = new SendEmailUtil();
  }

  /**
   * @desc Get to the user's profile (GET)
   * @route GET /api/user/me
   * @access Private User (authorized)
   */
  getUser = async (req, res, next) => {
    try {
      console.log(res.locals.user);
      const user = await User.findById(res.locals.user.id).select('-password');

      if (!user) {
        return res.status(400).json({
          message: 'User does not exist',
        });
      }

      return res.status(200).json({
        data: user,
      });
    } catch (err) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  /**
   * @description Get all users (GET) for admin access only
   * @route GET /api/user
   * @access Private Admin (authorized)
   * @param {*} limit - Limit the number of users to be returned (optional) (default: 10)
   * @param {*} page - The page number of the users to be returned (optional) (default: 1)
   * @param {*} sort - Sort the users by name, email, and role (optional) (default: name)
   * @param {*} select - Password is excluded by default (optional) (default: none)
   * @param {*} filter - Filter the users by name, email, and role (optional) (default: none)
   * @param {*} search - Search the users by name, email, and role (optional) (default: none)
   * @param {*} populate - Populate the users with the name, email, and role (optional) (default: none)
   * @param {*} paginate - Paginate the users by limit and page (optional) (default: none)
   */
  getAllUsers = async (req, res, next) => {
    try {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const skip = (page - 1) * limit;

      const [users, totalCount] = await Promise.all([
        User.find().select('-password').skip(skip).limit(limit),
        User.countDocuments(),
      ]);

      if (!users) {
        return res.status(400).json({
          message: 'Users do not exist',
        });
      }

      res.header('Access-Control-Expose-Headers', 'X-Total-Count');
      res.setHeader('X-Total-Count', totalCount);

      const totalPages = Math.ceil(totalCount / limit);
      const nextPage = page < totalPages ? `${req.originalUrl.split('?')[0]}?page=${page + 1}&limit=${limit}` : null;
      const prevPage = page > 1 ? `${req.originalUrl.split('?')[0]}?page=${page - 1}&limit=${limit}` : null;

      return res.status(200).json({
        data: users,
        meta: {
          totalCount,
          totalPages,
          nextPage,
          prevPage,
        },
      });
    } catch (err) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  /**
   * @description Update the user's profile (PUT) for name, email, and photo
   * @route PUT /api/user/update-profile
   * @access Private User (authorized)
   */
  updateUserProfile = async (req, res, next) => {
    try {
      const { error, value } = updateUserSchema.validate(req.body);

      if (error) res.status(400).json({ error: error.details[0].message });

      const user = await User.findById(res.locals.user.id);

      if (!user) {
        return res.status(400).json({
          message: 'User does not exist',
        });
      }

      const payload = ({ name: req.body.name, email: req.body.email, avatar: req.body.avatar } = value);

      if (user.email !== payload.email) {
        const existingUser = await User.findOne({ email: payload.email });

        if (existingUser) {
          return res.status(400).json({
            message: 'Email already exists',
          });
        }
      }

      user.name = payload.name || user.name;
      user.email = payload.email || user.email;
      user.avatar = payload.avatar || user.avatar;

      const updatedUser = await user.save();

      return res.status(200).json({
        data: updatedUser,
      });
    } catch (err) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };
  /**
   * @description Deactivate the user's account (PUT)
   * @route PUT /api/user/deactivate-account
   * @access Private User (authorized)
   */
  deactivateAccount = async (req, res, next) => {
    try {
      const user = await User.findById(res.locals.user.id).select('-password');

      if (!user) {
        return res.status(400).json({
          message: 'User does not exist',
        });
      }

      const deactivateToken = crypto.randomBytes(32).toString('hex');
      const createHash = crypto.createHash('sha256').update(deactivateToken).digest('hex');

      const ipAddress = req.ip;
      console.log(ipAddress);
      const browser = req.headers['user-agent'];
      console.log(browser);

      const IPv4 = ipAddress.split(':').slice(-1)[0];

      const location = await axios.get(`https://ipinfo.io/${IPv4}/json`);

      console.log(location.data);

      // const updatedUser = await User.findOneAndUpdate(
      //   { _id: res.locals.user.id },
      //   { token: createHash, verified: false },
      //   { new: true },
      // );

      // console.log(updatedUser);

      // if (updatedUser) await this.sendEmail.deactivateAccount(updatedUser.email);

      return res.status(200).json({
        // data: updatedUser,
        deactivateToken,
        createHash,
        ipAddress,
        browser,
        Location: location.data,
      });
    } catch (err) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };
}
