import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sparkles, TrendingUp, Shield, Brain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await authAPI.login(formData);

      // Handle refresh token system
      login(
        data.user || { name: data.name, email: data.email, _id: data._id },
        data.accessToken || data.token,
        data.refreshToken || ''
      );

      navigate('/dashboard');

    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';

      // Handle unverified email
      if (err.response?.data?.requiresVerification) {
        navigate('/verify-otp', { state: { email: formData.email } });
        return;
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#050816'
    }}>

      {/* Left side — showcase */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(0,229,255,0.05))',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 60,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '30%',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 10, marginBottom: 60
        }}>
          <div style={{
            width: 44, height: 44,
            background: 'linear-gradient(135deg, #8B5CF6, #00E5FF)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={22} color="white" />
          </div>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#F5F5F5' }}>
            Fin<span style={{ color: '#8B5CF6' }}>Genie</span>
          </span>
        </div>

        {/* Financial health score */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24, padding: 32,
          textAlign: 'center', marginBottom: 32,
          width: '100%', maxWidth: 320
        }}>
          {/* Score circle */}
          <div style={{
            width: 120, height: 120,
            borderRadius: '50%',
            background: 'conic-gradient(#8B5CF6 0deg 313deg, rgba(255,255,255,0.05) 313deg)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
            boxShadow: '0 0 40px rgba(139,92,246,0.3)'
          }}>
            <div style={{
              width: 96, height: 96,
              borderRadius: '50%',
              background: '#0D0D1A',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#F5F5F5' }}>87</span>
              <span style={{ fontSize: 10, color: '#94A3B8' }}>score</span>
            </div>
          </div>

          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
            Financial Health Score
          </div>
          <div style={{ fontSize: 13, color: '#00D26A', marginBottom: 12 }}>
            ✨ Excellent
          </div>
          <div style={{
            fontSize: 12, color: '#94A3B8',
            background: 'rgba(0,210,106,0.1)',
            border: '1px solid rgba(0,210,106,0.2)',
            borderRadius: 8, padding: '8px 12px'
          }}>
            Improved +14 points this month
          </div>
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
          {[
            { icon: <Brain size={16} color="#8B5CF6" />, text: 'AI learns your spending patterns' },
            { icon: <TrendingUp size={16} color="#00E5FF" />, text: 'Predicts your financial future' },
            { icon: <Shield size={16} color="#00D26A" />, text: 'Protects against overspending' }
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10, padding: '10px 14px'
            }}>
              {item.icon}
              <span style={{ fontSize: 13, color: '#94A3B8' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right side — login form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          width: 480,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 50px'
        }}
      >
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 15, color: '#94A3B8' }}>
            Your financial future is waiting
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            background: 'rgba(255,77,77,0.1)',
            border: '1px solid rgba(255,77,77,0.3)',
            borderRadius: 10, padding: '12px 16px',
            marginBottom: 24,
            fontSize: 14, color: '#FF4D4D'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              fontSize: 13, fontWeight: 500,
              color: '#94A3B8', marginBottom: 8,
              display: 'block'
            }}>
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="meet@example.com"
              className="input-dark"
              required
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 32 }}>
            <label style={{
              fontSize: 13, fontWeight: 500,
              color: '#94A3B8', marginBottom: 8,
              display: 'block'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input-dark"
                style={{ paddingRight: 48 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 14, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: '#94A3B8',
                  display: 'flex', alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: 16,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Signing in...' : 'Continue Journey'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 16, margin: '24px 0'
        }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ fontSize: 13, color: '#94A3B8' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Google login */}
        <button
          onClick={handleGoogleLogin}
          className="btn-secondary"
          style={{
            width: '100%', padding: '14px',
            fontSize: 15,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 10
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        {/* Register link */}
        <p style={{
          textAlign: 'center', marginTop: 32,
          fontSize: 14, color: '#94A3B8'
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{
            color: '#8B5CF6', fontWeight: 600,
            textDecoration: 'none'
          }}>
            Start your journey
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;