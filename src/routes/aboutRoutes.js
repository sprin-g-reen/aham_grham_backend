import express from 'express';
const router = express.Router();
import { getAbout, updateAbout } from '../controllers/aboutController.js';
router.route('/')
  .get(getAbout)
  .put(updateAbout);

export default router;
