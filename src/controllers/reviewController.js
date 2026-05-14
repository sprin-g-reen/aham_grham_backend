import Review from '../models/Review.js';
import Product from '../models/Product.js';

// Get all reviews (with optional product filter)
export const getReviews = async (req, res) => {
  try {
    const { productId } = req.query;
    const filter = productId ? { product: productId } : {};
    const reviews = await Review.find(filter).populate('product', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new review
export const createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update review status (approve/reject)
export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    const review = await Review.findByIdAndUpdate(id, { isApproved }, { new: true });
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
