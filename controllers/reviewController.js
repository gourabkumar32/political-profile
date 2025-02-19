const Review = require('../models/Review');
const MLA = require('../models/MLA');

exports.addReview = async (req, res) => {
  try {
    const { mlaId, rating, comment } = req.body;
    
    if (!mlaId || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const mla = await MLA.findById(mlaId);
    if (!mla) {
      return res.status(404).json({ message: 'MLA not found' });
    }

    const review = new Review({
      user: req.user.userId,
      mla: mlaId,
      rating: Number(rating),
      comment
    });

    await review.save();

    // Update MLA's average rating
    const allReviews = await Review.find({ mla: mlaId });
    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
    mla.rating = avgRating.toFixed(1);
    await mla.save();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Error adding review' });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { mlaId } = req.params;
    
    const mla = await MLA.findById(mlaId);
    if (!mla) {
      return res.status(404).json({ message: 'MLA not found' });
    }

    const reviews = await Review.find({ mla: mlaId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews,
      mla: {
        name: mla.name,
        constituency: mla.constituency
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching reviews',
      error: error.message 
    });
  }
};