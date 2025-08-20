import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },
    imageURL: {
        type: String,
        trim: true,
        default: 'https://cdn.pixabay.com/photo/2016/02/22/17/10/bible-1216063_1280.jpg',
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
    },

    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null,
    }
});

const Category = mongoose.model('Category', categorySchema);

export default Category;