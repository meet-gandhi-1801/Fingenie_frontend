import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Lightbulb, RefreshCw, TrendingUp,
  AlertTriangle, AlertCircle, Info, CheckCircle2
} from 'lucide-react';
import Layout from '../components/Layout';
import { insightAPI } from '../services/api';

const SEVERITY_CONFIG = {
  positive: { color: '#00D26A', bg: 'rgba(0,210,106,0.08)', border: 'rgba(0,210,106,0.2)', icon: <CheckCircle2 size={16} /> },
  info: { color: '#00E5FF', bg: 'rgba(0,229,255,0.08)', border: 'rgba(0,229,255,0.2)', icon: <Info size={16} /> },
  warning: { color: '#FFB020', bg: 'rgba(255,176,32,0.08)', border: 'rgba(255,176,32,0.2)', icon: <AlertTriangle size={16} /> },
  danger: { color: '#FF4D4D', bg: 'rgba(255,77,77,0.08)', border: 'rgba(255,77,77,0.2)', icon: <AlertCircle size={16} /> }
};

const InsightCard = ({ insight, index }) => {
  const config = SEVERITY_CONFIG[insight.severity] || SEVERITY_CONFIG.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass-card"
      style={{
        borderLeft: `3px solid ${config.color}`,
        position: 'relative'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14
      }}>
        <div style={{
          width: 40, height: 40,
          background: config.bg,
          borderRadius: 10,
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18, flexShrink: 0
        }}>
          {insight.icon || '💡'}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 6
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>
              {insight.title}
            </h3>
            <span style={{
              fontSize: 10,
              color: config.color,
              background: config.bg,
              padding: '2px 8px',
              borderRadius: 20,
              display: 'flex', alignItems: 'center', gap: 4,
              whiteSpace: 'nowrap', flexShrink: 0,
              marginLeft: 10
            }}>
              {config.icon}
              {insight.severity}
            </span>
          </div>
          <p style={{
            fontSize: 13, color: '#94A3B8',
            lineHeight: 1.6
          }}>
            {insight.message}
          </p>
          <div style={{
            fontSize: 11, color: '#94A3B8',
            marginTop: 10
          }}>
            {new Date(insight.generatedAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SubscriptionCard = ({ sub, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    className="glass-card"
    style={{ flex: 1, minWidth: 220 }}
  >
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12
    }}>
      <div style={{
        width: 40, height: 40,
        background: 'rgba(139,92,246,0.15)',
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18
      }}>
        🔄
      </div>
      <span style={{
        fontSize: 10, color: '#8B5CF6',
        background: 'rgba(139,92,246,0.15)',
        padding: '3px 8px', borderRadius: 20
      }}>
        {sub.frequency}
      </span>
    </div>

    <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
      {sub.merchant}
    </h4>
    <div style={{ fontSize: 22, fontWeight: 700, color: '#F5F5F5', marginBottom: 8 }}>
      ₹{sub.amount?.toLocaleString('en-IN')}
      <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 400 }}>
        /{sub.frequency === 'Yearly' ? 'year' : 'month'}
      </span>
    </div>

    <div style={{
      background: 'rgba(255,176,32,0.08)',
      border: '1px solid rgba(255,176,32,0.15)',
      borderRadius: 8, padding: '8px 12px',
      fontSize: 12, color: '#FFB020'
    }}>
      Annual cost: ₹{sub.annualCost?.toLocaleString('en-IN')}
    </div>
  </motion.div>
);

const InsightsPage = () => {
  const [insights, setInsights] = useState([]);
  const [subscriptions, setSubscriptions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [insightsRes, subsRes] = await Promise.all([
        insightAPI.getAll(),
        insightAPI.getSubscriptions()
      ]);
      setInsights(insightsRes.data.insights || []);
      setSubscriptions(subsRes.data);
    } catch (err) {
      console.error('Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Layout>
      <div style={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '60vh',
        flexDirection: 'column', gap: 16
      }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid rgba(139,92,246,0.2)',
          borderTop: '3px solid #8B5CF6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div style={{ maxWidth: 1000 }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 28
        }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
              Your Financial Intelligence
            </h1>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>
              Updated after every transaction
            </p>
          </div>
          <button
            onClick={fetchData}
            className="btn-secondary"
            style={{
              padding: '10px 16px', fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Insights grid */}
        {insights.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 36
          }}>
            {insights.map((insight, i) => (
              <InsightCard key={insight.id || i} insight={insight} index={i} />
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{
            textAlign: 'center', padding: '50px 20px',
            marginBottom: 36
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✨</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              No insights yet
            </h3>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>
              Add a few transactions and FinGenie will start
              generating personalized insights for you.
            </p>
          </div>
        )}

        {/* Subscriptions section */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>
              Active Subscriptions
            </h2>
            {subscriptions && subscriptions.count > 0 && (
              <div style={{
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.2)',
                borderRadius: 10, padding: '8px 16px',
                fontSize: 13, color: '#8B5CF6'
              }}>
                Total: ₹{subscriptions.totalMonthlyCost?.toLocaleString('en-IN')}/mo
                <span style={{ color: '#94A3B8', marginLeft: 8 }}>
                  (₹{subscriptions.totalAnnualCost?.toLocaleString('en-IN')}/year)
                </span>
              </div>
            )}
          </div>

          {subscriptions?.subscriptions?.length > 0 ? (
            <div style={{
              display: 'flex',
              gap: 16, flexWrap: 'wrap'
            }}>
              {subscriptions.subscriptions.map((sub, i) => (
                <SubscriptionCard key={i} sub={sub} index={i} />
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{
              textAlign: 'center', padding: '40px 20px'
            }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
              <p style={{ fontSize: 13, color: '#94A3B8' }}>
                No recurring subscriptions detected yet.
                FinGenie scans your transactions for patterns automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default InsightsPage;