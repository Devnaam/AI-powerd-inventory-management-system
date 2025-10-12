const express = require('express');
const axios = require('axios');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001';

// @desc    Ask AI Assistant
// @route   POST /api/ai/ask
// @access  Private
const askAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    // Get user's JWT token
    const token = req.headers.authorization?.split(' ')[1];

    // Forward request to Python AI service
    const aiResponse = await axios.post(
      `${AI_SERVICE_URL}/chat`,
      {
        message: message,
        token: token
      },
      {
        timeout: 30000 // 30 second timeout
      }
    );

    res.status(200).json({
      success: true,
      data: {
        answer: aiResponse.data.answer,
        metadata: aiResponse.data.data
      }
    });

  } catch (error) {
    console.error('AI Service Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        success: false, 
        message: 'AI service is unavailable. Please try again later.' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.detail || 'AI processing failed' 
    });
  }
};

router.post('/ask', protect, askAI);

module.exports = router;
