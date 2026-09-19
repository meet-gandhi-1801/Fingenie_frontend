import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, TrendingUp, Target,
  Shield, User, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // If Google user, skip name step
  const isGoogleUser = user?.email && !user?.needsName;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    monthlyIncome: '',
    occupation: '',
    goals: [] // multiple goals
  });
  const [loading, setLoading] = useState(false);

  const totalSteps = 4;

  const occupations = [
    '🎓 Student',
    '💼 Salaried Employee',
    '🏢 Self Employed',
    '💻 Freelancer',
    '🚀 Business Owner',
    '🎯 Other'
  ];

  const goals = [
    { icon: '🛡️', label: 'Emergency Fund' },
    { icon: '📈', label: 'Grow Investments' },
    { icon: '💳', label: 'Pay Off Debt' },
    { icon: '🏠', label: 'Save for Home' },
    { icon: '✈️', label: 'Travel Fund' },
    { icon: '🎓', label: 'Education Fund' },
    { icon: '🚗', label: 'Buy a Vehicle' },
    { icon: '💍', label: 'Wedding Fund' },
    { icon: '📱', label: 'Save for Gadget' },
    { icon: '🎯', label: 'General Savings' }
  ];

  const toggleGoal = (goalLabel) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalLabel)
        ? prev.goals.filter(g => g !== goalLabel)
        : [...prev.goals, goalLabel]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await api.put('/auth/update-profile', {
        name: formData.name,
        monthlyIncome: Number(formData.monthlyIncome) || 0,
        occupation: formData.occupation.replace(/^.+?\s/, ''), // remove emoji
        financialGoals: formData.goals
      });

      // Update user context with new name
      login(
        {
          ...user,
          name: formData.name,
          monthlyIncome: Number(formData.monthlyIncome) || 0
        },
        localStorage.getItem('accessToken'),
        localStorage.getItem('refreshToken')
      );

    } catch (err) {
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
      navigate('/dashboard', { replace: true });
    }
  };

  const stepVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 }
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
        position: 'absolute', top: '15%', left: '20%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '15%',
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(0,229,255,0.08), transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          padding: '48px 40px',
          width: '100%',
          maxWidth: 520,
          position: 'relative', zIndex: 1
        }}
      >
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center',
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
          <span style={{
            marginLeft: 'auto',
            fontSize: 12, color: '#94A3B8'
          }}>
            Step {step} of {totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 4,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 2,
          marginBottom: 36,
          overflow: 'hidden'
        }}>
          <motion.div
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #8B5CF6, #00E5FF)',
              borderRadius: 2
            }}
          />
        </div>

        {/* Step dots */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          gap: 8, marginBottom: 32
        }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{
              width: i + 1 === step ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i + 1 <= step
                ? 'linear-gradient(90deg, #8B5CF6, #00E5FF)'
                : 'rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease'
            }} />
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* STEP 1 — Name */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div style={{
                width: 56, height: 56,
                background: 'rgba(139,92,246,0.15)',
                border: '1px solid rgba(139,92,246,0.3)',
                borderRadius: 16,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: 20
              }}>
                <User size={26} color="#8B5CF6" />
              </div>

              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                What should we call you?
              </h2>
              <p style={{
                fontSize: 14, color: '#94A3B8',
                marginBottom: 28, lineHeight: 1.6
              }}>
                FinGenie will personalize your experience with your name.
              </p>

              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
                className="input-dark"
                style={{ fontSize: 16, height: 52, marginBottom: 28 }}
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter' && formData.name.trim()) setStep(2);
                }}
              />

              <button
                onClick={() => setStep(2)}
                className="btn-primary"
                disabled={!formData.name.trim()}
                style={{
                  width: '100%', padding: '14px',
                  fontSize: 15,
                  opacity: !formData.name.trim() ? 0.5 : 1,
                  cursor: !formData.name.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                Continue →
              </button>
            </motion.div>
          )}

          {/* STEP 2 — Income */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div style={{
                width: 56, height: 56,
                background: 'rgba(0,210,106,0.1)',
                border: '1px solid rgba(0,210,106,0.2)',
                borderRadius: 16,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: 20
              }}>
                <TrendingUp size={26} color="#00D26A" />
              </div>

              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                What's your monthly income?
              </h2>
              <p style={{
                fontSize: 14, color: '#94A3B8',
                marginBottom: 28, lineHeight: 1.6
              }}>
                Helps FinGenie give accurate savings and budget insights.
              </p>

              <div style={{ position: 'relative', marginBottom: 16 }}>
                <span style={{
                  position: 'absolute', left: 16,
                  top: '50%', transform: 'translateY(-50%)',
                  color: '#8B5CF6', fontSize: 18, fontWeight: 600
                }}>₹</span>
                <input
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={e => setFormData({
                    ...formData, monthlyIncome: e.target.value
                  })}
                  placeholder="50000"
                  className="input-dark"
                  style={{ paddingLeft: 36, fontSize: 18, height: 56 }}
                  autoFocus
                />
              </div>

              {/* Quick select amounts */}
              <div style={{
                display: 'flex', gap: 8,
                flexWrap: 'wrap', marginBottom: 28
              }}>
                {['15000', '25000', '50000', '75000', '100000', '150000'].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setFormData({ ...formData, monthlyIncome: amount })}
                    style={{
                      background: formData.monthlyIncome === amount
                        ? 'rgba(139,92,246,0.2)'
                        : 'rgba(255,255,255,0.05)',
                      border: formData.monthlyIncome === amount
                        ? '1px solid rgba(139,92,246,0.5)'
                        : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8,
                      padding: '7px 12px',
                      color: formData.monthlyIncome === amount
                        ? '#8B5CF6' : '#94A3B8',
                      fontSize: 12,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.2s'
                    }}
                  >
                    ₹{Number(amount).toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setStep(1)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '13px' }}
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="btn-primary"
                  style={{ flex: 2, padding: '13px', fontSize: 15 }}
                >
                  Continue →
                </button>
              </div>

              <button
                onClick={() => setStep(3)}
                style={{
                  background: 'none', border: 'none',
                  color: '#94A3B8', fontSize: 12,
                  cursor: 'pointer', width: '100%',
                  marginTop: 12, padding: '6px',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Skip for now
              </button>
            </motion.div>
          )}

          {/* STEP 3 — Occupation */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div style={{
                width: 56, height: 56,
                background: 'rgba(0,229,255,0.1)',
                border: '1px solid rgba(0,229,255,0.2)',
                borderRadius: 16,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: 20
              }}>
                <Shield size={26} color="#00E5FF" />
              </div>

              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                What do you do?
              </h2>
              <p style={{
                fontSize: 14, color: '#94A3B8',
                marginBottom: 24, lineHeight: 1.6
              }}>
                Helps us tailor financial advice to your situation.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10, marginBottom: 28
              }}>
                {occupations.map(occ => (
                  <button
                    key={occ}
                    onClick={() => setFormData({ ...formData, occupation: occ })}
                    style={{
                      background: formData.occupation === occ
                        ? 'rgba(139,92,246,0.15)'
                        : 'rgba(255,255,255,0.04)',
                      border: formData.occupation === occ
                        ? '1px solid rgba(139,92,246,0.4)'
                        : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 10,
                      padding: '13px 12px',
                      color: formData.occupation === occ
                        ? '#8B5CF6' : '#94A3B8',
                      fontSize: 13, fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                  >
                    {occ}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setStep(2)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '13px' }}
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="btn-primary"
                  style={{ flex: 2, padding: '13px', fontSize: 15 }}
                >
                  Continue →
                </button>
              </div>

              <button
                onClick={() => setStep(4)}
                style={{
                  background: 'none', border: 'none',
                  color: '#94A3B8', fontSize: 12,
                  cursor: 'pointer', width: '100%',
                  marginTop: 12, padding: '6px',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Skip for now
              </button>
            </motion.div>
          )}

          {/* STEP 4 — Goals (multiple select) */}
          {step === 4 && (
            <motion.div
              key="step4"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div style={{
                width: 56, height: 56,
                background: 'rgba(255,176,32,0.1)',
                border: '1px solid rgba(255,176,32,0.2)',
                borderRadius: 16,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: 20
              }}>
                <Target size={26} color="#FFB020" />
              </div>

              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                What are your financial goals?
              </h2>
              <p style={{
                fontSize: 14, color: '#94A3B8',
                marginBottom: 8, lineHeight: 1.6
              }}>
                Select all that apply — FinGenie will prioritize
                insights around your goals.
              </p>

              {/* Selected count */}
              {formData.goals.length > 0 && (
                <div style={{
                  fontSize: 12,
                  color: '#8B5CF6',
                  marginBottom: 16,
                  fontWeight: 500
                }}>
                  {formData.goals.length} goal{formData.goals.length > 1 ? 's' : ''} selected
                </div>
              )}

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10, marginBottom: 28,
                maxHeight: 300,
                overflowY: 'auto',
                paddingRight: 4
              }}>
                {goals.map(goal => {
                  const isSelected = formData.goals.includes(goal.label);
                  return (
                    <button
                      key={goal.label}
                      onClick={() => toggleGoal(goal.label)}
                      style={{
                        background: isSelected
                          ? 'rgba(139,92,246,0.15)'
                          : 'rgba(255,255,255,0.04)',
                        border: isSelected
                          ? '1px solid rgba(139,92,246,0.4)'
                          : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 10,
                        padding: '13px 12px',
                        color: isSelected ? '#8B5CF6' : '#94A3B8',
                        fontSize: 13, fontWeight: 500,
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.2s',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 6
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{goal.icon}</span>
                        <span style={{ fontSize: 12 }}>{goal.label}</span>
                      </span>
                      {isSelected && (
                        <Check size={14} color="#8B5CF6" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setStep(3)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '13px' }}
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn-primary"
                  disabled={loading}
                  style={{
                    flex: 2, padding: '13px',
                    fontSize: 15,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Setting up...' : '🚀 Launch FinGenie'}
                </button>
              </div>

              <button
                onClick={handleSubmit}
                style={{
                  background: 'none', border: 'none',
                  color: '#94A3B8', fontSize: 12,
                  cursor: 'pointer', width: '100%',
                  marginTop: 12, padding: '6px',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Skip and go to dashboard
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;