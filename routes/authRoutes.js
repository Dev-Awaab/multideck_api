import express from 'express';
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout
} from '../controllers/authControllers.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.get('/logout', logout)
router.route('/me').get(protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatedetails', protect ,updateDetails)
router.put('/updatepassword', protect, updatePassword)
export default router;

