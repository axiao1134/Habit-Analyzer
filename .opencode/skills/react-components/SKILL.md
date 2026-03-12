---
name: react-components
description: Crea componentes React funcionales y reutilizables
license: MIT
compatibility: opencode
metadata:
  audience: frontend-developers
  category: implementation
---

# Skill: React Components

## Propósito

Crear componentes React funcionales, tipados y reutilizables.

## Cuándo Usar

- Nuevas UI components
- Refactorización de componentes
- Sistema de diseño

## Estructura de Componente

```tsx
// src/components/Timer/Timer.tsx
import React, { useState, useEffect, useCallback } from 'react';
import styles from './Timer.module.css';

interface TimerProps {
  activityId?: number;
  activityName?: string;
  onTimerComplete?: (duration: number) => void;
  className?: string;
}

interface TimeState {
  hours: number;
  minutes: number;
  seconds: number;
}

export const Timer: React.FC<TimerProps> = ({
  activityId,
  activityName = 'Actividad',
  onTimerComplete,
  className = ''
}) => {
  // State
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Derived state
  const time: TimeState = {
    hours: Math.floor(elapsedTime / 3600),
    minutes: Math.floor((elapsedTime % 3600) / 60),
    seconds: elapsedTime % 60
  };

  // Effects
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  // Handlers
  const handleStart = useCallback(() => {
    setIsRunning(true);
    setStartTime(new Date());
  }, []);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);
    setStartTime(null);
  }, []);

  const handleStop = useCallback(async () => {
    setIsRunning(false);
    
    // Save to backend
    if (activityId && startTime) {
      try {
        const response = await fetch('/api/activity-records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activity_id: activityId,
            start_time: startTime.toISOString(),
            end_time: new Date().toISOString(),
            duration_seconds: elapsedTime
          })
        });
        
        if (response.ok) {
          onTimerComplete?.(elapsedTime);
        }
      } catch (error) {
        console.error('Error saving timer:', error);
      }
    }
  }, [activityId, startTime, elapsedTime, onTimerComplete]);

  // Format time display
  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  return (
    <div className={`${styles.container} ${className}`} role="timer" aria-label="Timer">
      <h2 className={styles.title}>{activityName}</h2>
      
      <div className={styles.display}>
        <span className={styles.time}>{formatTime(time.hours)}</span>
        <span className={styles.separator}>:</span>
        <span className={styles.time}>{formatTime(time.minutes)}</span>
        <span className={styles.separator}>:</span>
        <span className={styles.time}>{formatTime(time.seconds)}</span>
      </div>

      <div className={styles.controls}>
        {!isRunning ? (
          <button 
            onClick={handleStart}
            className={styles.startButton}
            aria-label="Start timer"
          >
            ▶ Start
          </button>
        ) : (
          <button 
            onClick={handlePause}
            className={styles.pauseButton}
            aria-label="Pause timer"
          >
            ⏸ Pause
          </button>
        )}
        
        <button 
          onClick={handleStop}
          className={styles.stopButton}
          disabled={elapsedTime === 0}
          aria-label="Stop and save timer"
        >
          ⏹ Stop
        </button>
        
        <button 
          onClick={handleReset}
          className={styles.resetButton}
          disabled={elapsedTime === 0}
          aria-label="Reset timer"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
```

## Estilos (CSS Modules)

```css
/* src/components/Timer/Timer.module.css */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
}

.display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.time {
  font-size: 4rem;
  font-weight: 700;
  color: white;
  font-family: 'Courier New', monospace;
}

.separator {
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.8);
}

.controls {
  display: flex;
  gap: 1rem;
}

.startButton,
.pauseButton,
.stopButton,
.resetButton {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.startButton {
  background-color: #10B981;
  color: white;
}

.startButton:hover {
  background-color: #059669;
}

.pauseButton {
  background-color: #F59E0B;
  color: white;
}

.pauseButton:hover {
  background-color: #D97706;
}

.stopButton {
  background-color: #EF4444;
  color: white;
}

.stopButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.resetButton {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.resetButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .time {
    font-size: 2.5rem;
  }
  
  .controls {
    flex-wrap: wrap;
    justify-content: center;
  }
}
```

## Export Pattern

```tsx
// src/components/Timer/index.ts
export { Timer } from './Timer';
export type { TimerProps } from './Timer';
```
