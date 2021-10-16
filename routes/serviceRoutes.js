import express from 'express';
import {
  getServices,
  addService,
  getService,
  updateService,
  deleteService,
  servicePhotoUpload,
} from '../controllers/serviceController.js';
import { protect, authorized } from '../middleware/authMiddleware.js';
// import advancedResults from '../middleware/advancedResult.js';
// import Service from '../models/serviceModel.js';
import reviewRouter from '../routes/reviewRoutes.js';

const router = express.Router({ mergeParams: true });

router.use('/:serviceId/reviews', reviewRouter)

router
  .route('/')
  .get(getServices)
  .post(protect, authorized('admin', 'pulisher'), addService);

router
  .route('/:id')
  .get(getService)
  .put(protect, authorized('admin', 'pulisher'), updateService)
  .delete(protect, authorized('admin', 'pulisher'), deleteService);
router
  .route('/:id/photo')
  .put(protect, authorized('admin', 'pulisher'), servicePhotoUpload);
export default router;
