const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const User = require('../models/User');
const { protect, checkCredits } = require('../middleware/auth');
const GoogleAI = require('../utils/googleAI');

// Initialize our custom Google AI implementation with the API key from environment variables
const apiKey = process.env.GOOGLE_AI_API_KEY; // Using environment variable for security
const googleAI = new GoogleAI(apiKey);

// Log the API key being used (first 5 chars only for security)
console.log(`Using API key in content.js: ${apiKey ? apiKey.substring(0, 5) + '...' : 'undefined'}`);

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

    // Generate content with our custom Google AI implementation
    const generatedText = await googleAI.generateContent('gemini-1.5-flash', promptText);
    
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

// @route   POST /api/content/run-component
// @desc    Run a specific component with provided data
// @access  Private
router.post('/run-component', protect, checkCredits, async (req, res) => {
  try {
    const { templateSlug, templateName, formData, aiPrompt, componentType } = req.body;
    
    if (!templateSlug || !templateName || !formData || !aiPrompt) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Prepare base prompt with user inputs
    let promptText = aiPrompt;
    
    // Add form data to prompt
    Object.keys(formData).forEach(key => {
      promptText += `\n${key}: ${formData[key]}`;
    });
    
    // Enhance prompt based on component type if provided
    if (componentType) {
      switch (componentType) {
        case 'instagram-post':
          // Add Instagram-specific instructions
          promptText += '\n\nFormat as an Instagram post with engaging caption and relevant hashtags.';
          break;
          
        case 'blog-post':
          // Add blog-specific instructions
          promptText += '\n\nFormat as a complete blog post with introduction, body with subheadings, and conclusion.';
          break;
          
        case 'twitter-post':
          // Add Twitter-specific instructions
          promptText += '\n\nFormat as a concise Twitter post under 280 characters.';
          break;
          
        case 'seo-content':
          // Add SEO-specific instructions
          promptText += '\n\nOptimize for SEO with appropriate keyword density and meta description.';
          break;
      }
    }
    
    // Generate content with our custom Google AI implementation
    const generatedText = await googleAI.generateContent('gemini-1.5-flash', promptText);
    
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
    console.error('Error running component:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while running component',
      error: error.message
    });
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
