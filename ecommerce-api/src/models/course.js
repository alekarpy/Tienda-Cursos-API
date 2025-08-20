import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
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
    price: {
        type: Number,
        required: true,
        min: 1,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    imagesUrl: [{
        type: String,
        default: 'https://placehold.co/800x600.png',
        trim: true,
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
});

const Course = mongoose.model('Course', courseSchema);

export default Course

