require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const users = [
  {
    id: 1,
    username: 'demo',
    password: '$2a$10$8K1p/a0dL3LzZLLLLLLLLOeRhkIGnuPNv8b4JU4wvjhm5xQ5xQ5xQ',
    email: 'demo@example.com',
    role: 'user'
  },
  {
    id: 2,
    username: 'admin',
    password: '$2a$10$8K1p/a0dL3LzZLLLLLLLLOeRhkIGnuPNv8b4JU4wvjhm5xQ5xQ5xQ',
    email: 'admin@example.com',
    role: 'admin'
  }
];

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      email,
      role: 'user'
    };

    users.push(newUser);

    res.status(201).json({ 
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = password === 'password123';
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const tokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const decoded = jwt.decode(token, { complete: true });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      tokenInfo: {
        header: decoded.header,
        payload: decoded.payload,
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/verify', authenticateToken, (req, res) => {
  res.json({
    message: 'Token is valid',
    user: req.user
  });
});

app.get('/api/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  });
});

app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'This is protected data',
    data: {
      secretInfo: 'You can only see this with a valid JWT token!',
      timestamp: new Date().toISOString(),
      user: req.user
    }
  });
});

app.post('/api/refresh', authenticateToken, (req, res) => {
  const tokenPayload = {
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role
  };

  const newToken = jwt.sign(
    tokenPayload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.json({
    message: 'Token refreshed successfully',
    token: newToken
  });
});

app.get('/api/decode-token', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'Token required' });
  }

  try {
    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded) {
      return res.status(400).json({ message: 'Invalid token format' });
    }

    jwt.verify(token, process.env.JWT_SECRET);

    res.json({
      header: decoded.header,
      payload: decoded.payload,
      signature: token.split('.')[2],
      isValid: true
    });
  } catch (error) {
    const decoded = jwt.decode(token, { complete: true });
    res.json({
      header: decoded?.header,
      payload: decoded?.payload,
      signature: token.split('.')[2],
      isValid: false,
      error: error.message
    });
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'JWT Authentication API',
    endpoints: {
      'POST /api/register': 'Register a new user',
      'POST /api/login': 'Login and get JWT token',
      'GET /api/verify': 'Verify JWT token',
      'GET /api/profile': 'Get user profile (protected)',
      'GET /api/protected': 'Access protected resource',
      'POST /api/refresh': 'Refresh JWT token',
      'GET /api/decode-token': 'Decode and analyze JWT token'
    },
    credentials: {
      username: 'demo or admin',
      password: 'password123'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`\nTest credentials:`);
  console.log(`Username: demo or admin`);
  console.log(`Password: password123`);
});
