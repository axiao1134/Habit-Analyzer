import React, { useState, useEffect } from 'react';
import { habitsAPI } from '../services/api';

interface Habit {
  id: number;
  name: string;
  target_days: string;
  streak: number;
  best_streak: number;
  created_at: string;
}

const daysMap = [
  { key: 'M', label: 'Lun', full: 'Lunes' },
  { key: 'T', label: 'Mar', full: 'Martes' },
  { key: 'W', label: 'Mié', full: 'Miércoles' },
  { key: 'T', label: 'Jue', full: 'Jueves' },
  { key: 'F', label: 'Vie', full: 'Viernes' },
  { key: 'S', label: 'Sáb', full: 'Sábado' },
  { key: 'S', label: 'Dom', full: 'Domingo' }
];

export const Habits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [newHabit, setNewHabit] = useState({
    name: '',
    target_days: 'MTWTFSS',
    target_duration: 30
  });

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const response = await habitsAPI.getAll();
      setHabits(response.data);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await habitsAPI.create({
        name: newHabit.name,
        target_days: newHabit.target_days,
        target_duration: newHabit.target_duration * 60
      });
      setNewHabit({ name: '', target_days: 'MTWTFSS', target_duration: 30 });
      loadHabits();
      showNotification('¡Hábito creado exitosamente! 🎀✨', 'success');
    } catch (error) {
      console.error('Error creating habit:', error);
      showNotification('Error al crear el hábito', 'error');
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await habitsAPI.complete(id);
      loadHabits();
      showNotification('¡Hábito completado! 🔥💖', 'success');
    } catch (error) {
      console.error('Error completing habit:', error);
      showNotification('Error al completar el hábito', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás segura de eliminar este hábito? 💔')) {
      try {
        await habitsAPI.delete(id);
        loadHabits();
        showNotification('Hábito eliminado', 'success');
      } catch (error) {
        console.error('Error deleting habit:', error);
        showNotification('Error al eliminar el hábito', 'error');
      }
    }
  };

  const toggleDay = (day: string) => {
    const current = newHabit.target_days;
    if (current.includes(day)) {
      setNewHabit({ ...newHabit, target_days: current.replace(day, '') });
    } else {
      setNewHabit({ ...newHabit, target_days: current + day });
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="loading-spinner"></div>
        <span style={{ marginLeft: '1rem', fontSize: '1.5rem' }}>Cargando hábitos... ✨</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header Kawaii */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'bounce 2s infinite' }}>🎯</div>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 800, 
          background: 'linear-gradient(135deg, #ff8fa3 0%, #d4a5ff 50%, #9bcaff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          Construcción de Hábitos ✨
        </h1>
        <p style={{ color: '#8b8294', fontSize: '1.1rem' }}>
          ¡Crea hábitos positivos y mantén tu racha! 💖🔥
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {/* Create Habit Form */}
        <div>
          <div className="card animate-scaleIn" style={{ borderRadius: '32px', border: '3px solid #d4a5ff' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#5a4a5f' }}>
              <span style={{ fontSize: '1.5rem' }}>✨</span> Crear Nuevo Hábito
            </h3>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 700,
                  color: '#5a4a5f',
                  fontSize: '1rem'
                }}>
                  Nombre del hábito
                </label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  placeholder="Ej: Meditar 10 minutos 💆"
                  style={{ width: '100%', borderRadius: '20px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: 700,
                  color: '#5a4a5f',
                  fontSize: '1rem'
                }}>
                  Días objetivo
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
                    const isActive = newHabit.target_days.includes(day);
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => toggleDay(day)}
                        title={daysMap[index].full}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          background: isActive 
                            ? 'linear-gradient(135deg, #d4a5ff 0%, #ffb7c5 100%)'
                            : '#f5f3f8',
                          color: isActive ? 'white' : '#8b8294',
                          border: `2px solid ${isActive ? '#d4a5ff' : '#e5e5e5'}`,
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                          transform: isActive ? 'scale(1.15)' : 'scale(1)'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = '#ffd6e0';
                            e.currentTarget.style.borderColor = '#ffb7c5';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = '#f5f3f8';
                            e.currentTarget.style.borderColor = '#e5e5e5';
                          }
                        }}
                      >
                        {daysMap[index].label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 700,
                  color: '#5a4a5f',
                  fontSize: '1rem'
                }}>
                  Duración objetivo (minutos) ⏰
                </label>
                <input
                  type="number"
                  value={newHabit.target_duration}
                  onChange={(e) => setNewHabit({ ...newHabit, target_duration: Number(e.target.value) })}
                  min="1"
                  max="1440"
                  style={{ width: '100%', borderRadius: '20px' }}
                />
                <div style={{ fontSize: '0.875rem', color: '#8b8294', marginTop: '0.5rem', fontWeight: 600 }}>
                  Equivale a {Math.floor(newHabit.target_duration / 60)}h {newHabit.target_duration % 60}m ✨
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', borderRadius: '20px', fontSize: '1rem' }}>
                🚀 Crear Hábito ✨
              </button>
            </form>
          </div>

          {/* Tips Card */}
          <div className="card mt-6" style={{ 
            background: 'linear-gradient(135deg, #fff9d4 0%, #ffe8d4 100%)',
            borderRadius: '32px',
            border: '3px solid #ffd4b8'
          }}>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#5a4a5f' }}>
              <span style={{ fontSize: '1.5rem' }}>💡</span> Consejos Kawaii
            </h4>
            <ul style={{ paddingLeft: '1.5rem', color: '#5a4a5f', lineHeight: '1.75', fontSize: '0.9375rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Empieza con hábitos pequeños y específicos 🌱</li>
              <li style={{ marginBottom: '0.5rem' }}>Asocia el hábito con una rutina existente 🔗</li>
              <li style={{ marginBottom: '0.5rem' }}>¡No rompas la cadena - cada día cuenta! 💖</li>
              <li style={{ marginBottom: '0.5rem' }}>Celebra tus logros por pequeños que sean 🎉</li>
              <li>Se necesitan ~66 días para formar un hábito 📅</li>
            </ul>
          </div>
        </div>

        {/* Habits List */}
        <div>
          <div className="card animate-scaleIn" style={{ borderRadius: '32px', border: '3px solid #ffb7c5' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#5a4a5f' }}>
              <span style={{ fontSize: '1.5rem' }}>🔥</span> Mis Hábitos ({habits.length})
            </h3>
            
            {habits.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#8b8294', padding: '3rem', background: '#fff9f3', borderRadius: '24px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌱</div>
                <h4 style={{ color: '#5a4a5f', marginBottom: '0.5rem', fontWeight: 700 }}>Sin hábitos aún</h4>
                <p>Crea tu primer hábito y comienza tu viaje de crecimiento personal ✨💖</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {habits.map(habit => (
                  <div
                    key={habit.id}
                    className="animate-fadeIn"
                    style={{
                      padding: '1.25rem',
                      border: '2px solid #ffb7c5',
                      borderRadius: '20px',
                      background: 'white',
                      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(255, 183, 197, 0.3)';
                      e.currentTarget.style.borderColor = '#ff8fa3';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = '#ffb7c5';
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#5a4a5f', marginBottom: '0.25rem' }}>
                          {habit.name}
                        </h4>
                        <div style={{ fontSize: '0.875rem', color: '#8b8294', fontWeight: 600 }}>
                          Creado: {new Date(habit.created_at).toLocaleDateString('es-ES')} 📅
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(habit.id)}
                        style={{
                          background: '#fee2e2',
                          border: '2px solid #fecaca',
                          fontSize: '1rem',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          color: '#ef4444',
                          fontWeight: 700
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#ef4444';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.borderColor = '#dc2626';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fee2e2';
                          e.currentTarget.style.color = '#ef4444';
                          e.currentTarget.style.borderColor = '#fecaca';
                        }}
                      >
                        🗑️
                      </button>
                    </div>

                    {/* Days */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      {daysMap.map((day, index) => {
                        const isActive = habit.target_days.includes(day.key);
                        return (
                          <div
                            key={index}
                            title={day.full}
                            style={{
                              flex: 1,
                              textAlign: 'center',
                              padding: '0.5rem 0.25rem',
                              borderRadius: '12px',
                              background: isActive ? 'linear-gradient(135deg, #d4f8e4 0%, #b8f0d0 100%)' : '#f5f3f8',
                              border: `2px solid ${isActive ? '#7fe5b3' : '#e5e5e5'}`,
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ 
                              fontSize: '0.75rem', 
                              fontWeight: 700,
                              color: isActive ? '#059669' : '#8b8294'
                            }}>
                              {day.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #d4f8e4 0%, #b8f0d0 100%)', borderRadius: '16px', textAlign: 'center', border: '2px solid #7fe5b3' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', marginBottom: '0.25rem' }}>
                          🔥 {habit.streak}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>
                          Racha Actual
                        </div>
                      </div>
                      <div style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #ffe8d4 0%, #ffd4b8 100%)', borderRadius: '16px', textAlign: 'center', border: '2px solid #ffd4b8' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d97706', marginBottom: '0.25rem' }}>
                          🏆 {habit.best_streak}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 700 }}>
                          Mejor Racha
                        </div>
                      </div>
                    </div>

                    {/* Complete Button */}
                    <button
                      onClick={() => handleComplete(habit.id)}
                      style={{ 
                        width: '100%',
                        padding: '1rem',
                        background: 'linear-gradient(135deg, #7fe5b3 0%, #b8f0d0 100%)',
                        color: 'white',
                        borderRadius: '20px',
                        border: '2px solid white',
                        boxShadow: '0 6px 0 rgba(127, 229, 179, 0.4)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 8px 0 rgba(127, 229, 179, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 6px 0 rgba(127, 229, 179, 0.4)';
                      }}
                    >
                      ✅ Completar Hoy ✨
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
