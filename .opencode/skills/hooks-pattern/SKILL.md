---
name: hooks-pattern
description: Crea custom hooks reutilizables para React
license: MIT
compatibility: opencode
metadata:
  audience: frontend-developers
  category: implementation
---

# Skill: Hooks Pattern

## Propósito

Crear custom hooks reutilizables para lógica de estado y efectos.

## Cuándo Usar

- Lógica compartida entre componentes
- Manejo de estado complejo
- Integración con APIs

## Hook: useTimer

```tsx
// src/hooks/useTimer.ts
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  autoStart?: boolean;
  onTick?: (elapsedTime: number) => void;
  onComplete?: (elapsedTime: number) => void;
  targetDuration?: number; // en segundos
}

interface UseTimerReturn {
  elapsedTime: number;
  isRunning: boolean;
  isCompleted: boolean;
  startTime: Date | null;
  formattedTime: string;
  start: () => void;
  pause: () => void;
  reset: () => void;
  stop: () => void;
}

export const useTimer = (options: UseTimerOptions = {}): UseTimerReturn => {
  const {
    autoStart = false,
    onTick,
    onComplete,
    targetDuration
  } = options;

  const [isRunning, setIsRunning] = useState(autoStart);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(autoStart ? new Date() : null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTickRef = useRef(onTick);
  const onCompleteRef = useRef(onComplete);

  // Actualizar refs cuando cambian los callbacks
  useEffect(() => {
    onTickRef.current = onTick;
    onCompleteRef.current = onComplete;
  }, [onTick, onComplete]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          onTickRef.current?.(newTime);
          
          // Check if target duration reached
          if (targetDuration && newTime >= targetDuration) {
            setIsRunning(false);
            setIsCompleted(true);
            onCompleteRef.current?.(newTime);
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, targetDuration]);

  // Handlers
  const start = useCallback(() => {
    setIsRunning(true);
    setStartTime(new Date());
    setIsCompleted(false);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);
    setStartTime(null);
    setIsCompleted(false);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    // El tiempo se mantiene para poder guardarlo
  }, []);

  // Formatted time
  const formattedTime = `${String(Math.floor(elapsedTime / 3600)).padStart(2, '0')}:${String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, '0')}:${String(elapsedTime % 60).padStart(2, '0')}`;

  return {
    elapsedTime,
    isRunning,
    isCompleted,
    startTime,
    formattedTime,
    start,
    pause,
    reset,
    stop
  };
};
```

## Hook: useHabits

```tsx
// src/hooks/useHabits.ts
import { useState, useEffect, useCallback } from 'react';

interface Habit {
  id: number;
  name: string;
  streak: number;
  target_days: string;
  completions: HabitCompletion[];
}

interface HabitCompletion {
  id: number;
  date: string;
  completed: boolean;
}

interface UseHabitsReturn {
  habits: Habit[];
  loading: boolean;
  error: string | null;
  addHabit: (habit: { name: string; target_days: string }) => Promise<void>;
  completeHabit: (habitId: number, date: Date) => Promise<void>;
  deleteHabit: (habitId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useHabits = (): UseHabitsReturn => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/habits');
      if (!response.ok) throw new Error('Failed to fetch habits');
      const data = await response.json();
      setHabits(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const addHabit = useCallback(async (habitData: { name: string; target_days: string }) => {
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitData)
      });
      if (!response.ok) throw new Error('Failed to add habit');
      await fetchHabits();
    } catch (err) {
      throw err;
    }
  }, [fetchHabits]);

  const completeHabit = useCallback(async (habitId: number, date: Date) => {
    try {
      const response = await fetch('/api/habit-completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habit_id: habitId,
          date: date.toISOString()
        })
      });
      if (!response.ok) throw new Error('Failed to complete habit');
      await fetchHabits();
    } catch (err) {
      throw err;
    }
  }, [fetchHabits]);

  const deleteHabit = useCallback(async (habitId: number) => {
    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete habit');
      await fetchHabits();
    } catch (err) {
      throw err;
    }
  }, [fetchHabits]);

  return {
    habits,
    loading,
    error,
    addHabit,
    completeHabit,
    deleteHabit,
    refresh: fetchHabits
  };
};
```

## Hook: useActivityStats

```tsx
// src/hooks/useActivityStats.ts
import { useState, useEffect, useMemo } from 'react';

interface ActivityStats {
  category: string;
  total_duration: number;
  total_sessions: number;
  average_duration: number;
}

interface UseActivityStatsOptions {
  days?: number;
  category?: string;
}

export const useActivityStats = (options: UseActivityStatsOptions = {}) => {
  const { days = 7, category } = useMemo(() => options, [options]);
  
  const [stats, setStats] = useState<ActivityStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          days: days.toString(),
          ...(category && { category })
        });
        
        const response = await fetch(`/api/stats/activities?${params}`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [days, category]);

  return { stats, loading };
};
```
