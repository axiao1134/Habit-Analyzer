import React, { useState, useEffect } from 'react';
import { activitiesAPI } from '../services/api';

interface Activity {
  id: number;
  name: string;
  category: string;
  color: string;
  description?: string;
  created_at: string;
}

const predefinedActivities = [
  { name: 'Dormir', emoji: '😴', category: 'health', color: '#8b5cf6', description: 'Registro de horas de sueño' },
  { name: 'Ejercicio', emoji: '💪', category: 'health', color: '#10b981', description: 'Entrenamientos y deporte' },
  { name: 'Estudiar', emoji: '📖', category: 'learning', color: '#3b82f6', description: 'Tiempo de estudio' },
  { name: 'Programar', emoji: '💻', category: 'work', color: '#f59e0b', description: 'Desarrollo de software' },
  { name: 'Leer', emoji: '📚', category: 'learning', color: '#ec4899', description: 'Lectura de libros' },
  { name: 'Meditar', emoji: '🧘', category: 'health', color: '#14b8a6', description: 'Meditación y mindfulness' },
];

export const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [newActivity, setNewActivity] = useState({
    name: '',
    category: 'general',
    color: '#3B82F6'
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
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await activitiesAPI.create(newActivity);
      setNewActivity({ name: '', category: 'general', color: '#3B82F6' });
      loadActivities();
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta actividad?')) {
      try {
        await activitiesAPI.delete(id);
        loadActivities();
      } catch (error) {
        console.error('Error deleting activity:', error);
      }
    }
  };

  const handleAddPredefined = async (activity: typeof predefinedActivities[0]) => {
    const exists = activities.find(a => a.name === activity.name);
    if (exists) {
      alert('Esta actividad ya existe');
      return;
    }
    try {
      await activitiesAPI.create({
        name: activity.name,
        category: activity.category,
        color: activity.color
      });
      loadActivities();
    } catch (error) {
      console.error('Error adding predefined activity:', error);
    }
  };

  const categories = [
    { value: 'general', label: 'General', color: '#6b7280' },
    { value: 'health', label: 'Salud', color: '#10b981' },
    { value: 'work', label: 'Trabajo', color: '#f59e0b' },
    { value: 'learning', label: 'Aprendizaje', color: '#3b82f6' },
    { value: 'leisure', label: 'Ocio', color: '#8b5cf6' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="loading-spinner" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 800, 
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          📋 Actividades
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          Gestiona tus actividades para trackear mejor tu tiempo
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Predefined Activities */}
        <div>
          <div className="card animate-scaleIn">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🎯 Actividades Predefinidas
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
              Agrega rápidamente actividades comunes para comenzar a trackear
            </p>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {predefinedActivities.map(activity => {
                const exists = activities.find(a => a.name === activity.name);
                return (
                  <button
                    key={activity.name}
                    onClick={() => handleAddPredefined(activity)}
                    disabled={exists}
                    style={{
                      padding: '1rem',
                      border: `2px solid ${exists ? '#e5e7eb' : activity.color}`,
                      borderRadius: '0.75rem',
                      background: exists ? '#f9fafb' : 'white',
                      cursor: exists ? 'not-allowed' : 'pointer',
                      opacity: exists ? 0.6 : 1,
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      if (!exists) {
                        e.currentTarget.style.transform = 'translateX(4px)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!exists) {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>{activity.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{activity.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{activity.description}</div>
                    </div>
                    {exists ? (
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        background: '#10b981', 
                        color: 'white', 
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        ✓ Agregada
                      </span>
                    ) : (
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        background: activity.color, 
                        color: 'white', 
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        + Agregar
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Create & List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Create Form */}
          <div className="card animate-scaleIn">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ➕ Crear Actividad Personalizada
            </h3>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600,
                  color: '#374151'
                }}>
                  Nombre
                </label>
                <input
                  type="text"
                  value={newActivity.name}
                  onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                  placeholder="Ej: Tocar guitarra"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600,
                  color: '#374151'
                }}>
                  Categoría
                </label>
                <select
                  value={newActivity.category}
                  onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
                  style={{ width: '100%' }}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600,
                  color: '#374151'
                }}>
                  Color
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={newActivity.color}
                    onChange={(e) => setNewActivity({ ...newActivity, color: e.target.value })}
                    style={{ 
                      width: '60px', 
                      height: '44px', 
                      padding: '0.25rem',
                      cursor: 'pointer',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280',
                    background: '#f9fafb',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem'
                  }}>
                    {newActivity.color.toUpperCase()}
                  </span>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                ✨ Crear Actividad
              </button>
            </form>
          </div>

          {/* Activities List */}
          <div className="card animate-scaleIn">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📝 Mis Actividades ({activities.length})
            </h3>
            {activities.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <p>No hay actividades registradas</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Agrega una actividad predefinida o crea una personalizada
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                {activities.map(activity => (
                  <div
                    key={activity.id}
                    style={{
                      padding: '1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: 'white',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: activity.color,
                      flexShrink: 0,
                      boxShadow: `0 0 0 3px ${activity.color}20`
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{activity.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {activity.category}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(activity.id)}
                      style={{
                        background: '#fee2e2',
                        color: '#ef4444',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#ef4444';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fee2e2';
                        e.currentTarget.style.color = '#ef4444';
                      }}
                    >
                      🗑️ Eliminar
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
