# JWT Authentication - Complete Step-by-Step Guide 🎓

## Table of Contents
1. [What is JWT?](#what-is-jwt)
2. [JWT Structure Explained](#jwt-structure-explained)
3. [Authentication Flow](#authentication-flow)
4. [Hands-On Exploration](#hands-on-exploration)
5. [Security Considerations](#security-considerations)

---

## What is JWT?

**JWT (JSON Web Token)** is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object.

### Key Characteristics:
- **Compact**: Small size, can be sent through URL, POST parameter, or HTTP header
- **Self-contained**: Contains all necessary information about the user
- **Secure**: Digitally signed to verify authenticity

### When to Use JWT:
- **Authentication**: Most common use case
- **Information Exchange**: Securely transmit information between parties
- **Stateless Sessions**: No need to store session data on the server

---

## JWT Structure Explained

A JWT consists of three parts separated by dots (`.`):

```
HEADER.PAYLOAD.SIGNATURE
```

### 1. Header

The header typically consists of two parts:
- Token type (JWT)
- Signing algorithm (e.g., HMAC SHA256 or RSA)

**Example:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

This JSON is **Base64Url encoded** to form the first part of the JWT.

### 2. Payload

The payload contains the claims. Claims are statements about an entity (typically, the user) and additional data.

**Types of Claims:**
- **Registered Claims**: Predefined claims (iss, exp, sub, aud)
- **Public Claims**: Custom claims defined by users
- **Private Claims**: Custom claims for sharing information

**Example:**
```json
{
  "id": 1,
  "username": "demo",
  "email": "demo@example.com",
  "role": "user",
  "iat": 1703001234,
  "exp": 1703004834
}
```

**Important Claims:**
- `iat` (Issued At): Timestamp when token was created
- `exp` (Expiration): Timestamp when token expires
- `sub` (Subject): User identifier
- `iss` (Issuer): Who issued the token

This JSON is also **Base64Url encoded** to form the second part of the JWT.

### 3. Signature

The signature is created by:
1. Taking the encoded header
2. Taking the encoded payload
3. Combining them with a dot (.)
4. Signing with the secret key using the algorithm specified in the header

**Formula:**
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

The signature ensures:
- The token hasn't been tampered with
- The token was issued by a trusted source

---

## Authentication Flow

### Step 1: User Login 🔑

**What Happens:**
1. User enters username and password
2. Frontend sends credentials to backend
3. Backend validates credentials

**Code Flow:**
```javascript
// Frontend sends:
POST /api/login
{
  "username": "demo",
  "password": "password123"
}
```

### Step 2: Token Generation 🎫

**What Happens:**
1. Server verifies credentials are correct
2. Server creates a payload with user information
3. Server signs the payload with a secret key
4. Server sends the token back to the client

**Code Flow:**
```javascript
// Backend creates token:
const token = jwt.sign(
  { id: user.id, username: user.username, email: user.email, role: user.role },
  SECRET_KEY,
  { expiresIn: '1h' }
);

// Backend responds:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### Step 3: Token Storage 💾

**What Happens:**
1. Frontend receives the token
2. Token is stored in localStorage (or sessionStorage/cookies)
3. Token is available for future requests

**Code Flow:**
```javascript
// Frontend stores:
localStorage.setItem('token', token);
```

### Step 4: Making Authenticated Requests 📡

**What Happens:**
1. Client includes token in Authorization header
2. Server receives request with token
3. Server verifies token signature
4. Server extracts user information from token
5. Server processes request if token is valid

**Code Flow:**
```javascript
// Frontend sends:
GET /api/protected
Headers: {
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Backend verifies:
jwt.verify(token, SECRET_KEY, (err, decoded) => {
  if (err) return res.status(403).json({ message: 'Invalid token' });
  // Token is valid, proceed with request
});
```

### Step 5: Token Expiration & Refresh 🔄

**What Happens:**
1. Token has an expiration time (exp claim)
2. After expiration, token becomes invalid
3. User must refresh token or log in again

**Code Flow:**
```javascript
// Check expiration:
const decoded = jwt.decode(token);
const isExpired = decoded.exp < Date.now() / 1000;

// Refresh token:
POST /api/refresh
Headers: { Authorization: "Bearer OLD_TOKEN" }
// Returns new token
```

---

## Hands-On Exploration

### Exercise 1: Inspect Your Token

1. **Log in** to the application
2. **Copy your token** from the dashboard
3. **Visit** [jwt.io](https://jwt.io)
4. **Paste** your token in the debugger
5. **Observe** the decoded header and payload

### Exercise 2: Decode Token Manually

```javascript
// In browser console:
const token = "YOUR_TOKEN_HERE";
const parts = token.split('.');

// Decode header
const header = JSON.parse(atob(parts[0]));
console.log('Header:', header);

// Decode payload
const payload = JSON.parse(atob(parts[1]));
console.log('Payload:', payload);

// Signature (can't decode without secret)
console.log('Signature:', parts[2]);
```

### Exercise 3: Test Token Expiration

1. **Log in** and get a token
2. **Wait** for the token to expire (or modify JWT_EXPIRES_IN to 10s)
3. **Try to access** protected data
4. **Observe** the error message
5. **Refresh** the token

### Exercise 4: Modify Token (Security Test)

1. **Copy your token**
2. **Decode** the payload
3. **Change** a value (e.g., role: "admin")
4. **Re-encode** and create a new token
5. **Try to use** the modified token
6. **Observe** that it fails (signature is invalid)

This demonstrates why the signature is crucial!

### Exercise 5: Test Protected Routes

```bash
# Without token (should fail)
curl http://localhost:5000/api/protected

# With token (should succeed)
curl http://localhost:5000/api/protected \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Security Considerations

### ✅ Best Practices

1. **Use HTTPS**: Always transmit tokens over encrypted connections
2. **Short Expiration**: Set reasonable expiration times (15min - 1hour)
3. **Secure Storage**: 
   - Use httpOnly cookies (prevents XSS)
   - Avoid localStorage for sensitive apps
4. **Strong Secrets**: Use long, random secret keys (256+ bits)
5. **Validate Everything**: Always verify token signature and claims
6. **Refresh Tokens**: Implement separate refresh tokens for long sessions

### ❌ Common Mistakes

1. **Storing Sensitive Data**: Don't put passwords or secrets in the payload
2. **Long Expiration**: Tokens that never expire are security risks
3. **Weak Secrets**: Short or predictable secret keys can be cracked
4. **No HTTPS**: Tokens can be intercepted over HTTP
5. **Client-Side Validation Only**: Always validate on the server

### 🛡️ Attack Vectors & Mitigations

#### 1. Token Theft (XSS)
**Attack**: Malicious script steals token from localStorage
**Mitigation**: Use httpOnly cookies, Content Security Policy

#### 2. Man-in-the-Middle (MITM)
**Attack**: Attacker intercepts token during transmission
**Mitigation**: Always use HTTPS

#### 3. Token Replay
**Attack**: Stolen token is used by attacker
**Mitigation**: Short expiration, token rotation, IP validation

#### 4. Brute Force Secret
**Attack**: Attacker tries to guess the secret key
**Mitigation**: Use strong, long secret keys (256+ bits)

---

## Advanced Topics

### Token Refresh Strategy

```javascript
// Implement automatic token refresh
const refreshToken = async () => {
  const response = await axios.post('/api/refresh', {}, {
    headers: { Authorization: `Bearer ${oldToken}` }
  });
  return response.data.token;
};

// Refresh before expiration
setInterval(() => {
  if (tokenExpiresIn < 5 * 60 * 1000) { // 5 minutes
    refreshToken();
  }
}, 60000); // Check every minute
```

### Blacklisting Tokens

```javascript
// Store revoked tokens (in production, use Redis)
const blacklist = new Set();

// Revoke token
app.post('/api/logout', authenticateToken, (req, res) => {
  blacklist.add(req.token);
  res.json({ message: 'Logged out' });
});

// Check blacklist
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (blacklist.has(token)) {
    return res.status(401).json({ message: 'Token revoked' });
  }
  // ... verify token
};
```

### Multiple Secret Keys (Key Rotation)

```javascript
const secrets = [
  { id: 1, key: 'current_secret', active: true },
  { id: 2, key: 'old_secret', active: false }
];

// Sign with active key
const activeSecret = secrets.find(s => s.active);
const token = jwt.sign(payload, activeSecret.key, { keyid: activeSecret.id });

// Verify with any key
const verify = (token) => {
  const decoded = jwt.decode(token, { complete: true });
  const secret = secrets.find(s => s.id === decoded.header.kid);
  return jwt.verify(token, secret.key);
};
```

---

## Quiz Yourself 🧠

1. What are the three parts of a JWT?
2. What algorithm is commonly used to sign JWTs?
3. Where should you store JWT tokens in a web application?
4. What happens if you modify the payload of a JWT?
5. What is the purpose of the `exp` claim?
6. Can you decode a JWT without the secret key?
7. Can you verify a JWT without the secret key?
8. What's the difference between authentication and authorization?

**Answers:**
1. Header, Payload, Signature
2. HMAC SHA256 (HS256) or RSA
3. httpOnly cookies (most secure) or localStorage (less secure)
4. The signature becomes invalid
5. Defines when the token expires
6. Yes, the payload is only Base64 encoded
7. No, you need the secret key to verify the signature
8. Authentication = who you are, Authorization = what you can do

---

## Resources 📚

- [JWT.io](https://jwt.io/) - Official JWT website
- [RFC 7519](https://tools.ietf.org/html/rfc7519) - JWT specification
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [Auth0 JWT Handbook](https://auth0.com/resources/ebooks/jwt-handbook)

---

**Congratulations!** 🎉 You now understand how JWT authentication works. Continue exploring the application and experimenting with the code to deepen your understanding.
