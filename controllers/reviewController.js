import asyncHandler from 'express-async-handler';
import Review from '../models/reviewModel.js';
import Service from '../models/serviceModel.js';

/**
 * @desc  Get Reviews
 * @route  GET -- /api/reviews
 * @route  GET -- /api/service/:serviceId/reviews
 * @access Public
 */

const getReviews = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc  Get Reviews
 * @route  GET -- /api/reviews/:id
 * @access Public
 */

const getReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id).populate(
    'service',
    'name'
  );

  if (!review) {
    res.status(404);
    throw new Error(`No review found with id of ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

/**
 * @desc  Add Reviews
 * @route  POST -- /api/service/:serviceId/reviews
 * @access Private
 */

const addReview = asyncHandler(async (req, res) => {
  req.body.service = req.params.serviceId;
  req.body.user = req.user.id;

  const service = await Service.findById(req.params.serviceId);

  if (!service) {
    res.status(404);
    throw new Error(`No service with the id of ${req.params.serviceId}`);
  }

  const review = await Review.create(req.body);

  res.status(200).json({
    success: true,
    data: review,
  });
});

/**
 * @desc  update Reviews
 * @route  PUT -- /api/reviews/:id
 * @access Private
 */

 const updateReview = asyncHandler(async (req, res) => {
     let review = await Review.findById(req.params.id)


  if (!review) {
    res.status(404);
    throw new Error(`No review with the id of ${req.params.id}`);
  }

  //  Make sure review belongls to user or user is an admin
   if(review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error(`Not authorized to update review`);
   }

     review = await Review.findByIdAndUpdate(req.params.id, req.body, {
     new: true,
     runValidators: true
   })
  res.status(200).json({
    success: true,
    data: review,
  });
});

/**
 * @desc  delete Reviews
 * @route  DELETE -- /api/reviews/:id
 * @access Private
 */

 const deleteReview = asyncHandler(async (req, res) => {
  let review = await Review.findById(req.params.id)


if (!review) {
 res.status(404);
 throw new Error(`No review with the id of ${req.params.id}`);
}

//  Make sure review belongls to user or user is an admin
if(review.user.toString() !== req.user.id && req.user.role !== 'admin') {
 res.status(401);
 throw new Error(`Not authorized to update review`);
}

 await review.remove();
res.status(200).json({
 success: true,
 data: {},
});
});

export { getReviews, getReview, addReview, updateReview, deleteReview };
