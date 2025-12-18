import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token verification failed:', error);
      handleLogout();
    }
  };

  const handleLogin = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard 
          token={token} 
          user={user} 
          onLogout={handleLogout}
          onTokenRefresh={handleLogin}
        />
      )}
    </div>
  );
}

export default App;
