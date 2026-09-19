import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Target, X, Sparkles,
  TrendingUp, Calendar, Trash2
} from 'lucide-react';
import Layout from '../components/Layout';
import { goalAPI } from '../services/api';

const GOAL_CATEGORIES = [
  { value: 'Emergency Fund', icon: '🛡️' },
  { value: 'Travel', icon: '✈️' },
  { value: 'Gadget', icon: '📱' },
  { value: 'Vehicle', icon: '🚗' },
  { value: 'Home', icon: '🏠' },
  { value: 'Education', icon: '🎓' },
  { value: 'Wedding', icon: '💍' },
  { value: 'Investment', icon: '📈' },
  { value: 'Other', icon: '🎯' }
];

// Add Goal Modal
const AddGoalModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    goalName: '',
    targetAmount: '',
    savedAmount: '0',
    deadline: '',
    category: 'Other',
    monthlyContribution: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await goalAPI.create({
        ...formData,
        targetAmount: Number(formData.targetAmount),
        savedAmount: Number(formData.savedAmount) || 0,
        monthlyContribution: Number(formData.monthlyContribution) || 0
      });
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000,
      padding: 20
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          background: '#0D0D1A',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: 32,
          width: '100%', maxWidth: 460,
          maxHeight: '90vh', overflowY: 'auto'
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 24
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>
            Create New Goal
          </h3>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)',
            border: 'none', borderRadius: 8,
            padding: 8, cursor: 'pointer',
            color: '#94A3B8'
          }}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,77,77,0.1)',
            border: '1px solid rgba(255,77,77,0.3)',
            borderRadius: 10, padding: '10px 14px',
            marginBottom: 16, fontSize: 13, color: '#FF4D4D'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Goal name */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6, display: 'block' }}>
              Goal name
            </label>
            <input
              type="text"
              value={formData.goalName}
              onChange={e => setFormData({ ...formData, goalName: e.target.value })}
              placeholder="Emergency Fund, Goa Trip..."
              className="input-dark"
              required
              autoFocus
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6, display: 'block' }}>
              Category
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8
            }}>
              {GOAL_CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 8,
                    border: formData.category === cat.value
                      ? '1px solid rgba(139,92,246,0.5)'
                      : '1px solid rgba(255,255,255,0.08)',
                    background: formData.category === cat.value
                      ? 'rgba(139,92,246,0.15)'
                      : 'rgba(255,255,255,0.03)',
                    color: formData.category === cat.value ? '#8B5CF6' : '#94A3B8',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 11, fontWeight: 500,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 4
                  }}
                >
                  <span style={{ fontSize: 16 }}>{cat.icon}</span>
                  {cat.value}
                </button>
              ))}
            </div>
          </div>

          {/* Target amount */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6, display: 'block' }}>
              Target amount
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', color: '#8B5CF6', fontWeight: 600
              }}>₹</span>
              <input
                type="number"
                value={formData.targetAmount}
                onChange={e => setFormData({ ...formData, targetAmount: e.target.value })}
                placeholder="100000"
                className="input-dark"
                style={{ paddingLeft: 30 }}
                required
              />
            </div>
          </div>

          {/* Already saved */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6, display: 'block' }}>
              Already saved (optional)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', color: '#8B5CF6', fontWeight: 600
              }}>₹</span>
              <input
                type="number"
                value={formData.savedAmount}
                onChange={e => setFormData({ ...formData, savedAmount: e.target.value })}
                placeholder="0"
                className="input-dark"
                style={{ paddingLeft: 30 }}
              />
            </div>
          </div>

          {/* Deadline */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6, display: 'block' }}>
              Target date
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={e => setFormData({ ...formData, deadline: e.target.value })}
              className="input-dark"
              style={{ colorScheme: 'dark' }}
              required
            />
          </div>

          {/* Monthly contribution */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6, display: 'block' }}>
              Monthly contribution plan (optional)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', color: '#8B5CF6', fontWeight: 600
              }}>₹</span>
              <input
                type="number"
                value={formData.monthlyContribution}
                onChange={e => setFormData({ ...formData, monthlyContribution: e.target.value })}
                placeholder="5000"
                className="input-dark"
                style={{ paddingLeft: 30 }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '13px', fontSize: 15, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating...' : 'Create Goal'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// Can I Afford This Modal
const AffordModal = ({ goal, onClose }) => {
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!itemName || !amount) return;
    setLoading(true);
    try {
      const { data } = await goalAPI.canAfford({
        itemName,
        amount: Number(amount)
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000,
      padding: 20
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: '#0D0D1A',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: 32,
          width: '100%', maxWidth: 440
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles size={18} color="#8B5CF6" />
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>
              Can I afford this?
            </h3>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)',
            border: 'none', borderRadius: 8,
            padding: 8, cursor: 'pointer', color: '#94A3B8'
          }}>
            <X size={18} />
          </button>
        </div>
        <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 20 }}>
          Ask FinGenie AI before making a purchase decision
        </p>

        {!result && (
          <>
            <input
              type="text"
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              placeholder="What do you want to buy? (e.g. iPhone 15)"
              className="input-dark"
              style={{ marginBottom: 12 }}
              autoFocus
            />
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', color: '#8B5CF6', fontWeight: 600
              }}>₹</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="80000"
                className="input-dark"
                style={{ paddingLeft: 30 }}
              />
            </div>
            <button
              onClick={handleCheck}
              className="btn-primary"
              disabled={loading || !itemName || !amount}
              style={{ width: '100%', padding: '13px', fontSize: 14, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Analyzing...' : '✨ Ask FinGenie AI'}
            </button>
          </>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{
              background: result.canAffordNow
                ? 'rgba(0,210,106,0.1)'
                : 'rgba(255,176,32,0.1)',
              border: `1px solid ${result.canAffordNow ? 'rgba(0,210,106,0.3)' : 'rgba(255,176,32,0.3)'}`,
              borderRadius: 14, padding: 18,
              marginBottom: 16, textAlign: 'center'
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>
                {result.canAffordNow ? '✅' : '⏳'}
              </div>
              <div style={{
                fontSize: 16, fontWeight: 700,
                color: result.canAffordNow ? '#00D26A' : '#FFB020',
                marginBottom: 4
              }}>
                {result.canAffordNow
                  ? 'You can afford it now!'
                  : `${result.monthsToSave || '?'} months to save up`
                }
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>
                Free cash: ₹{result.freeCash?.toLocaleString('en-IN')}/month
              </div>
            </div>

            <div style={{
              background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.15)',
              borderRadius: 12, padding: 16,
              marginBottom: 16
            }}>
              <p style={{ fontSize: 13, color: '#F5F5F5', lineHeight: 1.6 }}>
                {result.aiAdvice}
              </p>
            </div>

            <button
              onClick={() => { setResult(null); setItemName(''); setAmount(''); }}
              className="btn-secondary"
              style={{ width: '100%', padding: '12px', fontSize: 13 }}
            >
              Ask another question
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Goal Card
const GoalCard = ({ goal, index, onDelete, onCheckAfford }) => {
  const categoryInfo = GOAL_CATEGORIES.find(c => c.value === goal.category) || GOAL_CATEGORIES[8];
  const progress = parseFloat(goal.progressPercent) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card"
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44,
            background: 'rgba(139,92,246,0.15)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20
          }}>
            {categoryInfo.icon}
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>
              {goal.goalName}
            </h3>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>
              {goal.category}
            </span>
          </div>
        </div>

        <button
          onClick={() => onDelete(goal._id)}
          style={{
            background: 'none', border: 'none',
            color: '#94A3B8', cursor: 'pointer',
            padding: 6
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#FF4D4D'}
          onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 8, background: 'rgba(255,255,255,0.06)',
        borderRadius: 4, marginBottom: 10, overflow: 'hidden'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #8B5CF6, #00E5FF)',
            borderRadius: 4
          }}
        />
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginBottom: 16
      }}>
        <span style={{ fontSize: 13, color: '#F5F5F5', fontWeight: 600 }}>
          ₹{goal.savedAmount?.toLocaleString('en-IN')}
          <span style={{ color: '#94A3B8', fontWeight: 400 }}>
            {' '}/ ₹{goal.targetAmount?.toLocaleString('en-IN')}
          </span>
        </span>
        <span style={{ fontSize: 13, color: '#8B5CF6', fontWeight: 600 }}>
          {goal.progressPercent}
        </span>
      </div>

      <div style={{
        display: 'flex',
        gap: 10, marginBottom: 16,
        flexWrap: 'wrap'
      }}>
        <div style={{
          flex: 1, minWidth: 100,
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 8, padding: '8px 12px'
        }}>
          <div style={{ fontSize: 10, color: '#94A3B8' }}>Months left</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{goal.monthsRemaining}</div>
        </div>
        <div style={{
          flex: 1, minWidth: 100,
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 8, padding: '8px 12px'
        }}>
          <div style={{ fontSize: 10, color: '#94A3B8' }}>Need/month</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            ₹{goal.requiredMonthlySaving?.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{
          fontSize: 11, fontWeight: 600,
          padding: '4px 12px', borderRadius: 20,
          background: goal.onTrack ? 'rgba(0,210,106,0.15)' : 'rgba(255,176,32,0.15)',
          color: goal.onTrack ? '#00D26A' : '#FFB020'
        }}>
          {goal.onTrack ? '🎯 On Track' : '⚠️ Behind'}
        </span>

        <button
          onClick={() => onCheckAfford(goal)}
          style={{
            background: 'none', border: 'none',
            color: '#8B5CF6', cursor: 'pointer',
            fontSize: 12, fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center', gap: 4
          }}
        >
          <Sparkles size={12} />
          Can I afford something?
        </button>
      </div>
    </motion.div>
  );
};

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [affordGoal, setAffordGoal] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data } = await goalAPI.getAll();
      setGoals(data);
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await goalAPI.delete(id);
      setGoals(prev => prev.filter(g => g._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) return (
    <Layout>
      <div style={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '60vh'
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
              Financial Goals
            </h1>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>
              {goals.length} active goal{goals.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
            style={{
              padding: '11px 20px', fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            <Plus size={15} />
            Add Goal
          </button>
        </div>

        {goals.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20
          }}>
            {goals.map((goal, i) => (
              <GoalCard
                key={goal._id}
                goal={goal}
                index={i}
                onDelete={handleDelete}
                onCheckAfford={setAffordGoal}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{
            textAlign: 'center', padding: '60px 20px'
          }}>
            <div style={{
              width: 64, height: 64,
              background: 'rgba(139,92,246,0.15)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <Target size={28} color="#8B5CF6" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
              No goals yet
            </h3>
            <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 24 }}>
              Set a financial goal and let FinGenie help you track progress
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: 14 }}
            >
              Create Your First Goal
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddGoalModal
            onClose={() => setShowAddModal(false)}
            onSave={fetchGoals}
          />
        )}
        {affordGoal && (
          <AffordModal
            goal={affordGoal}
            onClose={() => setAffordGoal(null)}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default GoalsPage;