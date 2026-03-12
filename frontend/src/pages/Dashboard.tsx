import React, { useState, useEffect } from 'react';
import { activitiesAPI, activityRecordsAPI } from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface Activity {
  id: number;
  name: string;
  category: string;
  color: string;
  created_at: string;
}

interface ActivityRecord {
  id: number;
  activity_id: number;
  duration_seconds: number;
  start_time: string;
}

export const Dashboard: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [records, setRecords] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHours: 0,
    totalSessions: 0,
    todayHours: 0,
    consistency: 0,
    bestStreak: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [activitiesRes, recordsRes] = await Promise.all([
        activitiesAPI.getAll(),
        activityRecordsAPI.getAll()
      ]);
      setActivities(activitiesRes.data);
      setRecords(recordsRes.data);
      calculateStats(recordsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (records: ActivityRecord[]) => {
    const totalSeconds = records.reduce((sum, r) => sum + (r.duration_seconds || 0), 0);
    const totalHours = (totalSeconds / 3600).toFixed(1);
    
    const today = new Date().toDateString();
    const todaySeconds = records
      .filter(r => new Date(r.start_time).toDateString() === today)
      .reduce((sum, r) => sum + (r.duration_seconds || 0), 0);
    const todayHours = (todaySeconds / 3600).toFixed(1);
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    });
    
    const activeDays = new Set(
      records
        .filter(r => last7Days.includes(new Date(r.start_time).toDateString()))
        .map(r => new Date(r.start_time).toDateString())
    ).size;
    
    const consistency = Math.round((activeDays / 7) * 100);

    setStats({
      totalHours: Number(totalHours),
      totalSessions: records.length,
      todayHours: Number(todayHours),
      consistency,
      bestStreak: activeDays
    });
  };

  const categoryData = React.useMemo(() => {
    const categoryMap = new Map<string, { duration: number; count: number; color: string }>();
    
    records.forEach(record => {
      const activity = activities.find(a => a.id === record.activity_id);
      if (activity) {
        const current = categoryMap.get(activity.category) || { duration: 0, count: 0, color: activity.color };
        current.duration += record.duration_seconds || 0;
        current.count += 1;
        categoryMap.set(activity.category, current);
      }
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      hours: (data.duration / 3600).toFixed(1),
      sessions: data.count,
      color: data.color
    }));
  }, [records, activities]);

  const pieChartData = {
    labels: categoryData.map(d => d.category.charAt(0).toUpperCase() + d.category.slice(1)),
    datasets: [{
      data: categoryData.map(d => Number(d.hours)),
      backgroundColor: ['#ffb7c5', '#d4a5ff', '#9bcaff', '#b8f0d0', '#ffd4b8', '#ffd6e0'],
      borderColor: '#ffffff',
      borderWidth: 4,
      borderRadius: 8
    }]
  };

  const barChartData = {
    labels: categoryData.map(d => d.category.charAt(0).toUpperCase() + d.category.slice(1)),
    datasets: [{
      label: 'Horas',
      data: categoryData.map(d => Number(d.hours)),
      backgroundColor: ['#ffb7c5', '#d4a5ff', '#9bcaff', '#b8f0d0', '#ffd4b8'],
      borderRadius: 12,
      borderSkipped: false,
    }]
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="loading-spinner"></div>
        <span style={{ marginLeft: '1rem', fontSize: '1.5rem' }}>Cargando... ✨</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header Kawaii */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'bounce 2s infinite' }}>🌸</div>
        <h1>
          <span style={{ display: 'inline-block', animation: 'wiggle 2s infinite' }}>📊</span> Dashboard Kawaii
        </h1>
        <p style={{ color: '#8b8294', fontSize: '1.1rem' }}>
          ¡Tu progreso está súper lindo! 💖✨
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          icon="⏰"
          label="Horas Totales"
          value={`${stats.totalHours}h`}
          description={`${stats.totalHours} horas registradas`}
          color="#ffb7c5"
          bg="#fff0f5"
        />
        <StatCard
          icon="📝"
          label="Hoy"
          value={`${stats.todayHours}h`}
          description="Tiempo acumulado hoy"
          color="#7fe5b3"
          bg="#d4f8e4"
        />
        <StatCard
          icon="✅"
          label="Sesiones"
          value={stats.totalSessions.toString()}
          description="Actividades completadas"
          color="#ffd4b8"
          bg="#fff9d4"
        />
        <StatCard
          icon="🎯"
          label="Consistencia"
          value={`${stats.consistency}%`}
          description="Días activos (7 días)"
          color="#d4a5ff"
          bg="#e9d5ff"
        />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Pie Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🥧</span> Distribución por Categoría
          </h3>
          {categoryData.length > 0 ? (
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
              <Pie 
                data={pieChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { 
                      position: 'bottom',
                      labels: {
                        color: '#5a4a5f',
                        font: { size: 13, weight: '600' },
                        padding: 15
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      titleColor: '#5a4a5f',
                      bodyColor: '#8b8294',
                      borderColor: '#ffb7c5',
                      borderWidth: 2,
                      padding: 12,
                      titleFont: { size: 14, weight: '700' },
                      bodyFont: { size: 13 },
                      cornerRadius: 12,
                      displayColors: true,
                      callbacks: {
                        label: (context) => {
                          const value = context.parsed;
                          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${value}h (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#8b8294', padding: '3rem', background: '#fff9f3', borderRadius: '24px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Sin datos suficientes</p>
              <p style={{ fontSize: '0.875rem' }}>¡Comienza a registrar actividades! ✨</p>
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📈</span> Horas por Categoría
          </h3>
          {categoryData.length > 0 ? (
            <div style={{ height: '300px' }}>
              <Bar 
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      titleColor: '#5a4a5f',
                      bodyColor: '#8b8294',
                      borderColor: '#d4a5ff',
                      borderWidth: 2,
                      padding: 12,
                      titleFont: { size: 14, weight: '700' },
                      bodyFont: { size: 13 },
                      cornerRadius: 12,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { 
                        display: true, 
                        text: 'Horas',
                        color: '#8b8294',
                        font: { weight: '700', size: 14 }
                      },
                      ticks: {
                        color: '#8b8294',
                        font: { weight: '600' }
                      },
                      grid: {
                        color: '#f5f3f8',
                        lineWidth: 2
                      }
                    },
                    x: {
                      grid: { display: false },
                      ticks: {
                        color: '#5a4a5f',
                        font: { weight: '700', size: 12 }
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#8b8294', padding: '3rem', background: '#fff9f3', borderRadius: '24px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Sin datos suficientes</p>
              <p style={{ fontSize: '0.875rem' }}>¡Comienza a registrar actividades! ✨</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🕐</span> Actividades Recientes
        </h3>
        {records.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#8b8294', padding: '3rem', background: '#fff9f3', borderRadius: '24px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No hay actividades registradas aún</p>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              ¡Comienza a trackear tus hábitos con el timer! 🎀
            </p>
            <a href="/timer" className="btn-primary" style={{ display: 'inline-flex' }}>
              ⏰ Iniciar Timer
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
            {records.slice(-10).reverse().map(record => {
              const activity = activities.find(a => a.id === record.activity_id);
              if (!activity) return null;
              
              const duration = record.duration_seconds || 0;
              const hours = Math.floor(duration / 3600);
              const minutes = Math.floor((duration % 3600) / 60);
              
              return (
                <div
                  key={record.id}
                  style={{
                    padding: '1rem',
                    border: '2px solid #ffb7c5',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                    background: '#ffffff'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(8px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(255, 183, 197, 0.3)';
                    e.currentTarget.style.borderColor = '#ff8fa3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#ffb7c5';
                  }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: activity.color,
                    flexShrink: 0,
                    boxShadow: `0 0 0 4px ${activity.color}30`,
                    border: '3px solid white'
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#5a4a5f' }}>{activity.name}</div>
                    <div style={{ fontSize: '0.875rem', color: '#8b8294' }}>
                      {activity.category} • {new Date(record.start_time).toLocaleString('es-ES', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: 800, 
                    color: activity.color,
                    fontSize: '1.1rem',
                    backgroundColor: `${activity.color}30`,
                    padding: '0.5rem 1rem',
                    borderRadius: '16px',
                    border: '2px solid white'
                  }}>
                    {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        <QuickActionCard
          icon="⏰"
          title="Iniciar Timer"
          description="Comienza a trackear tiempo"
          href="/timer"
          color="#ffb7c5"
          bg="#fff0f5"
        />
        <QuickActionCard
          icon="➕"
          title="Nueva Actividad"
          description="Crea una actividad"
          href="/activities"
          color="#7fe5b3"
          bg="#d4f8e4"
        />
        <QuickActionCard
          icon="🎯"
          title="Crear Hábito"
          description="Establece un hábito"
          href="/habits"
          color="#ffd4b8"
          bg="#ffe8d4"
        />
        <QuickActionCard
          icon="🤖"
          title="Chat IA"
          description="Pregunta sobre tus datos"
          href="/chat"
          color="#d4a5ff"
          bg="#e9d5ff"
        />
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  description: string;
  color: string;
  bg: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, description, color, bg }) => (
  <div className="card" style={{
    background: bg,
    padding: '1.5rem',
    borderRadius: '24px',
    border: `3px solid ${color}`,
    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    position: 'relative',
    overflow: 'hidden'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
    e.currentTarget.style.boxShadow = '0 16px 32px rgba(255, 183, 197, 0.4)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0) scale(1)';
    e.currentTarget.style.boxShadow = '0 8px 16px rgba(255, 183, 197, 0.2)';
  }}
  >
    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', animation: 'float 3s infinite' }}>{icon}</div>
    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: color, marginBottom: '0.25rem', lineHeight: 1 }}>
      {value}
    </div>
    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#5a4a5f', marginBottom: '0.25rem' }}>
      {label}
    </div>
    <div style={{ fontSize: '0.75rem', color: '#8b8294' }}>
      {description}
    </div>
  </div>
);

interface QuickActionCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  color: string;
  bg: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon, title, description, href, color, bg }) => (
  <a
    href={href}
    style={{
      textDecoration: 'none',
      color: 'inherit',
      padding: '1.5rem',
      background: bg,
      borderRadius: '24px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      border: `3px solid ${color}`,
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.borderColor = color;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.05)';
      e.currentTarget.style.borderColor = color;
    }}
  >
    <div style={{ fontSize: '3rem', marginBottom: '0.75rem', animation: 'float 3s infinite' }}>{icon}</div>
    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#5a4a5f', marginBottom: '0.25rem' }}>
      {title}
    </div>
    <div style={{ fontSize: '0.875rem', color: '#8b8294' }}>
      {description}
    </div>
  </a>
);
