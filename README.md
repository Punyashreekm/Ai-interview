# AI-Powered Interview Prep App

A full-stack application that helps job seekers practice interviews using AI. Users can upload their resume and job description, then chat with an AI interviewer that generates personalized questions and provides detailed feedback.

## Features

- **Authentication**: Secure signup/login with JWT tokens
- **Document Upload**: Drag-and-drop PDF upload for resume and job description
- **AI Chat**: Interactive interview practice with personalized questions
- **RAG Integration**: AI evaluates responses using document context
- **Real-time Feedback**: Scores and detailed feedback for each response
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

### Backend

- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- OpenAI API for AI features
- PDF parsing with pdf-parse
- Cloud storage (Cloudinary/AWS S3)
- bcrypt for password hashing

### Frontend

- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Redux Toolkit with RTK Query for state management and API calls
- React Hot Toast for notifications
- React Dropzone for file uploads

## Project Structure

```
ai/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   ├── utils/           # AI and utility functions
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   └── public/          # Static assets
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- OpenAI API key
- Cloud storage (Cloudinary or AWS S3)

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `env.example`:

```bash
cp env.example .env
```

4. Fill in your environment variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-prep
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_s3_bucket_name
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:3000
```

5. Start the server:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Documents

- `POST /api/documents/upload` - Upload PDF documents
- `GET /api/documents/list` - Get user's documents
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/check` - Check document status

### Chat

- `POST /api/chat/start` - Start new chat session
- `POST /api/chat/query` - Send message to AI
- `GET /api/chat/history/:sessionId` - Get chat history
- `GET /api/chat/sessions` - Get user's chat sessions

## Deployment

### Backend (Render/Vercel)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy with Node.js buildpack

### Frontend (Vercel/Netlify)

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Set environment variable: `REACT_APP_API_URL`

## Usage

1. **Sign Up**: Create an account with email and password
2. **Upload Documents**: Upload your resume and job description as PDF files
3. **Start Chat**: Begin AI-powered interview practice
4. **Get Feedback**: Receive scores and detailed feedback on your responses

## Features in Detail

### AI-Powered Question Generation

- Questions are generated based on the job description
- Personalized to match the specific role requirements

### RAG (Retrieval-Augmented Generation)

- AI uses both resume and job description context
- Provides relevant feedback based on your background
- Cites specific sections from your documents

### Real-time Scoring

- Each response gets a score from 1-10
- Detailed feedback with improvement suggestions
- Citation links to relevant document sections

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
