# Umbrella Security Scanner Backend

This document provides instructions for setting up the backend server for the Umbrella Security Scanner Chrome extension.

## Backend Architecture

The backend server is responsible for:

1. Receiving website content from the Chrome extension
2. Making API calls to AI services (Gemini, Deepseek, etc.)
3. Processing AI responses and determining security risk levels
4. Returning analysis results to the extension

## Technology Stack Options

### Option 1: Node.js/Express (Recommended for JavaScript consistency)

#### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (optional, for storing scan history)

#### Basic Structure
```
umbrella-backend/
├── src/
│   ├── controllers/
│   │   └── scanController.js
│   ├── services/
│   │   ├── aiService.js
│   │   ├── geminiService.js
│   │   └── deepseekService.js
│   ├── utils/
│   │   └── securityUtils.js
│   ├── routes/
│   │   └── apiRoutes.js
│   └── app.js
├── .env
├── package.json
└── README.md
```

#### Sample Implementation

1. Create a new Node.js project:
```bash
mkdir umbrella-backend
cd umbrella-backend
npm init -y
npm install express cors dotenv axios
```

2. Create an `.env` file:
```
PORT=3000
GEMINI_API_KEY=your_gemini_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
```

3. Basic Express server (`app.js`):
```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/apiRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api', apiRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

4. Deploy to a cloud provider:
   - Heroku
   - Vercel
   - Netlify
   - AWS Lambda
   - Google Cloud Functions

### Option 2: Python/FastAPI (Good for AI/ML tasks)

#### Prerequisites
- Python 3.8+
- pip
- Virtual environment tool (venv, conda)

#### Basic Structure
```
umbrella-backend/
├── app/
│   ├── api/
│   │   └── endpoints/
│   │       └── scan.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── services/
│   │   ├── ai_service.py
│   │   ├── gemini_service.py
│   │   └── deepseek_service.py
│   └── main.py
├── .env
├── requirements.txt
└── README.md
```

#### Sample Implementation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install fastapi uvicorn python-dotenv httpx
```

3. Create `requirements.txt`:
```
fastapi>=0.68.0
uvicorn>=0.15.0
python-dotenv>=0.19.0
httpx>=0.20.0
```

4. Deploy to a cloud provider:
   - Heroku
   - AWS Lambda
   - Google Cloud Run
   - Digital Ocean App Platform

## API Endpoints

Implement the following API endpoints:

### 1. Analyze Website Content

```
POST /api/analyze
```

Request Body:
```json
{
  "content": {
    "url": "https://example.com",
    "title": "Example Website",
    "text": "Website content text...",
    "links": ["https://example.com/page1", "https://example.com/page2"],
    "metadata": {
      "description": "Website description"
    }
  },
  "config": {
    "provider": "gemini"
  }
}
```

Response:
```json
{
  "url": "https://example.com",
  "risk": "low",
  "timestamp": 1651234567890,
  "reasons": ["Suspicious links detected", "Known scam patterns found"],
  "confidenceScore": 0.85
}
```

### 2. Health Check

```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

## Security Considerations

1. **API Key Management**:
   - Store API keys in environment variables
   - Use a secure key management service (AWS KMS, Google Secret Manager)
   - Never expose API keys in client-side code

2. **Rate Limiting**:
   - Implement rate limiting to prevent abuse
   - Monitor API usage to avoid exceeding quotas

3. **Error Handling**:
   - Implement robust error handling
   - Provide meaningful error messages
   - Log errors for debugging

4. **CORS Configuration**:
   - Set up CORS to only allow requests from your extension

## Monitoring and Maintenance

1. **Logging**:
   - Implement logging for API requests and responses
   - Monitor for unusual patterns or errors

2. **Performance Monitoring**:
   - Track response times
   - Implement caching for frequent requests

3. **Updates**:
   - Keep dependencies updated
   - Monitor for changes in AI service APIs 