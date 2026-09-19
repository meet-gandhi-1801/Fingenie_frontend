import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Shield, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get email from navigation state
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Redirect if no email
  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  const handleChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all 6 digits entered
    if (value && index === 5) {
      const fullOtp = [...newOtp].join('');
      if (fullOtp.length === 6) {
        handleVerify(fullOtp);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace — go to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      handleVerify(pasted);
    }
  };

  const handleVerify = async (otpCode) => {
    const code = otpCode || otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await authAPI.verifyOTP({ email, otp: code });

      setSuccess('Email verified! Setting up your account...');
      login(
        data.user || { name: data.name, email: data.email, _id: data._id },
        data.accessToken || data.token,
        data.refreshToken || ''
      );
      // Always go to onboarding after OTP verification
      setTimeout(() => navigate('/onboarding', { replace: true }), 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      // Clear OTP inputs on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      await authAPI.resendOTP({ email });
      setSuccess('New OTP sent to your email!');
      setCountdown(30);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050816',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Background glows */}
      <div style={{
        position: 'absolute', top: '20%', left: '30%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '25%',
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(0,229,255,0.08), transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          padding: '48px 40px',
          width: '100%',
          maxWidth: 440,
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >

        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          gap: 8, marginBottom: 32
        }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #8B5CF6, #00E5FF)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700 }}>
            Fin<span style={{ color: '#8B5CF6' }}>Genie</span>
          </span>
        </div>

        {/* Shield icon */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px rgba(139,92,246,0.3)',
              '0 0 40px rgba(139,92,246,0.5)',
              '0 0 20px rgba(139,92,246,0.3)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: 72, height: 72,
            background: 'rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}
        >
          <Shield size={32} color="#8B5CF6" />
        </motion.div>

        <h1 style={{
          fontSize: 26, fontWeight: 700,
          marginBottom: 8
        }}>
          Verify your identity
        </h1>

        <p style={{
          fontSize: 14, color: '#94A3B8',
          marginBottom: 8, lineHeight: 1.6
        }}>
          We sent a 6-digit code to
        </p>
        <p style={{
          fontSize: 14, fontWeight: 600,
          color: '#8B5CF6', marginBottom: 36
        }}>
          {email}
        </p>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255,77,77,0.1)',
              border: '1px solid rgba(255,77,77,0.3)',
              borderRadius: 10, padding: '10px 14px',
              marginBottom: 20,
              fontSize: 13, color: '#FF4D4D'
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Success message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(0,210,106,0.1)',
              border: '1px solid rgba(0,210,106,0.3)',
              borderRadius: 10, padding: '10px 14px',
              marginBottom: 20,
              fontSize: 13, color: '#00D26A'
            }}
          >
            {success}
          </motion.div>
        )}

        {/* OTP Input boxes */}
        <div style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'center',
          marginBottom: 32
        }}
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              style={{
                width: 52, height: 60,
                textAlign: 'center',
                fontSize: 24, fontWeight: 700,
                background: digit
                  ? 'rgba(139,92,246,0.15)'
                  : 'rgba(255,255,255,0.05)',
                border: digit
                  ? '2px solid rgba(139,92,246,0.6)'
                  : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                color: '#F5F5F5',
                outline: 'none',
                cursor: 'text',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, sans-serif',
                caretColor: '#8B5CF6'
              }}
              onFocus={e => {
                e.target.style.border = '2px solid #8B5CF6';
                e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.2)';
              }}
              onBlur={e => {
                e.target.style.border = digit
                  ? '2px solid rgba(139,92,246,0.6)'
                  : '1px solid rgba(255,255,255,0.1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          ))}
        </div>

        {/* Verify button */}
        <button
          onClick={() => handleVerify()}
          className="btn-primary"
          disabled={loading || otp.join('').length !== 6}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: 16,
            marginBottom: 20,
            opacity: (loading || otp.join('').length !== 6) ? 0.6 : 1,
            cursor: (loading || otp.join('').length !== 6)
              ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>

        {/* Resend OTP */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8
        }}>
          <span style={{ fontSize: 13, color: '#94A3B8' }}>
            Didn't receive the code?
          </span>
          {canResend ? (
            <button
              onClick={handleResend}
              style={{
                background: 'none', border: 'none',
                color: '#8B5CF6', fontSize: 13,
                fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <RotateCcw size={13} />
              Resend Code
            </button>
          ) : (
            <span style={{ fontSize: 13, color: '#94A3B8' }}>
              Resend in{' '}
              <span style={{ color: '#8B5CF6', fontWeight: 600 }}>
                {countdown}s
              </span>
            </span>
          )}
        </div>

        {/* Circular countdown */}
        {!canResend && (
          <div style={{ marginTop: 20 }}>
            <svg width="40" height="40" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="20" cy="20" r="16"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="3"
              />
              <circle
                cx="20" cy="20" r="16"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 16}`}
                strokeDashoffset={`${2 * Math.PI * 16 * (1 - countdown / 30)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
          </div>
        )}

        {/* Back to register */}
        <p style={{
          marginTop: 24,
          fontSize: 13, color: '#94A3B8'
        }}>
          Wrong email?{' '}
          <span
            onClick={() => navigate('/register')}
            style={{
              color: '#8B5CF6', cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Go back
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyOTPPage;