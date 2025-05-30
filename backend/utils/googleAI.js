const axios = require('axios');

/**
 * Custom implementation for Google AI API
 * This bypasses the GoogleGenerativeAI library to directly use the v1 endpoint
 */
class GoogleAI {
  constructor(apiKey) {
    // Hardcode the API key that worked in Postman
    this.apiKey = 'AIzaSyC9rWg3d1QowAJTf-7OSgyuBjSvW-ZZb6c';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1';
    console.log('Using hardcoded API key:', this.apiKey.substring(0, 5) + '...');
  }

  /**
   * Generate content using the Gemini model
   * @param {string} model - The model to use (e.g., 'gemini-1.5-flash')
   * @param {string} prompt - The text prompt to generate content from
   * @returns {Promise<string>} - The generated text
   */
  async generateContent(model, prompt) {
    try {
      // Make sure we have a valid API key
      if (!this.apiKey || this.apiKey === 'your_google_ai_api_key_here' || this.apiKey.includes('your_')) {
        console.log('Invalid API key detected:', this.apiKey);
        throw new Error('Invalid API key. Please set a valid GOOGLE_AI_API_KEY in your .env file');
      }
      
      // Log the URL we're about to call (masking most of the API key)
      const apiKeyForLogging = this.apiKey.substring(0, 5) + '...' + this.apiKey.substring(this.apiKey.length - 3);
      console.log(`Calling Google AI API with URL: ${this.baseUrl}/models/${model}:generateContent?key=${apiKeyForLogging}`);
      
      const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;
      
      const response = await axios.post(url, {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Extract the generated text from the response
      if (response.data && 
          response.data.candidates && 
          response.data.candidates[0] && 
          response.data.candidates[0].content && 
          response.data.candidates[0].content.parts && 
          response.data.candidates[0].content.parts[0]) {
        return response.data.candidates[0].content.parts[0].text;
      }
      
      throw new Error('Unexpected response format from Google AI API');
    } catch (error) {
      console.error('Google AI API Error:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
}

module.exports = GoogleAI;
