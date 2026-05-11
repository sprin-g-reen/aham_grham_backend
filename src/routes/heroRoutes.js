import express from 'express';
const router = express.Router();
import { getHero, updateHero } from '../controllers/heroController.js';
router.route('/')
  .get(getHero)
  .put(updateHero);

export default router;
