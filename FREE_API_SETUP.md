# Free API Setup Guide

## Option 1: Hugging Face (Recommended - Free)

1. **Sign up for Hugging Face**: Go to [huggingface.co](https://huggingface.co) and create a free account
2. **Get API Token**:
   - Go to Settings → Access Tokens
   - Create a new token with "Read" permissions
   - Copy the token
3. **Add to .env file**:
   ```
   HUGGING_FACE_API_KEY=your_token_here
   ```

## Option 2: OpenAI with Free Credits

1. **Sign up for OpenAI**: Go to [platform.openai.com](https://platform.openai.com)
2. **Add Payment Method**: Even with free credits, you need to add a payment method
3. **Get API Key**: Go to API Keys section and create a new key
4. **Add to .env file**:
   ```
   OPENAI_API_KEY=your_openai_key_here
   ```

## Option 3: Local Models (Advanced)

For completely free operation, you can run models locally using:

- **Ollama**: Run models like Llama 2 locally
- **Transformers.js**: Run models in the browser
- **ONNX Runtime**: Run optimized models

## Current Setup

The application now has automatic fallback:

1. **Primary**: OpenAI API (if you have credits)
2. **Fallback**: Hugging Face API (free)
3. **Final Fallback**: Default responses (no API needed)

## Quick Start (No API Keys Required)

You can run the application without any API keys - it will use default responses for AI functionality.

## File Storage Options

1. **Cloudinary** (Recommended): Free tier available
2. **Local Storage**: Files stored in `backend/uploads/` folder
3. **AWS S3**: If you have an AWS account

## Getting Started

1. Copy `backend/env.example` to `backend/.env`
2. Add your MongoDB connection string
3. Optionally add API keys for enhanced functionality
4. Run `npm install` in both frontend and backend folders
5. Start the backend: `cd backend && npm run dev`
6. Start the frontend: `cd frontend && npm run dev`
