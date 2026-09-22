import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, TrendingUp, Shield, Zap,
  ArrowRight, Sparkles, Target, Bell
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#050816', minHeight: '100vh', overflow: 'hidden' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 60px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky',
        top: 0,
        background: 'rgba(5,8,22,0.8)',
        backdropFilter: 'blur(20px)',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #8B5CF6, #00E5FF)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#F5F5F5' }}>
            Fin<span style={{ color: '#8B5CF6' }}>Genie</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => navigate('/login')}
            className="btn-secondary"
            style={{ padding: '10px 20px' }}
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="btn-primary"
            style={{ padding: '10px 20px' }}
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '80px 60px',
        minHeight: '90vh',
        position: 'relative'
      }}>

        {/* Background blobs */}
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '10%',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(0,229,255,0.1), transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: 580, zIndex: 1 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: 20, padding: '6px 14px',
            marginBottom: 24
          }}>
            <div style={{
              width: 6, height: 6,
              background: '#8B5CF6',
              borderRadius: '50%',
              animation: 'pulse-glow 2s infinite'
            }} />
            <span style={{ fontSize: 13, color: '#8B5CF6', fontWeight: 500 }}>
              AI-Powered Finance
            </span>
          </div>

          <h1 style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
            Meet{' '}
            <span style={{
              background: 'linear-gradient(135deg, #8B5CF6, #00E5FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              FinGenie
            </span>
          </h1>

          <h2 style={{
            fontSize: 36, fontWeight: 700,
            color: '#94A3B8', lineHeight: 1.2,
            marginBottom: 24
          }}>
            Your AI Financial Twin
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #8B5CF6, #00E5FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              That Learns. Predicts. Protects.
            </span>
          </h2>

          <p style={{
            fontSize: 17, color: '#94A3B8',
            lineHeight: 1.7, marginBottom: 40,
            maxWidth: 480
          }}>
            FinGenie understands your spending behavior, predicts your
            financial future, and gives you personalized guidance —
            like having a CFO in your pocket.
          </p>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <button
              onClick={() => navigate('/register')}
              className="btn-primary"
              style={{
                padding: '14px 32px',
                fontSize: 16,
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              Start Your Journey
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-secondary"
              style={{ padding: '14px 32px', fontSize: 16 }}
            >
              Sign In
            </button>
          </div>

          {/* Social proof */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 16, marginTop: 40
          }}>
            <div style={{ display: 'flex' }}>
              {['#8B5CF6', '#00E5FF', '#00D26A', '#FFB020'].map((color, i) => (
                <div key={i} style={{
                  width: 32, height: 32,
                  borderRadius: '50%',
                  background: color,
                  border: '2px solid #050816',
                  marginLeft: i > 0 ? -8 : 0
                }} />
              ))}
            </div>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>
              <span style={{ color: '#F5F5F5', fontWeight: 600 }}>500+</span> users
              managing smarter finances
            </p>
          </div>
        </motion.div>

        {/* Right — Floating AI Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ zIndex: 1 }}
        >
          {/* Main dashboard card */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 24,
            padding: 28,
            width: 340,
            boxShadow: '0 32px 80px rgba(139,92,246,0.2)',
            animation: 'float 6s ease-in-out infinite'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: 10, marginBottom: 20
            }}>
              <div style={{
                width: 36, height: 36,
                background: 'linear-gradient(135deg, #8B5CF6, #00E5FF)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Sparkles size={16} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#F5F5F5' }}>
                  FinGenie AI
                </div>
                <div style={{ fontSize: 11, color: '#00D26A' }}>● Online</div>
              </div>
            </div>

            {/* AI message */}
            <div style={{
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: 12, padding: '12px 14px',
              marginBottom: 20
            }}>
              <p style={{ fontSize: 13, color: '#F5F5F5', lineHeight: 1.6 }}>
                ✨ Your food spending increased{' '}
                <span style={{ color: '#FFB020', fontWeight: 600 }}>28%</span>{' '}
                this week. Want me to set a ₹500 weekend limit?
              </p>
            </div>

            {/* Net worth */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>
                Net Worth
              </div>
              <div style={{
                fontSize: 36, fontWeight: 800,
                background: 'linear-gradient(135deg, #F5F5F5, #94A3B8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ₹87,450
              </div>
              <div style={{
                fontSize: 13, color: '#00D26A',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 4, marginTop: 4
              }}>
                <TrendingUp size={14} />
                +12.4% this month
              </div>
            </div>

            {/* Mini stats */}
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{
                flex: 1,
                background: 'rgba(0,210,106,0.1)',
                border: '1px solid rgba(0,210,106,0.2)',
                borderRadius: 10, padding: '10px 12px'
              }}>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>Income</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#00D26A' }}>
                  ₹50,000
                </div>
              </div>
              <div style={{
                flex: 1,
                background: 'rgba(255,77,77,0.1)',
                border: '1px solid rgba(255,77,77,0.2)',
                borderRadius: 10, padding: '10px 12px'
              }}>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>Spent</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#FF4D4D' }}>
                  ₹12,450
                </div>
              </div>
            </div>
          </div>

          {/* Floating insight card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,229,255,0.2)',
              borderRadius: 14, padding: '12px 16px',
              marginTop: -20, marginLeft: -40,
              width: 220,
              boxShadow: '0 8px 32px rgba(0,229,255,0.1)'
            }}
          >
            <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>
              🎯 Goal Progress
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#F5F5F5' }}>
              Emergency Fund
            </div>
            <div style={{
              height: 4, background: 'rgba(255,255,255,0.1)',
              borderRadius: 2, marginTop: 8
            }}>
              <div style={{
                width: '68%', height: '100%',
                background: 'linear-gradient(90deg, #8B5CF6, #00E5FF)',
                borderRadius: 2
              }} />
            </div>
            <div style={{
              fontSize: 11, color: '#94A3B8',
              marginTop: 4, textAlign: 'right'
            }}>
              68% complete
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 60px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16 }}>
            Not just an expense tracker.
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #8B5CF6, #00E5FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Your financial intelligence layer.
            </span>
          </h2>
          <p style={{ fontSize: 17, color: '#94A3B8', maxWidth: 500, margin: '0 auto' }}>
            FinGenie goes beyond tracking — it thinks, predicts, and guides.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24
        }}>
          {[
            {
              icon: <Brain size={28} color="#8B5CF6" />,
              color: '#8B5CF6',
              title: 'AI That Knows You',
              description: 'FinGenie learns your spending patterns over time and gives advice that actually fits your life — not generic tips.'
            },
            {
              icon: <TrendingUp size={28} color="#00E5FF" />,
              color: '#00E5FF',
              title: 'Predict Your Future',
              description: 'See where your money goes next month before it happens. Plan ahead with AI-powered cash flow forecasting.'
            },
            {
              icon: <Shield size={28} color="#00D26A" />,
              color: '#00D26A',
              title: 'Smart Protection',
              description: 'Get warned before you overspend. Detect subscriptions you forgot about. Never be caught off guard.'
            },
            {
              icon: <Target size={28} color="#FFB020" />,
              color: '#FFB020',
              title: 'Goal Intelligence',
              description: 'Set financial goals and let FinGenie tell you exactly how to reach them — month by month, step by step.'
            },
            {
              icon: <Zap size={28} color="#FF4D4D" />,
              color: '#FF4D4D',
              title: 'Instant SMS Parsing',
              description: 'Paste any bank SMS and FinGenie extracts the transaction instantly using AI — no manual entry needed.'
            },
            {
              icon: <Bell size={28} color="#8B5CF6" />,
              color: '#8B5CF6',
              title: 'Smart Alerts',
              description: 'Intelligent notifications that warn you about real problems — not useless reminders nobody reads.'
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card"
              style={{ cursor: 'default' }}
            >
              <div style={{
                width: 52, height: 52,
                background: `rgba(${feature.color === '#8B5CF6' ? '139,92,246' : feature.color === '#00E5FF' ? '0,229,255' : feature.color === '#00D26A' ? '0,210,106' : feature.color === '#FFB020' ? '255,176,32' : '255,77,77'},0.15)`,
                borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7 }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 60px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16 }}>
            How it works
          </h2>
          <p style={{ fontSize: 17, color: '#94A3B8' }}>
            Get started in 3 simple steps
          </p>
        </motion.div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 40,
          alignItems: 'flex-start'
        }}>
          {[
            {
              step: '01',
              title: 'Connect Your Transactions',
              description: 'Add transactions manually, paste bank SMS, or let FinGenie parse your emails automatically.'
            },
            {
              step: '02',
              title: 'AI Analyzes Your Patterns',
              description: 'FinGenie studies your spending behavior, detects subscriptions, and builds your financial profile.'
            },
            {
              step: '03',
              title: 'Get Money Intelligence',
              description: 'Receive personalized insights, predictions, and guidance that helps you make smarter decisions.'
            }
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              style={{ textAlign: 'center', maxWidth: 260 }}
            >
              <div style={{
                fontSize: 48, fontWeight: 800,
                background: 'linear-gradient(135deg, #8B5CF6, #00E5FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 16
              }}>
                {step.step}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7 }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 60px',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: 24,
            padding: '60px 40px',
            maxWidth: 700,
            margin: '0 auto'
          }}
        >
          <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16 }}>
            Ready to take control of
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #8B5CF6, #00E5FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              your financial future?
            </span>
          </h2>
          <p style={{
            fontSize: 17, color: '#94A3B8',
            marginBottom: 32, lineHeight: 1.6
          }}>
            Join thousands of users who use FinGenie to make
            smarter financial decisions every day.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="btn-primary"
            style={{
              padding: '16px 40px',
              fontSize: 17,
              display: 'inline-flex',
              alignItems: 'center', gap: 8
            }}
          >
            Start Your Journey Free
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 60px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28,
            background: 'linear-gradient(135deg, #8B5CF6, #00E5FF)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={14} color="white" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700 }}>
            Fin<span style={{ color: '#8B5CF6' }}>Genie</span>
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#94A3B8' }}>
          © 2026 FinGenie. Built with AI for smarter finances.
        </p>
      </footer>

      {/* Float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;