const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Validate Razorpay environment variables
const validateRazorpayConfig = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!keyId || !keySecret) {
    console.error('Razorpay configuration is missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env file.');
    return false;
  }
  return true;
};

// Initialize Razorpay
let razorpay;
if (validateRazorpayConfig()) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

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
  // Check if Razorpay is configured
  const isRazorpayConfigured = validateRazorpayConfig();
  
  res.json({
    success: true,
    plans,
    razorpayKey: process.env.RAZORPAY_KEY_ID, // Sending the key to frontend
    paymentEnabled: isRazorpayConfigured // Indicate if payment is enabled
  });
});

// @route   GET /api/billing/payment-status
// @desc    Check if payment gateway is configured
// @access  Public
router.get('/payment-status', (req, res) => {
  const isConfigured = validateRazorpayConfig();
  
  res.json({
    success: true,
    paymentEnabled: isConfigured,
    message: isConfigured ? 'Payment gateway is configured' : 'Payment gateway is not configured'
  });
});

// @route   POST /api/billing/create-order
// @desc    Create payment order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    // Check if Razorpay is configured
    if (!validateRazorpayConfig()) {
      return res.status(503).json({ 
        success: false, 
        message: 'Payment service is currently unavailable. Please contact support.'
      });
    }
    
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
    
    try {
      const order = await razorpay.orders.create(options);
      
      res.json({
        success: true,
        order
      });
    } catch (razorpayError) {
      console.error('Razorpay API Error:', razorpayError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create payment order. Please try again later.',
        error: razorpayError.message
      });
    }
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
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
