import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User as UserIcon, AlertCircle, ArrowLeft, Key } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Reset theme class for admin pages
  useEffect(() => {
    document.body.className = '';
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.msg || data.msg || 'Invalid Credentials');
      }

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_username', data.username);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Setup failed');
      }

      setMessage(data.msg);
      setIsSetupMode(false);
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="back-home-box">
        <button onClick={() => navigate('/')} className="btn-back">
          <ArrowLeft size={16} />
          <span>Back to Salon</span>
        </button>
      </div>

      <div className="login-card glass-panel">
        <div className="login-icon">
          {isSetupMode ? <Key size={28} /> : <Lock size={28} />}
        </div>
        
        <h2>{isSetupMode ? 'Create Admin Account' : 'Admin Portal'}</h2>
        <p className="login-subtitle">
          {isSetupMode 
            ? 'Setup initial administrator username and password' 
            : 'Enter credentials to manage photos and video reels'}
        </p>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="alert alert-success">
            <AlertCircle size={18} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={isSetupMode ? handleSetup : handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <UserIcon size={18} className="input-icon" />
              <input 
                type="text" 
                id="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-gold w-full login-submit" disabled={loading}>
            {loading ? 'Processing...' : (isSetupMode ? 'Create Account' : 'Login')}
          </button>
        </form>

        <div className="login-footer">
          {isSetupMode ? (
            <button className="toggle-mode-btn" onClick={() => setIsSetupMode(false)}>
              Back to Login
            </button>
          ) : (
            <button className="toggle-mode-btn" onClick={() => setIsSetupMode(true)}>
              First-Time User? Setup Admin
            </button>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .login-container {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-primary);
          padding: 20px;
          position: relative;
        }

        .back-home-box {
          position: absolute;
          top: 30px;
          left: 5%;
        }

        .btn-back {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: var(--transition-smooth);
        }

        .btn-back:hover {
          color: var(--gold-primary);
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          padding: 3rem 2.5rem;
          text-align: center;
          border-color: rgba(197, 168, 128, 0.2);
        }

        .login-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--accent-glow);
          color: var(--gold-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem auto;
        }

        .login-card h2 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 0.85rem;
          text-align: left;
          margin-bottom: 1.5rem;
        }

        .alert-error {
          background-color: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .alert-success {
          background-color: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .login-form {
          text-align: left;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 6px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .input-wrapper input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px;
          padding: 12px 14px 12px 42px;
          color: #ffffff;
          font-size: 0.95rem;
          font-family: var(--font-sans);
          transition: var(--transition-smooth);
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: var(--gold-primary);
          background: rgba(255,255,255,0.05);
        }

        .login-submit {
          margin-top: 1rem;
          padding: 12px;
          justify-content: center;
        }

        .login-footer {
          margin-top: 1.5rem;
        }

        .toggle-mode-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .toggle-mode-btn:hover {
          color: var(--gold-primary);
          text-decoration: underline;
        }

        .w-full {
          width: 100%;
        }
      `}} />
    </div>
  );
}
