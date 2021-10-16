import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

/**
 * @desc  Register user
 * @route  POST -- /api/auth
 * @access Public
 */

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

/**
 * @desc  Login user
 * @route  POST -- /api/auth
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid Credentials', 401));
  }

  // check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid Credentials');
  }

  sendTokenResponse(user, 200, res);
});

/**
 * @desc   Get logged in user
 * @route  POST -- /api/auth/me
 * @access Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc   forget password
 * @route  POST -- /api/auth/forgotpassword
 * @access Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404);
    throw new Error('There is no user with that email');
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });
  // create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  // create message to pass
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({
      success: true,
      data: 'Email sent',
    });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error('Email could not be sent');
  }
});

/**
 * @desc   Reset password
 * @route  POST -- /api/auth/resetpassword/:resettoken
 * @access Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  //  Get hased token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid token');
  }

  // ?set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);

  // res.status(200).json({
  //   success: true,
  //   data: user,
  // });
});

/**
 * @desc   Update user details
 * @route  POST -- /api/auth/updatedetails
 * @access Private
 */
const updateDetails = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc   Update password
 * @route  POST -- /api/auth/updatepassword
 * @access Private
 */
const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  // Check current password
  if(!(await user.matchPassword(req.body.currentPassword))){
    return next( new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res)
});
// store token in cookie
const sendTokenResponse = (user, statusCode, res) => {
  // create token
  const token = user.getSignedToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

/**
 * @desc   Log user our / clear cookie
 * @route  POST -- /api/auth/logout
 * @access Private
 */
 const logout = asyncHandler(async (req, res) => {
  res.cookie('token','none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })

res.status(200).json({
 success: true,
 data: {}
})

console.log(err)
});
export {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout
};
