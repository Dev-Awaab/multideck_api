import Category from '../models/categoryModel.js';
import asyncHandler from 'express-async-handler';
import advancedResults from '../middleware/advancedResult.js';

/**
 * @desc  Get all category
 * @route  GET -- /api/category
 * @access Public
 */
const getCategories = asyncHandler(async (req, res) => {
    res.status(200).json(res.advancedResults)
});

/**
 * @desc  Get a category by ID
 * @route  GET -- /api/category/:id
 * @access Public
 */
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error(`Category is not found with the id of ${req.params.id}`);
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});

/**
 * @desc   Create a category
 * @route  POST -- /api/category/:id
 * @access Private/admin
 */
const addCategory = asyncHandler(async (req, res) => {
  // add user to body
    req.body.user = req.user.id

    
  const category = await Category.create(req.body);

  
  res.status(201).json({
    success: true,
    data: category,
  });
});

/**
 * @desc   Update a category
 * @route  PUT -- /api/category/:id
 * @access Private/admin
 */
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    res.status(404);
    throw new Error(`Category is not found with the id of ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

/**
 * @desc   Delete a category
 * @route  DELETE -- /api/category/:id
 * @access Private/admin
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error(`Category is not found with the id of ${req.params.id}`);
  }

   category.remove()
  res.status(200).json({
    success: true,
    data: {},
  });
});
export {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
};
