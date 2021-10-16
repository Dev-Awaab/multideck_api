import mongoose from 'mongoose'

const ServiceSchema = mongoose.Schema({
     title: {
         type: String,
         trim: true,
         required: [true, 'Please add your service'],
     },
     description: {
         type: String,
         required: [true, 'Please add a description']
     },
     price:{
         type:Number,
         required: [true, 'Please add your service cost']
     },
     photo: {
        type: String,
        default: 'no-photo.jpg'
    },
     skillLevel: {
         type: String,
         enum: ['intermediate', 'Professional'],
         required: [true, 'Please add your skill level'],
         default: 'intermediate'
     },
     duration: {
         type: String,
         required: [true, 'Please add a duration for completing your service']
     },
     category: {
         type: mongoose.Schema.ObjectId,
         ref: 'Category',
         required: true
     },
     user:{
         type: mongoose.Schema.ObjectId,
         ref: 'User',
         required: true
     }
}, {
    timestamps: true
})

const Service = mongoose.model('Service', ServiceSchema)

export default Service 