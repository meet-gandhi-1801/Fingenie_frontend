import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, Trash2,
  MessageSquare, X, Check, AlertCircle,
  ArrowUpCircle, ArrowDownCircle
} from 'lucide-react';
import Layout from '../components/Layout';
import { transactionAPI, smsAPI } from '../services/api';
import { useRef } from 'react'; // add useRef if not already imported

const CATEGORIES = [
  'All', 'Food', 'Shopping', 'Travel', 'Rent',
  'Bills', 'Health', 'Entertainment', 'Education',
  'Investment', 'Salary', 'Other'
];

const CATEGORY_COLORS = {
  Food: '#FF6B6B',
  Shopping: '#4ECDC4',
  Travel: '#45B7D1',
  Entertainment: '#96CEB4',
  Bills: '#FFEAA7',
  Health: '#DDA0DD',
  Education: '#98D8C8',
  Investment: '#00D26A',
  Salary: '#00D26A',
  Rent: '#F0A500',
  Other: '#94A3B8'
};

const CATEGORY_EMOJIS = {
  Food: '🍔', Shopping: '🛍️', Travel: '✈️',
  Entertainment: '🎬', Bills: '📱', Health: '💊',
  Education: '📚', Investment: '📈', Salary: '💰',
  Rent: '🏠', Other: '💸'
};

// Add Transaction Modal
const AddTransactionModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'debit',
    merchant: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await transactionAPI.create({
        ...formData,
        amount: Number(formData.amount)
      });
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
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
          width: '100%', maxWidth: 460
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 24
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>
            Add Transaction
          </h3>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)',
            border: 'none', borderRadius: 8,
            padding: 8, cursor: 'pointer',
            color: '#94A3B8',
            display: 'flex', alignItems: 'center'
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
          {/* Amount */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: 12, color: '#94A3B8',
              marginBottom: 6, display: 'block'
            }}>
              Amount
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14,
                top: '50%', transform: 'translateY(-50%)',
                color: '#8B5CF6', fontWeight: 600
              }}>₹</span>
              <input
                type="number"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0"
                className="input-dark"
                style={{ paddingLeft: 30, fontSize: 20, fontWeight: 700 }}
                required
                autoFocus
              />
            </div>
          </div>

          {/* Type toggle */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: 12, color: '#94A3B8',
              marginBottom: 6, display: 'block'
            }}>
              Type
            </label>
            <div style={{
              display: 'flex', gap: 10
            }}>
              {['debit', 'credit'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  style={{
                    flex: 1, padding: '10px',
                    borderRadius: 10,
                    border: formData.type === type
                      ? `1px solid ${type === 'debit' ? 'rgba(255,77,77,0.5)' : 'rgba(0,210,106,0.5)'}`
                      : '1px solid rgba(255,255,255,0.08)',
                    background: formData.type === type
                      ? type === 'debit'
                        ? 'rgba(255,77,77,0.1)'
                        : 'rgba(0,210,106,0.1)'
                      : 'rgba(255,255,255,0.03)',
                    color: formData.type === type
                      ? type === 'debit' ? '#FF4D4D' : '#00D26A'
                      : '#94A3B8',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 13, fontWeight: 600,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 6,
                    transition: 'all 0.2s'
                  }}
                >
                  {type === 'debit'
                    ? <ArrowDownCircle size={16} />
                    : <ArrowUpCircle size={16} />
                  }
                  {type === 'debit' ? 'Expense' : 'Income'}
                </button>
              ))}
            </div>
          </div>

          {/* Merchant */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: 12, color: '#94A3B8',
              marginBottom: 6, display: 'block'
            }}>
              Merchant / Source
            </label>
            <input
              type="text"
              value={formData.merchant}
              onChange={e => setFormData({ ...formData, merchant: e.target.value })}
              placeholder="Zomato, Amazon, Salary..."
              className="input-dark"
              required
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: 12, color: '#94A3B8',
              marginBottom: 6, display: 'block'
            }}>
              Category
            </label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="input-dark"
              style={{ cursor: 'pointer' }}
            >
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                <option
                  key={cat} value={cat}
                  style={{ background: '#0D0D1A' }}
                >
                  {CATEGORY_EMOJIS[cat]} {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: 12, color: '#94A3B8',
              marginBottom: 6, display: 'block'
            }}>
              Description (optional)
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description..."
              className="input-dark"
            />
          </div>

          {/* Date */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              fontSize: 12, color: '#94A3B8',
              marginBottom: 6, display: 'block'
            }}>
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="input-dark"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              fontSize: 15,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Saving...' : 'Save Transaction'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// SMS Parser Modal
const SMSModal = ({ onClose, onSave }) => {
  const [smsText, setSmsText] = useState('');
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  const handleParse = async () => {
    if (!smsText.trim()) return;
    setLoading(true);
    setError('');
    setParsed(null);
    setIsEditing(false);
    try {
      const { data } = await smsAPI.parse(smsText);
      setParsed(data);
      setEditedData({
        amount: data.data?.amount,
        type: data.data?.type,
        merchant: data.data?.merchant,
        category: data.data?.category,
        date: data.data?.date || new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not parse SMS');
    } finally {
      setLoading(false);
    }
  };



  const handleSave = async () => {
    setSaving(true);
    try {
      await transactionAPI.create({
        amount: editedData.amount,
        type: editedData.type,
        merchant: editedData.merchant,
        category: editedData.category,
        date: editedData.date,
        source: 'sms',
        description: `Parsed from SMS via ${parsed.parser} parser`
      });
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const confidenceColor = (label) => {
    if (label === 'High') return '#00D26A';
    if (label === 'Medium') return '#FFB020';
    return '#FF4D4D';
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
          width: '100%', maxWidth: 480
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 8
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>
            Parse Bank SMS
          </h3>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)',
            border: 'none', borderRadius: 8,
            padding: 8, cursor: 'pointer',
            color: '#94A3B8',
            display: 'flex', alignItems: 'center'
          }}>
            <X size={18} />
          </button>
        </div>

        <p style={{
          fontSize: 13, color: '#94A3B8',
          marginBottom: 20
        }}>
          Paste any bank SMS and FinGenie AI will extract the transaction details.
        </p>

        {error && (
          <div style={{
            background: 'rgba(255,77,77,0.1)',
            border: '1px solid rgba(255,77,77,0.3)',
            borderRadius: 10, padding: '10px 14px',
            marginBottom: 16, fontSize: 13, color: '#FF4D4D',
            display: 'flex', gap: 8, alignItems: 'flex-start'
          }}>
            <AlertCircle size={14} style={{ marginTop: 2, flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* SMS Input */}
        <textarea
          value={smsText}
          onChange={e => {
            setSmsText(e.target.value);
            setParsed(null);
            setEditedData({});
            setIsEditing(false);
            setError('');
          }}
          placeholder="Paste your bank SMS here...
Example: Rs.450 debited from HDFC Bank A/c XX1234 to Zomato on 11-06-2026"
          style={{
            width: '100%',
            height: 120,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: 14,
            color: '#F5F5F5', fontSize: 13,
            fontFamily: 'Inter, sans-serif',
            resize: 'none', outline: 'none',
            lineHeight: 1.6,
            boxSizing: 'border-box',
            transition: 'border-color 0.2s'
          }}
          onFocus={e => e.target.style.borderColor = '#8B5CF6'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />

        <button
          onClick={handleParse}
          className="btn-primary"
          disabled={loading || !smsText.trim()}
          style={{
            width: '100%', padding: '12px',
            marginTop: 12, marginBottom: 20,
            fontSize: 14,
            opacity: (loading || !smsText.trim()) ? 0.6 : 1,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: 16, height: 16,
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              Parsing with AI...
            </>
          ) : (
            <>✨ Parse with AI</>
          )}
        </button>

        {/* Parsed result */}
        <AnimatePresence>
          {parsed && parsed.success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(0,210,106,0.05)',
                border: '1px solid rgba(0,210,106,0.2)',
                borderRadius: 14, padding: 18,
                marginBottom: 16
              }}
            >
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 14
              }}>
                <span style={{
                  fontSize: 13, fontWeight: 600,
                  color: '#00D26A',
                  display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <Check size={14} /> Parsed successfully
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>
                      Confidence:
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: confidenceColor(parsed.confidenceLabel),
                      background: `rgba(${parsed.confidenceLabel === 'High' ? '0,210,106' : parsed.confidenceLabel === 'Medium' ? '255,176,32' : '255,77,77'},0.15)`,
                      padding: '2px 8px', borderRadius: 20
                    }}>
                      {parsed.confidenceLabel}
                    </span>
                  </div>
                  {/* Edit toggle button */}
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    style={{
                      background: isEditing
                        ? 'rgba(139,92,246,0.2)'
                        : 'rgba(255,255,255,0.05)',
                      border: isEditing
                        ? '1px solid rgba(139,92,246,0.4)'
                        : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, padding: '4px 10px',
                      color: isEditing ? '#8B5CF6' : '#94A3B8',
                      fontSize: 12, cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500
                    }}
                  >
                    {isEditing ? '✓ Done' : '✏️ Edit'}
                  </button>
                </div>
              </div>

              {/* View mode */}
              {!isEditing ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10
                }}>
                  {[
                    { label: 'Amount', value: `₹${editedData.amount?.toLocaleString('en-IN')}` },
                    { label: 'Type', value: editedData.type === 'credit' ? '💰 Credit' : '💸 Debit' },
                    { label: 'Merchant', value: editedData.merchant },
                    { label: 'Category', value: `${CATEGORY_EMOJIS[editedData.category] || ''} ${editedData.category}` },
                    { label: 'Bank', value: parsed.bank },
                    { label: 'Date', value: editedData.date || 'Today' }
                  ].map((item, i) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: 8, padding: '8px 12px'
                    }}>
                      <div style={{
                        fontSize: 10, color: '#94A3B8',
                        marginBottom: 3
                      }}>
                        {item.label}
                      </div>
                      <div style={{
                        fontSize: 13, fontWeight: 600,
                        color: '#F5F5F5'
                      }}>
                        {item.value || '—'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Edit mode */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  {/* Amount */}
                  <div>
                    <label style={{
                      fontSize: 11, color: '#94A3B8',
                      marginBottom: 5, display: 'block'
                    }}>
                      Amount
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute', left: 12,
                        top: '50%', transform: 'translateY(-50%)',
                        color: '#8B5CF6', fontWeight: 600, fontSize: 14
                      }}>₹</span>
                      <input
                        type="number"
                        value={editedData.amount}
                        onChange={e => setEditedData({
                          ...editedData,
                          amount: Number(e.target.value)
                        })}
                        className="input-dark"
                        style={{ paddingLeft: 28, fontSize: 15, fontWeight: 600 }}
                      />
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <label style={{
                      fontSize: 11, color: '#94A3B8',
                      marginBottom: 5, display: 'block'
                    }}>
                      Type
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {['debit', 'credit'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setEditedData({ ...editedData, type })}
                          style={{
                            flex: 1, padding: '9px',
                            borderRadius: 8,
                            border: editedData.type === type
                              ? `1px solid ${type === 'debit' ? 'rgba(255,77,77,0.5)' : 'rgba(0,210,106,0.5)'}`
                              : '1px solid rgba(255,255,255,0.08)',
                            background: editedData.type === type
                              ? type === 'debit'
                                ? 'rgba(255,77,77,0.1)'
                                : 'rgba(0,210,106,0.1)'
                              : 'rgba(255,255,255,0.03)',
                            color: editedData.type === type
                              ? type === 'debit' ? '#FF4D4D' : '#00D26A'
                              : '#94A3B8',
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 12, fontWeight: 600,
                            transition: 'all 0.2s'
                          }}
                        >
                          {type === 'debit' ? '💸 Expense' : '💰 Income'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Merchant */}
                  <div>
                    <label style={{
                      fontSize: 11, color: '#94A3B8',
                      marginBottom: 5, display: 'block'
                    }}>
                      Merchant
                    </label>
                    <input
                      type="text"
                      value={editedData.merchant}
                      onChange={e => setEditedData({
                        ...editedData, merchant: e.target.value
                      })}
                      className="input-dark"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label style={{
                      fontSize: 11, color: '#94A3B8',
                      marginBottom: 5, display: 'block'
                    }}>
                      Category
                    </label>
                    <select
                      value={editedData.category}
                      onChange={e => setEditedData({
                        ...editedData, category: e.target.value
                      })}
                      className="input-dark"
                      style={{ cursor: 'pointer' }}
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(cat => (
                        <option
                          key={cat} value={cat}
                          style={{ background: '#0D0D1A' }}
                        >
                          {CATEGORY_EMOJIS[cat]} {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label style={{
                      fontSize: 11, color: '#94A3B8',
                      marginBottom: 5, display: 'block'
                    }}>
                      Date
                    </label>
                    <input
                      type="date"
                      value={editedData.date || new Date().toISOString().split('T')[0]}
                      onChange={e => setEditedData({
                        ...editedData, date: e.target.value
                      })}
                      className="input-dark"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleSave}
                className="btn-primary"
                disabled={saving}
                style={{
                  width: '100%', padding: '12px',
                  marginTop: 16, fontSize: 14,
                  opacity: saving ? 0.7 : 1
                }}
              >
                {saving ? 'Saving...' : '✅ Confirm & Save Transaction'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </motion.div>
    </div>
  );
};

// Statement Upload Modal
const StatementModal = ({ onClose, onSave }) => {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedRows, setEditedRows] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    const allowed = ['text/csv', 'application/pdf', 'application/vnd.ms-excel'];
    const isAllowed = allowed.includes(selectedFile.type) ||
      selectedFile.name.endsWith('.csv') ||
      selectedFile.name.endsWith('.pdf');

    if (!isAllowed) {
      setError('Only CSV and PDF files are supported');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB');
      return;
    }
    setFile(selectedFile);
    setError('');
    setPreview(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    handleFileSelect(dropped);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('statement', file);

      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/api/statements/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      // Initialize all rows as selected
      setPreview(data);
      setSelectedRows(data.transactions.map((_, i) => i));
      setEditedRows(data.transactions.map(t => ({ ...t })));

    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const toggleRow = (index) => {
    setSelectedRows(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === editedRows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(editedRows.map((_, i) => i));
    }
  };

  const updateRow = (index, field, value) => {
    setEditedRows(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleConfirm = async () => {
    const toSave = selectedRows.map(i => editedRows[i]);
    if (toSave.length === 0) {
      setError('Select at least one transaction to import');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/api/statements/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ transactions: toSave })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      onSave();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.8)',
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
          borderRadius: 20,
          width: '100%',
          maxWidth: preview ? 900 : 480,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'max-width 0.3s ease'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '24px 28px',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>
              Upload Bank Statement
            </h3>
            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 3 }}>
              {preview
                ? `Found ${preview.validCount} transactions — review and confirm`
                : 'CSV or PDF — supports HDFC, SBI, ICICI, Axis and more'
              }
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)',
            border: 'none', borderRadius: 8,
            padding: 8, cursor: 'pointer',
            color: '#94A3B8',
            display: 'flex', alignItems: 'center'
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

          {error && (
            <div style={{
              background: 'rgba(255,77,77,0.1)',
              border: '1px solid rgba(255,77,77,0.3)',
              borderRadius: 10, padding: '10px 14px',
              marginBottom: 16, fontSize: 13, color: '#FF4D4D',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Upload area — shown before preview */}
          {!preview && (
            <>
              {/* Drag and drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? '#8B5CF6' : file ? 'rgba(0,210,106,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 16,
                  padding: '48px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: dragOver
                    ? 'rgba(139,92,246,0.05)'
                    : file
                      ? 'rgba(0,210,106,0.05)'
                      : 'rgba(255,255,255,0.02)',
                  transition: 'all 0.2s ease',
                  marginBottom: 20
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.pdf"
                  style={{ display: 'none' }}
                  onChange={e => handleFileSelect(e.target.files[0])}
                />

                {file ? (
                  <>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>
                      {file.name.endsWith('.pdf') ? '📄' : '📊'}
                    </div>
                    <div style={{
                      fontSize: 15, fontWeight: 600,
                      color: '#00D26A', marginBottom: 4
                    }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#94A3B8' }}>
                      {(file.size / 1024).toFixed(1)} KB — click to change
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>📂</div>
                    <div style={{
                      fontSize: 15, fontWeight: 600,
                      marginBottom: 6
                    }}>
                      Drop your bank statement here
                    </div>
                    <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>
                      or click to browse
                    </div>
                    <div style={{
                      display: 'inline-flex', gap: 8
                    }}>
                      {['CSV', 'PDF'].map(fmt => (
                        <span key={fmt} style={{
                          fontSize: 11, fontWeight: 600,
                          background: 'rgba(139,92,246,0.15)',
                          color: '#8B5CF6',
                          padding: '3px 10px', borderRadius: 20
                        }}>
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Supported banks */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12, padding: '14px 16px',
                marginBottom: 20
              }}>
                <div style={{
                  fontSize: 11, color: '#94A3B8',
                  marginBottom: 8, fontWeight: 500
                }}>
                  SUPPORTED BANKS
                </div>
                <div style={{
                  display: 'flex', gap: 8, flexWrap: 'wrap'
                }}>
                  {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Yes Bank', 'PNB', 'BOB', 'Canara'].map(bank => (
                    <span key={bank} style={{
                      fontSize: 12, color: '#94A3B8',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '3px 10px', borderRadius: 20
                    }}>
                      {bank}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleUpload}
                className="btn-primary"
                disabled={!file || uploading}
                style={{
                  width: '100%', padding: '14px',
                  fontSize: 15,
                  opacity: (!file || uploading) ? 0.6 : 1,
                  cursor: (!file || uploading) ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8
                }}
              >
                {uploading ? (
                  <>
                    <div style={{
                      width: 16, height: 16,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    {file?.name?.endsWith('.pdf')
                      ? 'Extracting with AI...'
                      : 'Parsing CSV...'
                    }
                  </>
                ) : (
                  <>✨ Parse Statement</>
                )}
              </button>
            </>
          )}

          {/* Preview table — shown after parsing */}
          {preview && (
            <>
              {/* Summary bar */}
              <div style={{
                display: 'flex', gap: 12,
                marginBottom: 16, flexWrap: 'wrap'
              }}>
                {[
                  {
                    label: 'Found',
                    value: preview.validCount,
                    color: '#8B5CF6',
                    bg: 'rgba(139,92,246,0.1)'
                  },
                  {
                    label: 'Selected',
                    value: selectedRows.length,
                    color: '#00D26A',
                    bg: 'rgba(0,210,106,0.1)'
                  },
                  {
                    label: 'Total Debit',
                    value: `₹${editedRows
                      .filter((_, i) => selectedRows.includes(i) && editedRows[i].type === 'debit')
                      .reduce((s, t) => s + t.amount, 0)
                      .toLocaleString('en-IN')}`,
                    color: '#FF4D4D',
                    bg: 'rgba(255,77,77,0.1)'
                  },
                  {
                    label: 'Total Credit',
                    value: `₹${editedRows
                      .filter((_, i) => selectedRows.includes(i) && editedRows[i].type === 'credit')
                      .reduce((s, t) => s + t.amount, 0)
                      .toLocaleString('en-IN')}`,
                    color: '#00D26A',
                    bg: 'rgba(0,210,106,0.1)'
                  }
                ].map((stat, index) => (
                  <div key={index} style={{
                    flex: '1 1 180px',
                    minWidth: 150,
                    background: stat.bg,
                    border: `1px solid ${stat.color}33`,
                    borderRadius: 12,
                    padding: '12px 14px'
                  }}>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>
                      {stat.label}
                    </div>
                    <div style={{
                      fontSize: 18, fontWeight: 700,
                      color: stat.color
                    }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                overflow: 'hidden'
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <th style={{
                          textAlign: 'left', padding: '12px 14px',
                          color: '#94A3B8', fontSize: 11, fontWeight: 600
                        }}>
                          <input
                            type="checkbox"
                            checked={selectedRows.length === editedRows.length}
                            onChange={toggleAll}
                            style={{ accentColor: '#8B5CF6' }}
                          />
                        </th>
                        <th style={{ textAlign: 'left', padding: '12px 14px', color: '#94A3B8', fontSize: 11, fontWeight: 600 }}>Merchant</th>
                        <th style={{ textAlign: 'left', padding: '12px 14px', color: '#94A3B8', fontSize: 11, fontWeight: 600 }}>Type</th>
                        <th style={{ textAlign: 'left', padding: '12px 14px', color: '#94A3B8', fontSize: 11, fontWeight: 600 }}>Category</th>
                        <th style={{ textAlign: 'left', padding: '12px 14px', color: '#94A3B8', fontSize: 11, fontWeight: 600 }}>Date</th>
                        <th style={{ textAlign: 'right', padding: '12px 14px', color: '#94A3B8', fontSize: 11, fontWeight: 600 }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editedRows.map((row, index) => (
                        <tr key={index} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(index)}
                              onChange={() => toggleRow(index)}
                              style={{ accentColor: '#8B5CF6' }}
                            />
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <input
                              value={row.merchant || ''}
                              onChange={e => updateRow(index, 'merchant', e.target.value)}
                              className="input-dark"
                              style={{ minWidth: 150 }}
                            />
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <select
                              value={row.type || 'debit'}
                              onChange={e => updateRow(index, 'type', e.target.value)}
                              className="input-dark"
                              style={{ minWidth: 90 }}
                            >
                              <option value="debit">Debit</option>
                              <option value="credit">Credit</option>
                            </select>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <select
                              value={row.category || 'Other'}
                              onChange={e => updateRow(index, 'category', e.target.value)}
                              className="input-dark"
                              style={{ minWidth: 120 }}
                            >
                              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <input
                              type="date"
                              value={row.date || new Date().toISOString().split('T')[0]}
                              onChange={e => updateRow(index, 'date', e.target.value)}
                              className="input-dark"
                            />
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <input
                              type="number"
                              value={row.amount || 0}
                              onChange={e => updateRow(index, 'amount', Number(e.target.value))}
                              className="input-dark"
                              style={{ width: 120, textAlign: 'right' }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginTop: 18, gap: 12, flexWrap: 'wrap'
              }}>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>
                  {selectedRows.length} transaction{selectedRows.length === 1 ? '' : 's'} selected
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={toggleAll}
                    className="btn-secondary"
                    style={{ padding: '10px 16px', fontSize: 12 }}
                  >
                    {selectedRows.length === editedRows.length ? 'Deselect all' : 'Select all'}
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="btn-primary"
                    disabled={saving || selectedRows.length === 0}
                    style={{
                      padding: '10px 18px', fontSize: 12,
                      opacity: saving || selectedRows.length === 0 ? 0.6 : 1
                    }}
                  >
                    {saving ? 'Saving...' : '✅ Confirm & Import'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Main Transactions Page
const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionAPI.getAll();
      const data = response?.data ?? [];
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...transactions];

    if (selectedCategory !== 'All') {
      result = result.filter(t => t.category === selectedCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.merchant.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    setFiltered(result);
  }, [transactions, search, selectedCategory]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await transactionAPI.delete(id);
      setTransactions(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const totalIncome = filtered
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filtered
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Layout>
      <div style={{ maxWidth: 1000 }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 24
        }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
              Transactions
            </h1>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>
              {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
              {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowStatementModal(true)}
              className="btn-secondary"
              style={{
                padding: '10px 18px', fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <Filter size={15} />
              Upload Statement
            </button>
            <button
              onClick={() => setShowSMSModal(true)}
              className="btn-secondary"
              style={{
                padding: '10px 18px', fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <MessageSquare size={15} />
              Paste SMS
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
              style={{
                padding: '10px 18px', fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <Plus size={15} />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Summary row */}
        <div style={{
          display: 'flex', gap: 16,
          marginBottom: 24
        }}>
          {[
            {
              label: 'Total Income',
              value: `₹${totalIncome.toLocaleString('en-IN')}`,
              color: '#00D26A',
              bg: 'rgba(0,210,106,0.1)',
              border: 'rgba(0,210,106,0.2)'
            },
            {
              label: 'Total Expenses',
              value: `₹${totalExpense.toLocaleString('en-IN')}`,
              color: '#FF4D4D',
              bg: 'rgba(255,77,77,0.1)',
              border: 'rgba(255,77,77,0.2)'
            },
            {
              label: 'Net',
              value: `₹${(totalIncome - totalExpense).toLocaleString('en-IN')}`,
              color: totalIncome >= totalExpense ? '#00D26A' : '#FF4D4D',
              bg: 'rgba(139,92,246,0.1)',
              border: 'rgba(139,92,246,0.2)'
            }
          ].map((stat, i) => (
            <div key={i} style={{
              flex: 1,
              background: stat.bg,
              border: `1px solid ${stat.border}`,
              borderRadius: 12, padding: '14px 18px'
            }}>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 4 }}>
                {stat.label}
              </div>
              <div style={{
                fontSize: 20, fontWeight: 700,
                color: stat.color
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div style={{
          display: 'flex', gap: 12,
          marginBottom: 20, flexWrap: 'wrap'
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} style={{
              position: 'absolute', left: 14,
              top: '50%', transform: 'translateY(-50%)',
              color: '#94A3B8'
            }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="input-dark"
              style={{ paddingLeft: 40 }}
            />
          </div>

          {/* Category filter */}
          <div style={{
            display: 'flex', gap: 8,
            flexWrap: 'wrap', alignItems: 'center'
          }}>
            <Filter size={14} color="#94A3B8" />
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 20,
                  border: selectedCategory === cat
                    ? '1px solid rgba(139,92,246,0.5)'
                    : '1px solid rgba(255,255,255,0.08)',
                  background: selectedCategory === cat
                    ? 'rgba(139,92,246,0.15)'
                    : 'rgba(255,255,255,0.03)',
                  color: selectedCategory === cat ? '#8B5CF6' : '#94A3B8',
                  fontSize: 12, fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat !== 'All' && CATEGORY_EMOJIS[cat]} {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction List */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{
              display: 'flex', justifyContent: 'center',
              alignItems: 'center', padding: '60px 0',
              flexDirection: 'column', gap: 16
            }}>
              <div style={{
                width: 36, height: 36,
                border: '3px solid rgba(139,92,246,0.2)',
                borderTop: '3px solid #8B5CF6',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              <p style={{ color: '#94A3B8', fontSize: 13 }}>
                Loading transactions...
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px'
            }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>💸</div>
              <h3 style={{
                fontSize: 16, fontWeight: 600,
                marginBottom: 8
              }}>
                {search || selectedCategory !== 'All'
                  ? 'No matching transactions'
                  : 'No transactions yet'
                }
              </h3>
              <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 20 }}>
                {search || selectedCategory !== 'All'
                  ? 'Try adjusting your search or filter'
                  : 'Add your first transaction or paste a bank SMS'
                }
              </p>
              {!search && selectedCategory === 'All' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary"
                  style={{ padding: '10px 24px', fontSize: 13 }}
                >
                  Add Transaction
                </button>
              )}
            </div>
          ) : (
            <div>
              {/* Table header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 40px',
                gap: 16, padding: '14px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontSize: 11, color: '#94A3B8',
                fontWeight: 500, letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                <span>Merchant</span>
                <span>Category</span>
                <span>Date</span>
                <span style={{ textAlign: 'right' }}>Amount</span>
                <span />
              </div>

              {/* Rows */}
              <AnimatePresence>
                {filtered.map((tx, i) => (
                  <motion.div
                    key={tx._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.03 }}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 40px',
                      gap: 16, padding: '16px 24px',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      alignItems: 'center',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {/* Merchant */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center', gap: 12
                    }}>
                      <div style={{
                        width: 38, height: 38,
                        borderRadius: 10,
                        background: tx.type === 'credit'
                          ? 'rgba(0,210,106,0.15)'
                          : 'rgba(255,77,77,0.15)',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 16,
                        flexShrink: 0
                      }}>
                        {tx.type === 'credit' ? '💰' : (CATEGORY_EMOJIS[tx.category] || '💸')}
                      </div>
                      <div>
                        <div style={{
                          fontSize: 14, fontWeight: 500,
                          color: '#F5F5F5'
                        }}>
                          {tx.merchant}
                        </div>
                        {tx.description && (
                          <div style={{
                            fontSize: 11, color: '#94A3B8',
                            marginTop: 2
                          }}>
                            {tx.description}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <span style={{
                        fontSize: 12,
                        background: `rgba(${CATEGORY_COLORS[tx.category] === '#94A3B8' ? '148,163,184' : '139,92,246'},0.15)`,
                        color: CATEGORY_COLORS[tx.category] || '#94A3B8',
                        padding: '4px 10px',
                        borderRadius: 20, fontWeight: 500
                      }}>
                        {tx.category}
                      </span>
                    </div>

                    {/* Date */}
                    <div style={{ fontSize: 13, color: '#94A3B8' }}>
                      {new Date(tx.date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short'
                      })}
                    </div>

                    {/* Amount */}
                    <div style={{
                      fontSize: 15, fontWeight: 700,
                      color: tx.type === 'credit' ? '#00D26A' : '#FF4D4D',
                      textAlign: 'right'
                    }}>
                      {tx.type === 'credit' ? '+' : '-'}
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(tx._id)}
                      disabled={deletingId === tx._id}
                      style={{
                        background: 'none', border: 'none',
                        color: '#94A3B8', cursor: 'pointer',
                        padding: 6, borderRadius: 6,
                        display: 'flex', alignItems: 'center',
                        opacity: deletingId === tx._id ? 0.5 : 1,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = '#FF4D4D';
                        e.currentTarget.style.background = 'rgba(255,77,77,0.1)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = '#94A3B8';
                        e.currentTarget.style.background = 'none';
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <AddTransactionModal
            onClose={() => setShowAddModal(false)}
            onSave={fetchTransactions}
          />
        )}
        {showSMSModal && (
          <SMSModal
            onClose={() => setShowSMSModal(false)}
            onSave={fetchTransactions}
          />
        )}
        {showStatementModal && (
          <StatementModal
            onClose={() => setShowStatementModal(false)}
            onSave={fetchTransactions}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default TransactionsPage;