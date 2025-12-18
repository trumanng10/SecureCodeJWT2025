# JWT Token Lab 🔐

A comprehensive full-stack application demonstrating JWT (JSON Web Token) authentication with an interactive step-by-step guide to understand how JWT tokens work.

## 🎯 Features

- **Complete Authentication Flow**: Login, token generation, and verification
- **Interactive Dashboard**: Visual breakdown of JWT token structure
- **Step-by-Step Guide**: Learn how JWT authentication works in real-time
- **Token Decoder**: See the decoded header, payload, and signature
- **Protected Routes**: Demonstrate how JWT tokens secure API endpoints
- **Token Refresh**: Refresh expired tokens without re-authentication
- **Modern UI**: Beautiful, responsive design with React and CSS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## 🚀 Quick Start

### 1. Clone or Navigate to the Project

```bash
cd c:\Users\nyeng\Desktop\JWT_Token_Lab
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Start the Backend Server

Open a terminal and run:

```bash
cd backend
npm start
```

The backend server will start on **http://localhost:5000**

### 5. Start the Frontend Application

Open a **new terminal** and run:

```bash
cd frontend
npm start
```

The frontend will start on **http://localhost:3000** and automatically open in your browser.

## 🔑 Demo Credentials

Use these credentials to log in:

- **Username**: `demo` or `admin`
- **Password**: `password123`

## 📚 Understanding JWT Authentication

### What is JWT?

JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties. It's commonly used for authentication and information exchange.

### JWT Structure

A JWT consists of three parts separated by dots (`.`):

```
xxxxx.yyyyy.zzzzz
```

1. **Header**: Contains the token type (JWT) and signing algorithm (e.g., HS256)
2. **Payload**: Contains the claims (user data and metadata)
3. **Signature**: Ensures the token hasn't been tampered with

### How It Works (Step-by-Step)

#### Step 1: User Login
- User submits username and password
- Server verifies credentials against the database

#### Step 2: Token Generation
- Server creates a JWT token containing user information
- Token is signed with a secret key
- Token is sent back to the client

#### Step 3: Token Storage
- Client stores the token (usually in localStorage)
- Token is included in subsequent requests

#### Step 4: Token Verification
- Server receives requests with the token
- Server verifies the token signature
- If valid, server processes the request

#### Step 5: Protected Access
- Client can access protected resources
- Token must be included in the Authorization header

## 🛠️ API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login and receive JWT token |

### Protected Endpoints (Require JWT Token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/verify` | Verify if token is valid |
| GET | `/api/profile` | Get user profile |
| GET | `/api/protected` | Access protected resource |
| POST | `/api/refresh` | Refresh JWT token |
| GET | `/api/decode-token` | Decode and analyze token |

## 🔍 Exploring the Application

### 1. Login Page
- Enter credentials (demo/password123)
- Observe the authentication process
- Token is generated and stored

### 2. Dashboard
- **User Information**: See your decoded user data
- **JWT Token Display**: View the raw token and its three parts
- **Step-by-Step Guide**: Interactive guide explaining the authentication flow
- **Decoded Token**: See the decoded header, payload, and signature
- **Protected Resource**: Test accessing protected data

### 3. Token Operations

#### View Token
Click the eye icon to show/hide the full token

#### Copy Token
Click the copy icon to copy the token to clipboard

#### Refresh Token
Click the refresh icon to generate a new token

#### Decode Token
The token is automatically decoded to show:
- **Header**: Algorithm and token type
- **Payload**: User data, issued at (iat), expires at (exp)
- **Signature**: Cryptographic signature

### 4. Testing Protected Routes

Click "Fetch Protected Data" to see how the token is used to access protected resources.

## 🔐 Security Best Practices

This is a **demo application**. In production, you should:

1. **Use HTTPS**: Always transmit tokens over secure connections
2. **Strong Secret Keys**: Use long, random secret keys
3. **Short Expiration Times**: Set reasonable token expiration times
4. **Refresh Tokens**: Implement refresh token rotation
5. **Secure Storage**: Consider using httpOnly cookies instead of localStorage
6. **Input Validation**: Validate and sanitize all user inputs
7. **Rate Limiting**: Implement rate limiting on authentication endpoints
8. **Password Hashing**: Use bcrypt or similar for password hashing (partially implemented)

## 📁 Project Structure

```
JWT_Token_Lab/
├── backend/
│   ├── server.js          # Express server with JWT logic
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js      # Login component
│   │   │   ├── Login.css
│   │   │   ├── Dashboard.js  # Main dashboard
│   │   │   └── Dashboard.css
│   │   ├── App.js            # Main app component
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json          # Frontend dependencies
└── README.md
```

## 🧪 Testing the API with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"demo\",\"password\":\"password123\"}"
```

### Access Protected Route
```bash
curl -X GET http://localhost:5000/api/protected \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Decode Token
```bash
curl -X GET http://localhost:5000/api/decode-token \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🎓 Learning Resources

- [JWT.io](https://jwt.io/) - JWT debugger and documentation
- [RFC 7519](https://tools.ietf.org/html/rfc7519) - JWT specification
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)

## 🐛 Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:
- Change the PORT in `backend/.env`
- Frontend will automatically use the next available port

### CORS Issues
The backend is configured to accept requests from any origin. In production, restrict this to your frontend domain.

### Token Expired
Tokens expire after 1 hour by default. Click the refresh button or log in again.

## 📝 Environment Variables

Edit `backend/.env` to customize:

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=1h
```

## 🤝 Contributing

This is a learning project. Feel free to:
- Add more features
- Improve the UI
- Add more authentication methods
- Implement a real database

## 📄 License

This project is open source and available for educational purposes.

## 🎉 Next Steps

1. **Explore the Code**: Read through the backend and frontend code
2. **Modify Token Expiration**: Change `JWT_EXPIRES_IN` in `.env`
3. **Add More Users**: Modify the users array in `server.js`
4. **Implement Database**: Replace the in-memory users array with a real database
5. **Add More Protected Routes**: Create additional protected endpoints
6. **Implement Refresh Tokens**: Add a separate refresh token mechanism

---

**Happy Learning! 🚀**

For questions or issues, review the code comments and console logs for detailed information about the JWT authentication flow.
