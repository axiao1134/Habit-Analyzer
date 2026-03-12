import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Timer } from './pages/Timer';
import { Activities } from './pages/Activities';
import { Habits } from './pages/Habits';
import { ChatPage } from './pages/ChatPage';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/timer', label: 'Timer', icon: '⏰' },
  { path: '/activities', label: 'Actividades', icon: '📝' },
  { path: '/habits', label: 'Hábitos', icon: '🎯' },
  { path: '/chat', label: 'Chat IA', icon: '🤖' },
];

function App() {
  return (
    <BrowserRouter>
      <div className="app" style={{ minHeight: '100vh' }}>
        <Nav />
        <main className="container animate-fadeIn">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

const Nav: React.FC = () => {
  const location = useLocation();

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '3px solid #ffb7c5',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 12px rgba(255, 183, 197, 0.3)'
    }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        <div className="flex items-center justify-between">
          <Link to="/" style={{ 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #ffb7c5 0%, #d4a5ff 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: '0 6px 0 rgba(255, 183, 197, 0.4), 0 12px 24px rgba(255, 183, 197, 0.3)',
              animation: 'float 3s ease-in-out infinite'
            }}>
              🎀
            </div>
            <div>
              <div style={{ 
                fontWeight: 800, 
                fontSize: '1.5rem', 
                background: 'linear-gradient(135deg, #ff8fa3 0%, #d4a5ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Habit Analyzer ✨
              </div>
              <div style={{ fontSize: '0.875rem', color: '#8b8294', fontWeight: 500 }}>
                ¡Trackea tus hábitos! 💖
              </div>
            </div>
          </Link>

          <div className="flex gap-2" style={{ display: 'flex', gap: '0.5rem' }}>
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                    background: isActive ? 'linear-gradient(135deg, #ffb7c5 0%, #ffd6e0 100%)' : 'transparent',
                    color: isActive ? '#ffffff' : '#5a4a5f',
                    boxShadow: isActive ? '0 4px 0 rgba(255, 183, 197, 0.4)' : 'none',
                    border: isActive ? '2px solid #ff8fa3' : '2px solid transparent',
                    transform: isActive ? 'translateY(-4px)' : 'translateY(0)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#fff0f5';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = '#ffb7c5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  {item.icon} {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer style={{
    background: 'linear-gradient(135deg, #fff9f3 0%, #fef6fb 100%)',
    borderTop: '3px solid #ffb7c5',
    padding: '2rem',
    textAlign: 'center',
    marginTop: '4rem'
  }}>
    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
      💖 🌸 ✨ 🎀 💫
    </div>
    <p style={{ color: '#8b8294', fontSize: '0.875rem' }}>
      Hecho con 💖 y mucho ✨ para trackear tus hábitos
    </p>
  </footer>
);

export default App;
