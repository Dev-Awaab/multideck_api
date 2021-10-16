import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

/**
 * @desc  Get users
 * @route  GET -- /api/users
 * @access Private/admin
 */
const getUsers = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc  Get single user
 * @route  GET -- /api/users/:id
 * @access Private/admin
 */
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
/**
 * @desc   Create user
 * @route  POST -- /api/users
 * @access Private/Admin
 */

const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 * @desc   Update user
 * @route  PUT -- /api/users/:id
 * @access Private/admin
 */
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc   Delete user
 * @route  PUT -- /api/users/:id
 * @access Private/admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
export { createUser, getUser, getUsers, updateUser, deleteUser };
