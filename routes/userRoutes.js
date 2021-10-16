import express from 'express';
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from '../controllers/userControllers.js';
import User from '../models/userModel.js';
import advancedResults from '../middleware/advancedResult.js';
import { protect, authorized } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(authorized('admin'));

router.route('/').get(advancedResults(User), getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);
export default router;
