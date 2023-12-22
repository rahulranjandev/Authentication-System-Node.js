import Url from '../models/urlModel.js';
import { customAlphabet } from 'nanoid';

export class ShortenController {
  postUrl = async (req, res) => {
    const { longUrl } = req.body;

    // Check if the URL is valid
    if (!isValidUrl(longUrl)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
      // Check if the URL already exists in the database
      const existingUrl = await Url.findOne({ longUrl });

      if (existingUrl) {
        return res.json(existingUrl);
      }

      // Generate a short ID for the URL
      const generateShortUrl = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6);
      const shortUrl = generateShortUrl();

      // Create a new URL entry in the database
      const newUrl = new Url({ originalUrl: longUrl, shortUrl: shortUrl });
      await newUrl.save();

      return res.status(201).json({
        originalUrl: newUrl.originalUrl,
        shortUrl: newUrl.shortUrl,
        date: newUrl.resgisteredDate,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  getUrl = async (req, res) => {
    const { shortUrl } = req.params;

    try {
      // Find the original URL in the database
      const url = await Url.findOne({ shortUrl });

      if (url) {
        // Redirect to the original URL
        return res.status(301).redirect(url.originalUrl);
      }

      // If the short URL is not found
      res.status(404).json({ error: 'URL not found' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

// Helper function to validate URLs
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
