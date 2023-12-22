import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, 'originalUrl is required'],
    },
    shortUrl: {
      type: String,
      required: [true, 'shortUrl is required'],
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

const Url = mongoose.model('Url', urlSchema);

export default Url;
