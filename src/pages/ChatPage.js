import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Trash2, User } from 'lucide-react';
import Layout from '../components/Layout';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';


const SUGGESTED_QUESTIONS = [
  { text: 'Where did my money go this month?', emoji: '💸' },
  { text: 'Can I afford a trip?', emoji: '✈️' },
  { text: 'How can I save more?', emoji: '💰' },
  { text: 'Analyze my spending', emoji: '📊' }
];

const ChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchHistory = async () => {
    try {
      const { data } = await chatAPI.getHistory();
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSend = async (textOverride) => {
    const messageText = textOverride || input.trim();
    if (!messageText || sending) return;

    setInput('');
    setSending(true);

    // Optimistically add user message
    const userMessage = {
      role: 'user',
      message: messageText,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const { data } = await chatAPI.sendMessage(messageText);

      const aiMessage = {
        role: 'assistant',
        message: data.message,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      const errorMessage = {
        role: 'assistant',
        message: "Sorry, I couldn't process that right now. Please try again.",
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleClearChat = async () => {
    try {
      await chatAPI.clearHistory();
      setMessages([]);
    } catch (err) {
      console.error('Error clearing chat:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Layout>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 140px)',
        maxWidth: 900
      }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 15px rgba(139,92,246,0.3)',
                  '0 0 25px rgba(139,92,246,0.5)',
                  '0 0 15px rgba(139,92,246,0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: 44, height: 44,
                background: 'linear-gradient(135deg, #8B5CF6, #00E5FF)',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <Sparkles size={22} color="white" />
            </motion.div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>
                FinGenie AI
              </h2>
              <div style={{
                fontSize: 12, color: '#00D26A',
                display: 'flex', alignItems: 'center', gap: 4
              }}>
                <div style={{
                  width: 6, height: 6,
                  background: '#00D26A',
                  borderRadius: '50%'
                }} />
                Online
              </div>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, padding: '8px 14px',
                color: '#94A3B8', cursor: 'pointer',
                fontSize: 12, fontFamily: 'Inter, sans-serif',
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <Trash2 size={13} />
              Clear chat
            </button>
          )}
        </div>

        {/* Messages container */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 4px 20px',
          display: 'flex',
          flexDirection: 'column'
        }}>

          {loadingHistory ? (
            <div style={{
              display: 'flex', justifyContent: 'center',
              alignItems: 'center', flex: 1
            }}>
              <div style={{
                width: 32, height: 32,
                border: '3px solid rgba(139,92,246,0.2)',
                borderTop: '3px solid #8B5CF6',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : messages.length === 0 ? (
            /* Empty state with suggestions */
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  width: 72, height: 72,
                  background: 'rgba(139,92,246,0.15)',
                  border: '1px solid rgba(139,92,246,0.3)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 24
                }}
              >
                <Sparkles size={32} color="#8B5CF6" />
              </motion.div>

              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                Hey {user?.name?.split(' ')[0]}, ask me anything
              </h3>
              <p style={{
                fontSize: 14, color: '#94A3B8',
                marginBottom: 32, maxWidth: 380
              }}>
                I know your real spending data. Ask me about your
                finances, goals, or whether you can afford something.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10, width: '100%', maxWidth: 480
              }}>
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleSend(q.text)}
                    className="glass-card"
                    style={{
                      padding: '14px 16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      border: 'none',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 13, color: '#F5F5F5',
                      display: 'flex', alignItems: 'center', gap: 10
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{q.emoji}</span>
                    {q.text}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            /* Chat messages */
            <>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: 16,
                    gap: 10,
                    alignItems: 'flex-start'
                  }}
                >
                  {/* AI avatar */}
                  {msg.role === 'assistant' && (
                    <div style={{
                      width: 32, height: 32,
                      background: 'linear-gradient(135deg, #8B5CF6, #00E5FF)',
                      borderRadius: 10,
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0
                    }}>
                      <Sparkles size={15} color="white" />
                    </div>
                  )}

                  <div style={{
                    maxWidth: '70%',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #8B5CF6, #6366F1)'
                      : msg.isError
                        ? 'rgba(255,77,77,0.1)'
                        : 'rgba(255,255,255,0.05)',
                    border: msg.role === 'assistant'
                      ? '1px solid rgba(255,255,255,0.08)'
                      : 'none',
                    borderRadius: msg.role === 'user'
                      ? '16px 16px 4px 16px'
                      : '16px 16px 16px 4px',
                    padding: '12px 16px',
                  }}>
                    <div style={{
                      fontSize: 14, color: '#F5F5F5',
                      lineHeight: 1.6
                    }}>
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p style={{ margin: 0, marginBottom: 6 }}>{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong style={{
                              color: msg.role === 'user' ? '#FFFFFF' : '#8B5CF6',
                              fontWeight: 700
                            }}>
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em style={{ color: '#00E5FF' }}>{children}</em>
                          ),
                          ul: ({ children }) => (
                            <ul style={{ margin: '6px 0', paddingLeft: 18 }}>{children}</ul>
                          ),
                          li: ({ children }) => (
                            <li style={{ marginBottom: 4 }}>{children}</li>
                          ),
                          code: ({ children }) => (
                            <code style={{
                              background: 'rgba(139,92,246,0.15)',
                              padding: '2px 6px', borderRadius: 4,
                              fontSize: 13, color: '#00E5FF'
                            }}>
                              {children}
                            </code>
                          )
                        }}
                      >
                        {msg.message}
                      </ReactMarkdown>
                    </div>
                    <div style={{
                      fontSize: 10, color: 'rgba(255,255,255,0.4)',
                      marginTop: 6
                    }}>
                      {new Date(msg.timestamp).toLocaleTimeString('en-IN', {
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {/* User avatar */}
                  {msg.role === 'user' && (
                    <div style={{
                      width: 32, height: 32,
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: 10,
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0,
                      fontSize: 12, fontWeight: 700
                    }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {sending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: 'flex',
                    gap: 10, alignItems: 'flex-start',
                    marginBottom: 16
                  }}
                >
                  <div style={{
                    width: 32, height: 32,
                    background: 'linear-gradient(135deg, #8B5CF6, #00E5FF)',
                    borderRadius: 10,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0
                  }}>
                    <Sparkles size={15} color="white" />
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px 16px 16px 4px',
                    padding: '14px 18px',
                    display: 'flex', gap: 4
                  }}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15
                        }}
                        style={{
                          width: 7, height: 7,
                          background: '#8B5CF6',
                          borderRadius: '50%'
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: 8,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 8
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask FinGenie anything about your money..."
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#F5F5F5',
              fontSize: 14,
              fontFamily: 'Inter, sans-serif',
              padding: '10px 12px',
              resize: 'none',
              maxHeight: 120
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            style={{
              background: input.trim()
                ? 'linear-gradient(135deg, #8B5CF6, #6366F1)'
                : 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: 12,
              width: 42, height: 42,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              flexShrink: 0,
              transition: 'all 0.2s'
            }}
          >
            <Send size={17} color={input.trim() ? 'white' : '#94A3B8'} />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;