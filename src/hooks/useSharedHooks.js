import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { goalsApi, habitsApi } from '../services/api';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

export const useGoals = () => {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await goalsApi.getAll();
      dispatch({ type: 'UPDATE_GOALS', payload: response.data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData) => {
    setLoading(true);
    try {
      const response = await goalsApi.create(goalData);
      dispatch({ 
        type: 'UPDATE_GOALS', 
        payload: [...state.goals, response.data] 
      });
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGoalProgress = async (goalId, progress) => {
    try {
      const response = await goalsApi.updateProgress(goalId, progress);
      dispatch({
        type: 'UPDATE_GOALS',
        payload: state.goals.map(goal => 
          goal.id === goalId ? { ...goal, progress: response.data.progress } : goal
        )
      });
      // Update progress report
      dispatch({
        type: 'UPDATE_PROGRESS',
        payload: [...state.progressReports, response.data]
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals: state.goals,
    loading,
    error,
    fetchGoals,
    createGoal,
    updateGoalProgress
  };
};

export const useHabits = () => {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const response = await habitsApi.getAll();
      dispatch({ type: 'UPDATE_HABITS', payload: response.data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logHabitProgress = async (habitId, date) => {
    try {
      const response = await habitsApi.logProgress(habitId, date);
      dispatch({
        type: 'UPDATE_HABITS',
        payload: state.habits.map(habit =>
          habit.id === habitId ? { ...habit, streak: response.data.streak } : habit
        )
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return {
    habits: state.habits,
    loading,
    error,
    fetchHabits,
    logHabitProgress
  };
};

export const useProgress = () => {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateOverallProgress = useCallback(() => {
    const goalProgress = state.goals.reduce((acc, goal) => acc + goal.progress, 0) / state.goals.length;
    const habitProgress = state.habits.reduce((acc, habit) => acc + habit.completion_rate, 0) / state.habits.length;
    const activityProgress = state.activities.reduce((acc, activity) => acc + activity.progress, 0) / state.activities.length;

    return {
      overall: (goalProgress + habitProgress + activityProgress) / 3,
      goals: goalProgress,
      habits: habitProgress,
      activities: activityProgress
    };
  }, [state.goals, state.habits, state.activities]);

  const generateProgressReport = async () => {
    setLoading(true);
    try {
      const progress = calculateOverallProgress();
      // Save progress report
      const response = await api.post('/progress-reports/', progress);
      dispatch({
        type: 'UPDATE_PROGRESS',
        payload: [...state.progressReports, response.data]
      });
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    progress: calculateOverallProgress(),
    progressReports: state.progressReports,
    loading,
    error,
    generateProgressReport
  };
};

export const useConnections = () => {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const response = await api.get('/connections/');
      dispatch({ type: 'UPDATE_CONNECTIONS', payload: response.data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (userId) => {
    try {
      const response = await api.post('/connections/request/', { user_id: userId });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          type: 'connection_request_sent',
          message: `Connection request sent to ${response.data.user.name}`,
          timestamp: new Date()
        }
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const acceptConnectionRequest = async (requestId) => {
    try {
      const response = await api.put(`/connections/request/${requestId}/accept/`);
      dispatch({
        type: 'UPDATE_CONNECTIONS',
        payload: [...state.connections, response.data]
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return {
    connections: state.connections,
    loading,
    error,
    sendConnectionRequest,
    acceptConnectionRequest
  };
};

// Add more hooks for other features
export const useCoaching = () => {
  // Implementation for coaching features
};

export const useSurveys = () => {
  // Implementation for survey features
};

export const useWhiteboard = () => {
  // Implementation for whiteboard features
};

export const useMessaging = () => {
  // Implementation for messaging features
};

// Add more custom hooks as needed 