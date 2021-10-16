import express from 'express';
import {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, authorized } from '../middleware/authMiddleware.js';
import advancedResults from '../middleware/advancedResult.js';
import Category from '../models/categoryModel.js';

// including other resoure router
import serviceRouter from './serviceRoutes.js';

const router = express.Router();

// re-route into other router
router.use('/:categoryId/service', serviceRouter);

router
  .route('/')
  .get(advancedResults(Category, 'services'),getCategories)
  .post(protect, authorized('admin'), addCategory);
router
  .route('/:id')
  .get(getCategory)
  .put(protect, authorized('admin'), updateCategory)
  .delete(protect, authorized('admin'), deleteCategory);

export default router;
