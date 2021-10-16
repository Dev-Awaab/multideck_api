import mongoose from 'mongoose'

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required:   true,
        unique: true,
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// Cascade delete  services when a category is deleted 
CategorySchema.pre('remove', async function(next) {
    console.log(`Service being removed from category ${this._id }`)
    await this.model('Service').deleteMany({ category: this._id})
    next();
})
// Reverse populate with virtuals
CategorySchema.virtual('services', {
    ref: 'Service',
    localField: '_id',
    foreignField: 'category',
    justOne: false  
})

const Category = mongoose.model('Category', CategorySchema);

export default Category;