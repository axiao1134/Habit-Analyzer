import React, { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [contextWindow, setContextWindow] = useState(30);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMessage: Message = { 
      role: 'user', 
      content: query,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setQuery('');

    try {
      const response = await chatAPI.send(query, contextWindow);
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response.data.answer,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: '❌ Error al procesar tu pregunta. Intenta de nuevo.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    { icon: '📊', text: '¿Cuántas horas estudié esta semana?' },
    { icon: '🔥', text: '¿Cuál es mi racha más larga?' },
    { icon: '⏱️', text: '¿En qué actividad paso más tiempo?' },
    { icon: '📈', text: '¿Cómo ha sido mi consistencia este mes?' },
    { icon: '💡', text: 'Dame consejos para mejorar mi productividad' },
    { icon: '📅', text: '¿Qué hice ayer?' },
  ];

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.1); padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875em;">$1</code>')
      .split('\n')
      .map((line, i) => (
        <p key={i} style={{ marginBottom: line ? '0.5rem' : '0' }}>{line || '\u00A0'}</p>
      ));
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 800, 
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          🤖 Chat con IA
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          Pregúntale al asistente sobre tus hábitos y actividades
        </p>
      </div>

      {/* Chat Container */}
      <div className="card" style={{ 
        padding: 0, 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 250px)',
        minHeight: '500px'
      }}>
        {/* Messages Area */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '1.5rem',
          background: 'linear-gradient(180deg, #f9fafb 0%, white 100%)'
        }}>
          {messages.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem 1rem',
              color: '#6b7280'
            }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                margin: '0 auto 1.5rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
              }}>
                🤖
              </div>
              <h3 style={{ color: '#111827', marginBottom: '0.5rem' }}>
                ¡Hola! Soy tu asistente de hábitos
              </h3>
              <p style={{ marginBottom: '2rem' }}>
                Tengo acceso a todo tu histórico de actividades. ¡Pregúntame lo que quieras!
              </p>
              
              {/* Suggested Questions */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '0.75rem',
                maxWidth: '700px',
                margin: '0 auto'
              }}>
                {suggestedQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(q.text)}
                    style={{
                      padding: '1rem',
                      background: 'white',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#6366f1';
                      e.currentTarget.style.background = '#f5f3ff';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{q.icon}</span>
                    <span style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: '1.5' }}>{q.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className="animate-fadeIn"
                  style={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div style={{
                    maxWidth: '80%',
                    padding: '1rem 1.25rem',
                    borderRadius: '1rem',
                    background: message.role === 'user' 
                      ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                      : 'white',
                    color: message.role === 'user' ? 'white' : '#111827',
                    boxShadow: message.role === 'user'
                      ? '0 4px 6px -1px rgba(99, 102, 241, 0.3)'
                      : '0 2px 4px rgba(0, 0, 0, 0.05)',
                    border: message.role === 'assistant' ? '1px solid #e5e7eb' : 'none'
                  }}>
                    {message.role === 'assistant' ? (
                      <div style={{ fontSize: '0.9375rem', lineHeight: '1.6' }}>
                        {formatMessageContent(message.content)}
                      </div>
                    ) : (
                      <div style={{ fontWeight: 500 }}>
                        {message.content}
                      </div>
                    )}
                    {message.timestamp && (
                      <div style={{ 
                        fontSize: '0.75rem', 
                        marginTop: '0.5rem',
                        opacity: message.role === 'user' ? 0.8 : 0.6
                      }}>
                        {message.timestamp.toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="animate-fadeIn" style={{
                  display: 'flex',
                  justifyContent: 'flex-start'
                }}>
                  <div style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '1rem',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                  }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span className="animate-pulse" style={{
                        width: '8px',
                        height: '8px',
                        background: '#6366f1',
                        borderRadius: '50%',
                        animationDelay: '0s'
                      }}></span>
                      <span className="animate-pulse" style={{
                        width: '8px',
                        height: '8px',
                        background: '#6366f1',
                        borderRadius: '50%',
                        animationDelay: '0.2s'
                      }}></span>
                      <span className="animate-pulse" style={{
                        width: '8px',
                        height: '8px',
                        background: '#6366f1',
                        borderRadius: '50%',
                        animationDelay: '0.4s'
                      }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div style={{
          padding: '1rem 1.5rem',
          background: 'white',
          borderTop: '1px solid #e5e7eb'
        }}>
          {/* Context Window Slider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            background: '#f9fafb',
            borderRadius: '0.5rem'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>
              📅 Ventana de contexto:
            </span>
            <input
              type="range"
              min="1"
              max="365"
              value={contextWindow}
              onChange={(e) => setContextWindow(Number(e.target.value))}
              style={{ flex: 1, cursor: 'pointer' }}
            />
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              color: '#6366f1',
              minWidth: '80px',
              textAlign: 'right'
            }}>
              {contextWindow} días
            </span>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pregunta sobre tus actividades..."
              disabled={loading}
              style={{ 
                flex: 1, 
                padding: '1rem 1.25rem',
                fontSize: '1rem',
                borderRadius: '0.75rem'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading || !query.trim()}
              style={{
                padding: '1rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? (
                <>
                  <span className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
                  Enviando...
                </>
              ) : (
                <>
                  📤 Enviar
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Info Card */}
      <div className="card mt-6" style={{ 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        border: '1px solid rgba(99, 102, 241, 0.2)'
      }}>
        <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          💡 ¿Cómo funciona?
        </h4>
        <p style={{ fontSize: '0.9375rem', color: '#4b5563', lineHeight: '1.7' }}>
          Este chat utiliza un modelo de lenguaje (LLM) conectado a tu base de datos de actividades.
          Puede analizar tus patrones, responder preguntas específicas y darte insights personalizados 
          sobre tus hábitos. La <strong>ventana de contexto</strong> determina cuántos días de histórico 
          se envían al modelo para generar respuestas más precisas.
        </p>
      </div>
    </div>
  );
};
