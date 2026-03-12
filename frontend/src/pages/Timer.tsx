import React, { useState, useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import { activitiesAPI, activityRecordsAPI } from '../services/api';

interface Activity {
  id: number;
  name: string;
  category: string;
  color: string;
}

const predefinedActivities = [
  { name: 'Dormir', emoji: '😴', color: '#d4a5ff' },
  { name: 'Ejercicio', emoji: '💪', color: '#7fe5b3' },
  { name: 'Estudiar', emoji: '📚', color: '#9bcaff' },
  { name: 'Programar', emoji: '💻', color: '#ffd4b8' },
];

export const Timer: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [activityName, setActivityName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const {
    elapsedTime,
    isRunning,
    formattedTime,
    start,
    pause,
    reset,
    stop,
    startTime
  } = useTimer({
    onTick: (time) => {
      document.title = `${formattedTime} - Timer ⏰`;
    }
  });

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const response = await activitiesAPI.getAll();
      setActivities(response.data);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const handleStart = () => {
    if (!selectedActivity && !activityName) {
      alert('Por favor selecciona o crea una actividad ✨');
      return;
    }
    start();
  };

  const handleStop = async () => {
    stop();
    
    if (selectedActivity && startTime) {
      try {
        await activityRecordsAPI.create({
          activity_id: selectedActivity,
          start_time: startTime.toISOString(),
          end_time: new Date().toISOString(),
          duration_seconds: elapsedTime,
        });
        setLastSaved(new Date());
        showNotification('¡Actividad registrada exitosamente! 💖', 'success');
      } catch (error) {
        console.error('Error saving activity:', error);
        showNotification('Error al guardar la actividad', 'error');
      }
    }
    
    setTimeout(() => reset(), 500);
  };

  const handleCreateCustomActivity = async () => {
    if (!activityName.trim()) {
      alert('Por favor ingresa un nombre para la actividad ✨');
      return;
    }

    try {
      const response = await activitiesAPI.create({
        name: activityName,
        category: 'custom',
        color: '#ffb7c5',
      });
      setSelectedActivity(response.data.id);
      setActivityName('');
      setShowCustomInput(false);
      showNotification('¡Actividad creada exitosamente! 🎀', 'success');
    } catch (error) {
      console.error('Error creating activity:', error);
      showNotification('Error al crear la actividad', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${type === 'success' ? 'linear-gradient(135deg, #7fe5b3 0%, #b8f0d0 100%)' : 'linear-gradient(135deg, #ff8fa3 0%, #ffb7c5 100%)'};
      color: white;
      border-radius: 20px;
      box-shadow: 0 8px 16px rgba(255, 183, 197, 0.3);
      z-index: 9999;
      animation: slideIn 0.3s ease-out, float 3s ease-in-out infinite;
      font-weight: 700;
      border: 3px solid white;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'bounce 2s infinite' }}>⏰</div>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 800, 
          background: 'linear-gradient(135deg, #ff8fa3 0%, #d4a5ff 50%, #9bcaff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          Temporalizador Kawaii
        </h1>
        <p style={{ color: '#8b8294', fontSize: '1.1rem' }}>
          ¡Trackea tu tiempo de forma súper linda! 💖✨
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Timer Card */}
        <div className="card animate-scaleIn" style={{ borderRadius: '32px', border: '3px solid #ffb7c5' }}>
          {/* Activity Selection */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.75rem', 
              fontWeight: 700,
              color: '#5a4a5f',
              fontSize: '1.1rem'
            }}>
              📋 Selecciona una actividad
            </label>
            
            {!showCustomInput ? (
              <>
                <select
                  value={selectedActivity || ''}
                  onChange={(e) => setSelectedActivity(Number(e.target.value))}
                  disabled={isRunning}
                  style={{ 
                    width: '100%', 
                    padding: '1rem',
                    fontSize: '1rem',
                    marginBottom: '1rem',
                    cursor: isRunning ? 'not-allowed' : 'pointer',
                    opacity: isRunning ? 0.6 : 1,
                    borderRadius: '20px',
                    border: '2px solid #ffb7c5'
                  }}
                >
                  <option value="">Selecciona una actividad...</option>
                  {activities.map(activity => (
                    <option key={activity.id} value={activity.id}>
                      {activity.name} • {activity.category}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={() => setShowCustomInput(true)}
                  disabled={isRunning}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #fff0f5 0%, #ffd6e0 100%)',
                    border: '2px dashed #ff8fa3',
                    color: '#ff8fa3',
                    padding: '0.75rem 1rem',
                    borderRadius: '20px',
                    cursor: isRunning ? 'not-allowed' : 'pointer',
                    opacity: isRunning ? 0.5 : 1,
                    fontWeight: 700,
                    transition: 'all 0.3s',
                    fontSize: '0.9375rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!isRunning) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #ffd6e0 0%, #ffb7c5 100%)';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isRunning) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #fff0f5 0%, #ffd6e0 100%)';
                      e.currentTarget.style.color = '#ff8fa3';
                    }
                  }}
                >
                  ✨ Crear actividad personalizada
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="Nombre de la actividad..."
                  disabled={isRunning}
                  style={{ flex: 1, borderRadius: '20px' }}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateCustomActivity()}
                />
                <button onClick={handleCreateCustomActivity} className="btn-primary" disabled={isRunning}>
                  Crear ✨
                </button>
                <button
                  onClick={() => {
                    setShowCustomInput(false);
                    setActivityName('');
                  }}
                  disabled={isRunning}
                  className="btn-secondary"
                  style={{ padding: '0.75rem 1rem' }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Timer Display */}
          <div style={{ 
            textAlign: 'center',
            padding: '2rem 0',
            background: isRunning ? 'linear-gradient(135deg, #d4f8e4 0%, #b8f0d0 100%)' : 'linear-gradient(135deg, #fff0f5 0%, #ffd6e0 100%)',
            borderRadius: '24px',
            marginBottom: '2rem',
            border: `3px solid ${isRunning ? '#7fe5b3' : '#ffb7c5'}`,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{ 
              fontSize: '5rem', 
              fontWeight: 800,
              fontFamily: 'monospace',
              color: isRunning ? '#059669' : '#ff8fa3',
              letterSpacing: '0.25rem',
              transition: 'all 0.3s',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {formattedTime}
            </div>
            {isRunning && (
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                color: '#7fe5b3',
                fontWeight: 700,
                fontSize: '0.9375rem'
              }}>
                <span className="animate-pulse" style={{ width: '10px', height: '10px', background: '#7fe5b3', borderRadius: '50%', display: 'inline-block' }}></span>
                Grabando... 💖
              </div>
            )}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            {!isRunning ? (
              <button onClick={handleStart} className="btn-success" style={{ flex: 1, padding: '1rem', borderRadius: '20px', fontSize: '1rem' }}>
                ▶ Iniciar ✨
              </button>
            ) : (
              <button 
                onClick={pause} 
                style={{ 
                  flex: 1, 
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: 'white',
                  borderRadius: '20px',
                  fontWeight: 700,
                  boxShadow: '0 6px 0 rgba(245, 158, 11, 0.4)',
                  border: '2px solid white',
                  fontSize: '1rem',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}
              >
                ⏸ Pausar
              </button>
            )}
            
            <button
              onClick={handleStop}
              disabled={elapsedTime === 0}
              style={{
                flex: 1,
                padding: '1rem',
                background: 'linear-gradient(135deg, #ff8fa3 0%, #ffb7c5 100%)',
                color: 'white',
                borderRadius: '20px',
                fontWeight: 700,
                boxShadow: '0 6px 0 rgba(255, 143, 163, 0.4)',
                border: '2px solid white',
                fontSize: '1rem',
                opacity: elapsedTime === 0 ? 0.6 : 1,
                cursor: elapsedTime === 0 ? 'not-allowed' : 'pointer',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              ⏹ Detener
            </button>
            
            <button
              onClick={reset}
              disabled={elapsedTime === 0}
              style={{
                padding: '1rem 1.5rem',
                background: 'linear-gradient(135deg, #e9d5ff 0%, #d4a5ff 100%)',
                color: 'white',
                borderRadius: '20px',
                fontWeight: 700,
                boxShadow: '0 6px 0 rgba(212, 165, 255, 0.4)',
                border: '2px solid white',
                fontSize: '1.2rem',
                opacity: elapsedTime === 0 ? 0.6 : 1,
                cursor: elapsedTime === 0 ? 'not-allowed' : 'pointer',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              🔄
            </button>
          </div>

          {lastSaved && (
            <div style={{ 
              marginTop: '1rem', 
              textAlign: 'center', 
              fontSize: '0.875rem', 
              color: '#7fe5b3',
              fontWeight: 700,
              background: '#d4f8e4',
              padding: '0.5rem',
              borderRadius: '12px',
              display: 'inline-block',
              width: '100%'
            }}>
              ✓ Última actividad guardada: {lastSaved.toLocaleTimeString()} 💖
            </div>
          )}
        </div>

        {/* Quick Activities & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Predefined Activities */}
          <div className="card animate-slideIn" style={{ borderRadius: '32px', border: '3px solid #d4a5ff' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🎯</span> Actividades Rápidas
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {predefinedActivities.map(activity => {
                const isSelected = activities.find(a => a.name === activity.name && a.id === selectedActivity);
                return (
                  <button
                    key={activity.name}
                    onClick={() => {
                      const existingActivity = activities.find(a => a.name === activity.name);
                      if (existingActivity) {
                        setSelectedActivity(existingActivity.id);
                      }
                    }}
                    disabled={isRunning}
                    style={{
                      padding: '1rem',
                      border: `3px solid ${isSelected ? activity.color : '#ffd6e0'}`,
                      borderRadius: '20px',
                      background: isSelected ? `${activity.color}30` : 'white',
                      cursor: isRunning ? 'not-allowed' : 'pointer',
                      opacity: isRunning ? 0.6 : 1,
                      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      if (!isRunning) {
                        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(255, 183, 197, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isRunning) {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <span style={{ fontSize: '2.5rem' }}>{activity.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: '#5a4a5f' }}>{activity.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#8b8294' }}>¡Click para seleccionar! ✨</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info Card */}
          <div className="card animate-slideIn" style={{ 
            background: 'linear-gradient(135deg, #d4edff 0%, #e9d5ff 100%)',
            borderRadius: '32px',
            border: '3px solid #9bcaff'
          }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>💡</span> Tips Kawaii
            </h3>
            <ul style={{ paddingLeft: '1.5rem', color: '#5a4a5f', lineHeight: '1.75' }}>
              <li style={{ marginBottom: '0.5rem' }}>Usa la técnica Pomodoro (25 min + 5 min descanso) 🍅</li>
              <li style={{ marginBottom: '0.5rem' }}>Trackea todas tus actividades para ver tu progreso 📊</li>
              <li style={{ marginBottom: '0.5rem' }}>¡Establece metas diarias y celégalas! 🎉</li>
              <li>Revisa tu dashboard para ver tu progreso semanal 💖</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
