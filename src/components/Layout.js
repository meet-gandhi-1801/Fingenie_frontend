import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ArrowLeftRight, MessageSquare,
  Target, Lightbulb, Settings, LogOut,
  Sparkles, Menu, X, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const navItems = [
  { path: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { path: '/transactions', icon: <ArrowLeftRight size={18} />, label: 'Transactions' },
  { path: '/chat', icon: <MessageSquare size={18} />, label: 'AI Chat' },
  { path: '/goals', icon: <Target size={18} />, label: 'Goals' },
  { path: '/insights', icon: <Lightbulb size={18} />, label: 'Insights' },
];

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) await authAPI.logout({ refreshToken });
    } catch (err) {}
    logout();
    navigate('/login');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#050816'
    }}>

      {/* Sidebar */}
      <motion.div
        animate={{ width: sidebarOpen ? 240 : 70 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh'
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32,
                background: 'linear-gradient(135deg, #8B5CF6, #00E5FF)',
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Sparkles size={16} color="white" />
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, whiteSpace: 'nowrap' }}>
                Fin<span style={{ color: '#8B5CF6' }}>Genie</span>
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none', border: 'none',
              color: '#94A3B8', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              padding: 4, borderRadius: 6,
              marginLeft: sidebarOpen ? 0 : 'auto',
              marginRight: sidebarOpen ? 0 : 'auto'
            }}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, padding: '16px 12px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 12px',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: 4,
                  background: isActive
                    ? 'rgba(139,92,246,0.15)'
                    : 'transparent',
                  color: isActive ? '#8B5CF6' : '#94A3B8',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  borderLeft: isActive
                    ? '2px solid #8B5CF6'
                    : '2px solid transparent'
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#F5F5F5';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94A3B8';
                  }
                }}
              >
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Bottom — user + logout */}
        <div style={{
          padding: '16px 12px',
          borderTop: '1px solid rgba(255,255,255,0.06)'
        }}>
          {sidebarOpen && user && (
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: 10, padding: '10px 12px',
              marginBottom: 8,
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 10
            }}>
              <div style={{
                width: 32, height: 32,
                background: 'linear-gradient(135deg, #8B5CF6, #00E5FF)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                color: 'white', flexShrink: 0
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  fontSize: 13, fontWeight: 600,
                  color: '#F5F5F5',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {user.name}
                </div>
                <div style={{
                  fontSize: 11, color: '#94A3B8',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {user.email}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '11px 12px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              background: 'transparent',
              color: '#FF4D4D',
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,77,77,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>

        {/* Top navbar */}
        <div style={{
          padding: '16px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(5,8,22,0.8)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#F5F5F5' }}>
              {getGreeting()}, {user?.name?.split(' ')[0]} ✨
            </h2>
            <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Notification bell */}
            <button style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, padding: '8px 10px',
              cursor: 'pointer', color: '#94A3B8',
              display: 'flex', alignItems: 'center',
              position: 'relative'
            }}>
              <Bell size={18} />
              <div style={{
                position: 'absolute', top: 6, right: 6,
                width: 8, height: 8,
                background: '#FF4D4D',
                borderRadius: '50%',
                border: '1px solid #050816'
              }} />
            </button>

            {/* Avatar */}
            <div style={{
              width: 38, height: 38,
              background: 'linear-gradient(135deg, #8B5CF6, #00E5FF)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15, fontWeight: 700,
              color: 'white', cursor: 'pointer'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: '32px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;