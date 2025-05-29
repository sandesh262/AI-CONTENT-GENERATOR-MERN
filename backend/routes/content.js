const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Content = require('../models/Content');
const User = require('../models/User');
const { protect, checkCredits } = require('../middleware/auth');

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// @route   POST /api/content/generate
// @desc    Generate content using AI
// @access  Private
router.post('/generate', protect, checkCredits, async (req, res) => {
  try {
    const { templateSlug, templateName, formData, aiPrompt } = req.body;
    
    if (!templateSlug || !templateName || !formData || !aiPrompt) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Prepare prompt with user inputs
    let promptText = aiPrompt;
    
    // Add form data to prompt
    Object.keys(formData).forEach(key => {
      promptText += `\n${key}: ${formData[key]}`;
    });

    // Generate content with Google AI
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(promptText);
    const generatedText = result.response.text();
    
    // Calculate characters generated
    const charactersGenerated = generatedText.length;
    
    // Update user credits
    const user = await User.findById(req.user._id);
    user.usageCredits -= charactersGenerated;
    await user.save();

    // Save content to database
    const content = await Content.create({
      user: req.user._id,
      templateSlug,
      templateName,
      formData,
      generatedContent: generatedText,
      charactersGenerated
    });

    res.status(201).json({
      success: true,
      content: {
        _id: content._id,
        templateName: content.templateName,
        generatedContent: content.generatedContent,
        createdAt: content.createdAt
      },
      usageCredits: user.usageCredits,
      maxCredits: user.maxCredits
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/content/history
// @desc    Get user's content history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const contents = await Content.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: contents.length,
      contents
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/content/:id
// @desc    Get content by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    
    // Check if content belongs to user
    if (content.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    
    res.json({
      success: true,
      content
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
