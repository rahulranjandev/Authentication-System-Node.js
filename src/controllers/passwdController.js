import bcrypt from 'bcryptjs';
import { forgotPasswordSchema, updatePasswordSchema } from '../schemas/userSchema.js';
import { SendEmailUtil } from '../utils/sendEmail.js';
import User from '../models/userModel.js';

export class PasswdController {
  constructor() {
    this.sendEmail = new SendEmailUtil();
  }

  forgotPassword = async (req, res, next) => {
    const { error, value } = forgotPasswordSchema.validate(req.body);

    if (error) res.status(400).json({ error: error.details[0].message });

    const payload = ({ email: req.body.email } = value);

    try {
      const user = await User.findOne({ email: payload.email }).select('-password');

      if (!user) res.status(404).json({ message: 'User not found' });

      // To send email using Mailgun API
      if (user) await this.sendEmail.forgotPassword(user, res);
    } catch (err) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  resetPassword = async (req, res, next) => {
    const resttoken = req.params.resttoken;
    const payload = { password: req.body.password };

    if (!resttoken) res.status(401).json({ message: 'Token is required' });

    if (!payload.password) res.status(400).json({ message: 'Password is required' });

    try {
      const user = await User.findOne({ token: resttoken });

      if (!user) res.status(404).json({ message: 'User not found' });

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(payload.password, salt);
      const newChangedPassword = (user.password = hash);
      const newToken = (user.token = '');

      await User.findOneAndUpdate({ password: newChangedPassword, token: newToken });

      res.status(200).json({
        message: 'Password reset successful',
      });
    } catch (err) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  changePassword = async (req, res, next) => {
    const { error, value } = updatePasswordSchema.validate(req.body);

    if (error) res.status(400).json({ error: error.details[0].message });

    const { oldPassword, newPassword } = (req.body = value);
    const { id } = res.locals.user.id;

    try {
      const user = await User.findOne({ _id: id });

      if (!user) res.status(404).json({ message: 'User not found' });

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);
      const newChangedPassword = (user.password = hash);

      await User.findOneAndUpdate({ _id: id }, { password: newChangedPassword }, { new: true });

      return res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  changePasswordWithToken = async (req, res, next) => {
    res.status(200).json({
      message: 'Passwd API called, Under construction 🚧',
    });
  };
}
