import express from 'express';
import Service from '../models/serviceModel.js';
import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';
import path from 'path';

/**
 * @desc  Get Services
 * @route  GET -- /api/service
 * @route  GET -- /api/category/:categoryId/service
 * @access Public
 */

const getServices = asyncHandler(async (req, res) => {
  let query;

  if (req.params.categoryId) {
    query = Service.find({ category: req.params.categoryId });
  } else {
    query = Service.find({});
  }

  const services = await query;

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});

/**
 * @desc  Get a single Service
 * @route  GET -- /api/service/:id
 * @access Public
 */

const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).populate({
    path: 'category',
    select: 'name',
  });

  if (!service) {
    res.status(404);
    throw new Error(`The service with the id ${req.params.id} id not found`);
  }

  res.status(200).json({
    success: true,
    data: service,
  });
});

/**
 * @desc  Add Services
 * @route  POST -- /api/category/:categoryId/service
 * @access Public
 */
const addService = asyncHandler(async (req, res) => {
  //get category id and submit to the body field
  req.body.category = req.params.categoryId;
  // get user id and submit to the body field
  req.body.user = req.user.id;

  const category = await Category.findById(req.params.categoryId);

  if (!category) {
    res.status(404);
    throw new Error(`No category with the id of ${req.params.categoryId}`);
  }


  const service = await Service.create(req.body);

  res.status(200).json({
    success: true,
    data: service,
  });
});

/**
 * @desc  Update Services
 * @route  PUT -- /api/service/:id
 * @access Private/admin
 */
const updateService = asyncHandler(async (req, res) => {
  let service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error(`No category with the id of ${req.params.id}`);
  }

  // Make sure user is service owner
  if(service.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(401)
      throw new Error(`User ${req.user.id} is not authorized to update this service ${service._id}`)
  } 
    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

  res.status(200).json({
    success: true,
    data: service,
  });
});

/**
 * @desc  Delete Service
 * @route  DELETE -- /api/service/:id
 * @access Private/admin
 */
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error(`No category with the id of ${req.params.id}`);
  }

  // Make sure user is service owner
  if(service.user.toString() !== req.user.id && req.user.role !== 'admin')  {
    res.status(401)
    throw new Error(`User ${req.user.id} is not authorized to update this service ${service._id}`)
} 

  await service.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc  Upload a photo to a Service
 * @route  PUT -- /api/category/:id
 * @access Private/admin
 */
const servicePhotoUpload = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error(`No service with the id of ${req.params.id}`);
  }

  if (!req.files) {
    res.status(400);
    throw new Error(`Please upload a photo`);
  }

  const file = req.files.file;
  //   console.log(file.mimetype)

  if (!file.mimetype.startsWith('image')) {
    res.status(400);
    throw new Error(`Please upload an image}`);
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    res.status(400);
    throw new Error(
      `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}}`
    );
  }

  file.name = `photo_${service._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      res.status(500);
      throw new Error('Problem with file upload');
    }

    await Service.findById(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
export {
  getServices,
  addService,
  getService,
  updateService,
  deleteService,
  servicePhotoUpload,
};
