import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut, RefreshCw, Shield, Eye, EyeOff, Copy, Check } from 'lucide-react';
import './Dashboard.css';

function Dashboard({ token, user, onLogout, onTokenRefresh }) {
  const [decodedToken, setDecodedToken] = useState(null);
  const [showToken, setShowToken] = useState(false);
  const [protectedData, setProtectedData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const decodeToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/decode-token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDecodedToken(response.data);
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  };

  useEffect(() => {
    decodeToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchProtectedData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/protected', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProtectedData(response.data);
    } catch (error) {
      console.error('Failed to fetch protected data:', error);
    }
  };

  const handleRefreshToken = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/refresh', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onTokenRefresh(response.data.token, user);
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const steps = [
    {
      number: 1,
      title: "User Login",
      description: "You logged in with username and password. The server verified your credentials."
    },
    {
      number: 2,
      title: "JWT Token Generated",
      description: "The server created a JWT token containing your user information and signed it with a secret key."
    },
    {
      number: 3,
      title: "Token Structure",
      description: "JWT has 3 parts: Header (algorithm), Payload (user data), and Signature (verification)."
    },
    {
      number: 4,
      title: "Token Storage",
      description: "The token is stored in your browser's localStorage and sent with each request."
    },
    {
      number: 5,
      title: "Protected Access",
      description: "You can now access protected resources by including the token in the Authorization header."
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <Shield className="header-icon" size={32} />
          <div>
            <h1>JWT Token Dashboard</h1>
            <p>Welcome, <strong>{user?.username}</strong>!</p>
          </div>
        </div>
        <button onClick={onLogout} className="logout-button">
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="card step-guide">
          <h2>🔐 JWT Authentication Flow</h2>
          <div className="steps-container">
            {steps.map((step) => (
              <div 
                key={step.number}
                className={`step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                onClick={() => setCurrentStep(step.number)}
              >
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="step-navigation">
            <button 
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </button>
            <span>Step {currentStep} of {steps.length}</span>
            <button 
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              disabled={currentStep === steps.length}
            >
              Next
            </button>
          </div>
        </div>

        <div className="card user-info">
          <h2>👤 User Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">ID:</span>
              <span className="info-value">{user?.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Username:</span>
              <span className="info-value">{user?.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className="info-value badge">{user?.role}</span>
            </div>
          </div>
        </div>

        <div className="card token-display">
          <div className="card-header">
            <h2>🎫 JWT Token</h2>
            <div className="button-group">
              <button onClick={() => setShowToken(!showToken)} className="icon-button">
                {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button onClick={() => copyToClipboard(token)} className="icon-button">
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
              <button onClick={handleRefreshToken} className="icon-button">
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
          {showToken && (
            <div className="token-content">
              <code>{token}</code>
            </div>
          )}
          <div className="token-parts">
            <div className="token-part header">
              <strong>Header</strong>
              <code>{token.split('.')[0]}</code>
            </div>
            <div className="token-part payload">
              <strong>Payload</strong>
              <code>{token.split('.')[1]}</code>
            </div>
            <div className="token-part signature">
              <strong>Signature</strong>
              <code>{token.split('.')[2]}</code>
            </div>
          </div>
        </div>

        {decodedToken && (
          <div className="card decoded-token">
            <h2>🔍 Decoded Token</h2>
            
            <div className="decoded-section">
              <h3>Header</h3>
              <pre>{JSON.stringify(decodedToken.header, null, 2)}</pre>
            </div>

            <div className="decoded-section">
              <h3>Payload</h3>
              <pre>{JSON.stringify(decodedToken.payload, null, 2)}</pre>
              <div className="payload-explanation">
                <p><strong>iat:</strong> Issued At - {formatTimestamp(decodedToken.payload.iat)}</p>
                <p><strong>exp:</strong> Expires At - {formatTimestamp(decodedToken.payload.exp)}</p>
              </div>
            </div>

            <div className="decoded-section">
              <h3>Signature</h3>
              <code className="signature-code">{decodedToken.signature}</code>
              <p className="signature-note">
                The signature is created by encoding the header and payload with the secret key.
                This ensures the token hasn't been tampered with.
              </p>
            </div>

            <div className={`token-status ${decodedToken.isValid ? 'valid' : 'invalid'}`}>
              {decodedToken.isValid ? '✓ Token is valid' : '✗ Token is invalid or expired'}
            </div>
          </div>
        )}

        <div className="card protected-resource">
          <h2>🛡️ Protected Resource</h2>
          <p>Click the button below to fetch data from a protected endpoint that requires a valid JWT token.</p>
          <button onClick={fetchProtectedData} className="fetch-button">
            Fetch Protected Data
          </button>
          {protectedData && (
            <div className="protected-data">
              <h3>{protectedData.message}</h3>
              <pre>{JSON.stringify(protectedData.data, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
