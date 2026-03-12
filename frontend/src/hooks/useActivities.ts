import { useState, useEffect, useCallback } from 'react';

interface Activity {
  id: number;
  name: string;
  category: string;
  color: string;
  created_at: string;
}

interface UseActivitiesReturn {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  addActivity: (activity: { name: string; category?: string; color?: string }) => Promise<void>;
  deleteActivity: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useActivities = (): UseActivitiesReturn => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/activities');
      if (!response.ok) throw new Error('Failed to fetch activities');
      const data = await response.json();
      setActivities(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const addActivity = async (activityData: { name: string; category?: string; color?: string }) => {
    try {
      const response = await fetch('http://localhost:8000/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData),
      });
      if (!response.ok) throw new Error('Failed to add activity');
      await fetchActivities();
    } catch (err) {
      throw err;
    }
  };

  const deleteActivity = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/activities/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete activity');
      await fetchActivities();
    } catch (err) {
      throw err;
    }
  };

  return {
    activities,
    loading,
    error,
    addActivity,
    deleteActivity,
    refresh: fetchActivities,
  };
};
