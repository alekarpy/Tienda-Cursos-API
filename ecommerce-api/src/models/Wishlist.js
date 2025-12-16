import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true  // unique: true ya crea un índice automáticamente
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }]
}, {
  timestamps: true
});

// No necesitamos índice explícito porque unique: true ya lo crea

export default mongoose.model('Wishlist', wishlistSchema);

