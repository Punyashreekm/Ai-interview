#!/bin/bash

echo "🚀 Setting up AI-Powered Interview Prep App..."

# Setup Backend
echo "📦 Installing backend dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed"

# Setup Frontend
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up your environment variables:"
echo "   - Copy backend/env.example to backend/.env"
echo "   - Copy frontend/.env.example to frontend/.env"
echo "   - Fill in your API keys and database URLs"
echo ""
echo "2. Start the backend:"
echo "   cd backend && npm run dev"
echo ""
echo "3. Start the frontend (in a new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "Happy coding! 🎯"
