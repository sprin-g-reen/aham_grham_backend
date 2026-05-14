import express from 'express';
const router = express.Router();
import * as reviewController from '../controllers/reviewController.js';

router.get('/', reviewController.getReviews);
router.post('/', reviewController.createReview);
router.patch('/:id/status', reviewController.updateReviewStatus);
router.delete('/:id', reviewController.deleteReview);

export default router;
