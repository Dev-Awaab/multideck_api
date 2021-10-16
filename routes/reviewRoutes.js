import express from 'express';
import {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import Review from '../models/reviewModel.js';

const router = express.Router({ mergeParams: true });

import advancedResults from '../middleware/advancedResult.js';
import { protect, authorized } from '../middleware/authMiddleware.js';

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'service',
      select: 'name description',
    }),
    getReviews
  )
  .post(protect, authorized('user', 'admin'), addReview);

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorized('user', 'admin'), updateReview)
  .delete(protect, authorized('user', 'admin'), deleteReview);
export default router;
