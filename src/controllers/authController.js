import bcrypt from 'bcryptjs';
import { NODE_ENV } from '../config/config.js';
import { signedToken, cookieOptions } from '../utils/jwt.js';
import { registerUserSchema, userLoginSchema } from '../schemas/userSchema.js';
import { GitHub, Google } from '../utils/connectOauth.js';
import { SendEmail } from '../utils/sendEmail.js';
import User from '../models/userModel.js';

class AuthController {
  constructor() {
    this.sendEmail = new SendEmail();
    this.github = new GitHub();
    this.google = new Google();
  }

  register = async (req, res, next) => {
    const { error, value } = registerUserSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    try {
      const payload = ({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
      } = value);

      const user = await User.findOne({ email: payload.email }).select('-password');
      if (user) return res.status(400).json({ message: 'User already exists' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(payload.password, salt);
      payload.password = hashedPassword;

      const newUser = new User(payload);

      await newUser.save();

      if (newUser) await this.sendEmail.confirmEmail(newUser.email);

      const payloadJWT = { user: { id: newUser._id, admin: newUser.isAdmin } };

      const _token = signedToken(payloadJWT);

      if (!_token) return res.status(500).json({ message: 'Token not found' });

      const cookieSettings = { ...cookieOptions, httpOnly: true };
      if (NODE_ENV === 'production') {
        cookieSettings.secure = true;
      }

      res.cookie('access_token', _token, cookieSettings);
      res.cookie('logged_in', true, { ...cookieSettings, httpOnly: false });

      res.status(201).json({
        data: newUser._id,
        token: _token,
      });
    } catch (err) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  login = async (req, res, next) => {
    const { error, value } = userLoginSchema.validate(req.body);

    if (error) res.status(400).json({ error: error.details[0].message });

    try {
      const payload = ({ email: req.body.email, password: req.body.password } = value);

      const user = await User.findOne({ email: payload.email }).select('-password');

      if (!user) return res.status(400).json({ message: 'User does not exist' });

      const isMatch = await bcrypt.compare(payload.password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const payloadJWT = { user: { id: user._id, admin: user.isAdmin } };

      const _token = signedToken(payloadJWT);
      if (!_token) return res.status(500).json({ message: 'Token not found' });

      const cookieSettings = { ...cookieOptions, httpOnly: true };
      if (NODE_ENV === 'production') {
        cookieSettings.secure = true;
      }

      res.cookie('access_token', _token, cookieSettings);
      res.cookie('logged_in', true, { ...cookieSettings, httpOnly: false });

      return res.status(200).json({
        token: _token,
        data: {
          id: user._id,
          email: user.email,
        },
      });
    } catch (err) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  logout = async (req, res, next) => {
    try {
      res.clearCookie('access_token');
      res.clearCookie('logged_in');
      res.clearCookie('token');

      res.status(200).json({
        message: 'User logged out successfully',
      });
    } catch (err) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  githubOAuth = async (req, res, next) => {
    console.log('Github OAuth');

    try {
      const code = req.query.code;
      const pathUrl = req.query.state || '/';

      if (req.query.error) {
        return res.status(400).json({ message: 'Error in Github OAuth' });
      }

      if (!code) return res.status(400).json({ message: 'Code not found' });

      const accessToken = await this.github.getAccessToken(code);
      console.log(accessToken);

      if (!accessToken) return res.status(400).json({ message: 'Access token not found' });

      const githubUser = await this.github.getUser(accessToken);
      console.log(githubUser);

      if (!githubUser) return res.status(400).json({ message: 'Github user not found' });

      const payload = {
        email: githubUser.email,
        name: githubUser.login,
        avatar: githubUser.avatar_url,
        provider: 'GitHub',
        verified: true,
      };

      const user = await User.findOneAndUpdate(
        {
          email: githubUser.email,
        },
        payload,
        {
          runValidators: false,
          new: true,
          upsert: true,
        },
      );

      if (!user) {
        return res.redirect(`${pathUrl}?error=ErrorinGithubOAuth`);
      }

      const payloadJWT = { user: { id: user._id, admin: user.isAdmin } };

      const _token = signedToken(payloadJWT);

      if (!_token) return res.json({ message: 'Token not found' });

      const cookieSettings = { ...cookieOptions, httpOnly: true };
      if (NODE_ENV === 'production') {
        cookieSettings.secure = true;
      }

      res.cookie('access_token', _token, cookieSettings);
      res.cookie('logged_in', true, { ...cookieSettings, httpOnly: false });

      return res.status(200).json({
        token: _token,
        cookieOptions,
      });
    } catch (err) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  googleOAuth = async (req, res, next) => {
    try {
      const code = req.query.code;
      const pathUrl = req.query.state || '/';

      if (!code) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (req.query.error) {
        return res.status(400).json({ message: 'Error in Google OAuth' });
      }

      if (!code) return res.status(400).json({ message: 'Code not found' });

      const { id_token, access_token } = await this.google.getAccessToken({ code });

      if (!access_token) return res.status(400).json({ message: 'Access token not found' });

      const googleUser = await this.google.getUser({ id_token, access_token });

      if (!googleUser) return res.status(400).json({ message: 'Google user not found' });

      if (!googleUser.verified_email) {
        return res.status(400).json({ message: 'Google user email not found' });
      }

      const payload = {
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
        provider: 'Google',
        verified: true,
      };

      const user = await User.findOneAndUpdate(
        {
          email: googleUser.email,
        },
        payload,
        {
          runValidators: false,
          new: true,
          upsert: true,
        },
      );

      if (!user) {
        return res.redirect(`${pathUrl}?error=ErrorinGoogleOAuth`);
      }

      const payloadJWT = { user: { id: user._id, admin: user.isAdmin } };

      const _token = signedToken(payloadJWT);

      if (!_token) return res.json({ message: 'Token not found' });

      const cookieSettings = { ...cookieOptions, httpOnly: true };
      if (NODE_ENV === 'production') {
        cookieSettings.secure = true;
      }

      res.cookie('access_token', _token, cookieSettings);
      res.cookie('logged_in', true, { ...cookieSettings, httpOnly: false });

      return res.status(200).json({
        token: _token,
        cookieOptions,
      });
    } catch (err) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  confirmEmail = async (req, res, next) => {
    try {
      const token = req.params.token;

      if (!token) return res.status(400).json({ message: 'Token not found' });

      const user = await User.findOne({ token: token }).select('-password');

      if (!user) return res.status(400).json({ message: 'User not found' });

      if (user.verified) return res.status(400).json({ message: 'User already verified' });

      if (user) {
        const payload = { token: '', verified: true };

        await User.findOneAndUpdate({ _id: user._id }, payload, {
          runValidators: false,
          new: true,
          upsert: false,
        });
      }

      res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };
}

export { AuthController };
