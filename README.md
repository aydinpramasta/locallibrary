<h1 style="text-align: center;">LocalLibrary</h1>

## Prerequisites

- Git
- Node.js v18+
- NPM v9+
- MongoDB

## Production Deployment Guide

```bash
# Clone repository
git clone https://github.com/aydinpramasta/locallibrary.git

# Change directory
cd locallibrary

# Install dependencies (without dev)
npm install --omit=dev

# Create .env and enter mongodb url
echo "MONGODB_URL=mongodb://localhost/learn_expressjs" > .env

# Start the application
npm run start
```
