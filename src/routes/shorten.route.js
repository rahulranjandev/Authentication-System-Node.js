import { Router } from 'express';

const router = Router();

import { ShortenController } from '../controllers/shortenController.js';

const Shorten = new ShortenController();

router.post('/shorten', Shorten.postUrl);

export default router;
