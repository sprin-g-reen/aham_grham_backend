import express from 'express';
const router = express.Router();
import {
  authAdmin,
  registerAdmin,
  getAdminProfile,
  logoutAdmin,
  updateAdminPassword,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/', registerAdmin);
router.post('/login', authAdmin);
router.post('/logout', logoutAdmin);
router.get('/profile', protect, getAdminProfile);
router.put('/password', protect, updateAdminPassword);

export default router;
