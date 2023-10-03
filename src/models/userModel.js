import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: 'https://img.icons8.com/stickers/100/null/super-mario.png',
    },
    provider: {
      type: String,
      default: 'local',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: '',
    },
    resgisteredDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  },
);

const User = mongoose.model('User', userSchema);

export default User;
