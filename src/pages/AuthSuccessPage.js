import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';

const AuthSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double execution in React StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const isNewUser = searchParams.get('isNewUser') === 'true';

    if (!accessToken) {
      navigate('/login', { replace: true });
      return;
    }

    // Save to localStorage FIRST before calling login()
    // This way ProtectedRoute finds the token immediately
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken || '');
    localStorage.setItem('user', JSON.stringify({
      name: decodeURIComponent(name || ''),
      email: decodeURIComponent(email || '')
    }));

    // Now call login to update React state
    login(
      {
        name: decodeURIComponent(name || ''),
        email: decodeURIComponent(email || '')
      },
      accessToken,
      refreshToken || ''
    );

    // Use replace so back button doesn't return to this page
    const destination = isNewUser ? '/onboarding' : '/dashboard';

    // Small timeout lets React state settle before navigation
    setTimeout(() => {
      navigate(destination, { replace: true });
    }, 100);

  }, [login, navigate, searchParams]); // Now includes appropriate deps

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050816',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24
    }}>
      {/* Logo */}
      <div style={{
        width: 64, height: 64,
        background: 'linear-gradient(135deg, #8B5CF6, #00E5FF)',
        borderRadius: 18,
        display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 40px rgba(139,92,246,0.4)'
      }}>
        <Sparkles size={30} color="white" />
      </div>

      {/* Spinner */}
      <div style={{
        width: 44, height: 44,
        border: '3px solid rgba(139,92,246,0.2)',
        borderTop: '3px solid #8B5CF6',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />

      <div style={{ textAlign: 'center' }}>
        <p style={{
          color: '#F5F5F5', fontSize: 16,
          fontWeight: 600, marginBottom: 6
        }}>
          Signing you in...
        </p>
        <p style={{ color: '#94A3B8', fontSize: 13 }}>
          Setting up your financial dashboard
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthSuccessPage;