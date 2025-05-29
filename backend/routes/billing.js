const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Plan details
const plans = {
  premium: {
    id: 'premium',
    name: 'Premium Plan',
    price: 999, // in INR
    credits: 2000000,
    features: [
      '2 Million characters per month',
      'Access to all templates',
      'Priority support'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 2499, // in INR
    credits: 5000000,
    features: [
      '5 Million characters per month',
      'Access to all templates',
      'Priority support',
      'Custom templates'
    ]
  }
};

// @route   GET /api/billing/plans
// @desc    Get available plans
// @access  Public
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    plans
  });
});

// @route   POST /api/billing/create-order
// @desc    Create payment order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const { planId } = req.body;
    
    if (!planId || !plans[planId]) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected' });
    }
    
    const plan = plans[planId];
    
    const options = {
      amount: plan.price * 100, // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `order_${Date.now()}_${req.user._id}`,
      notes: {
        userId: req.user._id.toString(),
        planId: planId
      }
    };
    
    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/billing/verify-payment
// @desc    Verify payment and update user plan
// @access  Private
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;
    
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
    
    // Payment is verified, update user plan
    const plan = plans[planId];
    
    const user = await User.findById(req.user._id);
    user.plan = planId;
    user.usageCredits = plan.credits;
    user.maxCredits = plan.credits;
    await user.save();
    
    res.json({
      success: true,
      message: 'Payment successful and plan updated',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        usageCredits: user.usageCredits,
        maxCredits: user.maxCredits
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
