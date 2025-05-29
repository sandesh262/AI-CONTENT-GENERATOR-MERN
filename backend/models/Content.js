const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  templateSlug: {
    type: String,
    required: true
  },
  templateName: {
    type: String,
    required: true
  },
  formData: {
    type: Object,
    required: true
  },
  generatedContent: {
    type: String,
    required: true
  },
  charactersGenerated: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Content', ContentSchema);
