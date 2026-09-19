import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Wallet,
  PiggyBank, Sparkles, ArrowRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import Layout from '../components/Layout';
import { dashboardAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CATEGORY_COLORS = {
  Food: '#FF6B6B',
  Shopping: '#4ECDC4',
  Travel: '#45B7D1',
  Entertainment: '#96CEB4',
  Bills: '#FFEAA7',
  Health: '#DDA0DD',
  Education: '#98D8C8',
  Investment: '#00D26A',
  Rent: '#F0A500',
  Other: '#94A3B8'
};

const StatCard = ({ title, value, change, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card"
    style={{ flex: 1 }}
  >
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16
    }}>
      <div>
        <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 6 }}>
          {title}
        </p>
        <h3 style={{
          fontSize: 28, fontWeight: 800,
          color: '#F5F5F5'
        }}>
          {value}
        </h3>
      </div>
      <div style={{
        width: 44, height: 44,
        background: `rgba(${color}, 0.15)`,
        borderRadius: 12,
        display: 'flex', alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </div>
    </div>
    {change && (
      <div style={{
        fontSize: 12, color: '#94A3B8',
        display: 'flex', alignItems: 'center', gap: 4
      }}>
        <span style={{ color: '#00D26A' }}>{change}</span>
        vs last month
      </div>
    )}
  </motion.div>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trend, setTrend] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, categoriesRes, trendRes, recentRes] = await Promise.all([
        dashboardAPI.getSummary(),
        dashboardAPI.getCategories(),
        dashboardAPI.getTrend(),
        dashboardAPI.getRecent()
      ]);

      setSummary(summaryRes.data);
      setCategories(categoriesRes.data.breakdown || []);
      setTrend(trendRes.data || []);
      setRecent(recentRes.data || []);
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateHealthScore = () => {
    if (!summary || summary.totalIncome === 0) return null;

    let score = 50; // base score

    // Savings rate contribution (max 30 points)
    const savingsRate = parseFloat(summary.trueSavingsRate || '0');
    if (savingsRate >= 30) score += 30;
    else if (savingsRate >= 20) score += 20;
    else if (savingsRate >= 10) score += 10;

    // Has income recorded (10 points)
    if (summary.totalIncome > 0) score += 10;

    // Has investments (10 points)
    if (summary.totalInvestments > 0) score += 10;

    return Math.min(score, 100);
  };

  const healthScore = calculateHealthScore();

  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString('en-IN')}`;
  };

  if (loading) return (
    <Layout>
      <div style={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '60vh',
        flexDirection: 'column', gap: 16
      }}>
        <div style={{
          width: 48, height: 48,
          border: '3px solid rgba(139,92,246,0.3)',
          borderTop: '3px solid #8B5CF6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#94A3B8', fontSize: 14 }}>
          Loading your financial data...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div style={{ maxWidth: 1200 }}>

        {/* Financial Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(0,229,255,0.05))',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: 20,
            padding: '28px 32px',
            marginBottom: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* Score circle */}
            <div style={{ position: 'relative' }}>
              <svg width="100" height="100">
                <circle cx="50" cy="50" r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="8"
                />
                {healthScore && (
                  <circle cx="50" cy="50" r="42"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 42 * (healthScore / 100)} ${2 * Math.PI * 42}`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                )}
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#00E5FF" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center'
              }}>
                {healthScore ? (
                  <>
                    <span style={{ fontSize: 24, fontWeight: 800, color: '#F5F5F5' }}>{healthScore}</span>
                    <span style={{ fontSize: 9, color: '#94A3B8' }}>score</span>
                  </>
                ) : (
                  <span style={{ fontSize: 10, color: '#94A3B8', textAlign: 'center' }}>
                    No data
                  </span>
                )}
              </div>
            </div>

            {/* Score labels */}
            <div>
              <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 4 }}>
                Financial Health Score
              </div>
              {healthScore ? (
                <>
                  <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: '#F5F5F5' }}>
                    {healthScore >= 80 ? 'Excellent ✨' :
                     healthScore >= 60 ? 'Good 👍' :
                     healthScore >= 40 ? 'Fair ⚠️' : 'Needs Work 🔧'}
                  </div>
                  <div style={{ fontSize: 13, color: '#00D26A' }}>
                    Based on your financial activity
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: '#F5F5F5' }}>
                    Add transactions to get your score
                  </div>
                  <div style={{ fontSize: 13, color: '#94A3B8' }}>
                    Your score appears after first transaction
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={{
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: 14, padding: '16px 20px',
            maxWidth: 260
          }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: 8, marginBottom: 8
            }}>
              <Sparkles size={14} color="#8B5CF6" />
              <span style={{ fontSize: 12, color: '#8B5CF6', fontWeight: 600 }}>
                FinGenie AI Insight
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6 }}>
              Your savings rate of{' '}
              <span style={{ color: '#00D26A', fontWeight: 600 }}>
                {summary?.savingsRate || '0%'}
              </span>{' '}
              is excellent! Consider investing more for long-term growth.
            </p>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div style={{
          display: 'flex', gap: 20,
          marginBottom: 28
        }}>
          <StatCard
            title="Total Income"
            value={formatCurrency(summary?.totalIncome)}
            icon={<TrendingUp size={20} color="#00D26A" />}
            color="0,210,106"
            delay={0.1}
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(summary?.totalExpenses)}
            icon={<TrendingDown size={20} color="#FF4D4D" />}
            color="255,77,77"
            delay={0.2}
          />
          <StatCard
            title="Net Savings"
            value={formatCurrency(summary?.cashSavings)}
            icon={<PiggyBank size={20} color="#8B5CF6" />}
            color="139,92,246"
            delay={0.3}
          />
          <StatCard
            title="Savings Rate"
            value={summary?.trueSavingsRate || summary?.savingsRate || '0%'}
            icon={<Wallet size={20} color="#00E5FF" />}
            color="0,229,255"
            delay={0.4}
          />
        </div>

        {/* Charts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: 20,
          marginBottom: 28
        }}>

          {/* Spending Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card"
          >
            <h3 style={{
              fontSize: 16, fontWeight: 600,
              marginBottom: 24
            }}>
              6 Month Spending Trend
            </h3>
            {trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trend}>
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => `₹${(v/1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#0D0D1A',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10,
                      color: '#F5F5F5'
                    }}
                    formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Expenses']}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalExpenses"
                    stroke="#8B5CF6"
                    strokeWidth={2.5}
                    dot={{ fill: '#8B5CF6', r: 4 }}
                    activeDot={{ r: 6, fill: '#8B5CF6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{
                height: 220,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                color: '#94A3B8', fontSize: 14
              }}>
                Add transactions to see your spending trend
              </div>
            )}
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card"
          >
            <h3 style={{
              fontSize: 16, fontWeight: 600,
              marginBottom: 20
            }}>
              Spending by Category
            </h3>
            {categories.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={categories}
                      dataKey="total"
                      nameKey="category"
                      cx="50%" cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                    >
                      {categories.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={CATEGORY_COLORS[entry.category] || '#94A3B8'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#0D0D1A',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 10,
                        color: '#F5F5F5'
                      }}
                      formatter={v => [`₹${v.toLocaleString('en-IN')}`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div style={{ marginTop: 12 }}>
                  {categories.slice(0, 4).map((cat, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 8
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center', gap: 8
                      }}>
                        <div style={{
                          width: 8, height: 8,
                          borderRadius: '50%',
                          background: CATEGORY_COLORS[cat.category] || '#94A3B8',
                          flexShrink: 0
                        }} />
                        <span style={{ fontSize: 12, color: '#94A3B8' }}>
                          {cat.category}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center', gap: 8
                      }}>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>
                          ₹{cat.total.toLocaleString('en-IN')}
                        </span>
                        <span style={{
                          fontSize: 11, color: '#94A3B8',
                          background: 'rgba(255,255,255,0.05)',
                          padding: '2px 6px', borderRadius: 4
                        }}>
                          {cat.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{
                height: 160,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                color: '#94A3B8', fontSize: 14,
                textAlign: 'center'
              }}>
                No expense data yet
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card"
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>
              Recent Transactions
            </h3>
            <button
              onClick={() => navigate('/transactions')}
              style={{
                background: 'none', border: 'none',
                color: '#8B5CF6', cursor: 'pointer',
                fontSize: 13, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: 'Inter, sans-serif'
              }}
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          {recent.length > 0 ? (
            <div>
              {recent.map((tx, i) => (
                <motion.div
                  key={tx._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.05 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 0',
                    borderBottom: i < recent.length - 1
                      ? '1px solid rgba(255,255,255,0.05)'
                      : 'none'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center', gap: 14
                  }}>
                    <div style={{
                      width: 40, height: 40,
                      borderRadius: 12,
                      background: `rgba(${tx.type === 'credit' ? '0,210,106' : '255,77,77'}, 0.15)`,
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16
                    }}>
                      {tx.type === 'credit' ? '💰' : '💸'}
                    </div>
                    <div>
                      <div style={{
                        fontSize: 14, fontWeight: 500,
                        color: '#F5F5F5', marginBottom: 3
                      }}>
                        {tx.merchant}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{
                          fontSize: 11,
                          background: `rgba(${CATEGORY_COLORS[tx.category] ? '139,92,246' : '148,163,184'},0.15)`,
                          color: CATEGORY_COLORS[tx.category] || '#94A3B8',
                          padding: '2px 8px',
                          borderRadius: 20
                        }}>
                          {tx.category}
                        </span>
                        <span style={{ fontSize: 11, color: '#94A3B8' }}>
                          {new Date(tx.date).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    fontSize: 16, fontWeight: 700,
                    color: tx.type === 'credit' ? '#00D26A' : '#FF4D4D'
                  }}>
                    {tx.type === 'credit' ? '+' : '-'}
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 0',
              color: '#94A3B8'
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>💸</div>
              <p style={{ fontSize: 15, marginBottom: 8 }}>
                No transactions yet
              </p>
              <p style={{ fontSize: 13 }}>
                Add your first transaction to get started
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default DashboardPage;