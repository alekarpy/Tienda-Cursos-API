import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  instructor: {
    type: String,
    required: false
  },
  duration: {
    type: Number, // in hours
    required: true
  },
  level: {
    type: String,
    enum: ['principiante', 'intermedio', 'avanzado'],
    required: true
  },
  image: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2023/12/15/17/09/ai-generated-8451031_1280.png'
  },
  students: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);