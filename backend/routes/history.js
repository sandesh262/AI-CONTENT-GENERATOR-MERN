const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const { protect } = require('../middleware/auth');

// @route   GET /api/history
// @desc    Get user's content generation history
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [content, total] = await Promise.all([
      Content.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Content.countDocuments({ user: req.user._id })
    ]);

    res.json({
      success: true,
      data: content,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/history/:id
// @desc    Get single content item
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
