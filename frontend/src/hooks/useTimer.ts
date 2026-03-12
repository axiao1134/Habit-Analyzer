import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  autoStart?: boolean;
  onTick?: (elapsedTime: number) => void;
  onComplete?: (elapsedTime: number) => void;
  targetDuration?: number;
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

  // Update refs when callbacks change
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
  }, []);

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
