import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  goals: [],
  habits: [],
  activities: [],
  connections: [],
  notifications: [],
  selectedCoach: null,
  currentCourse: null,
  progressReports: [],
  surveys: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_GOALS':
      return { ...state, goals: action.payload };
    case 'UPDATE_HABITS':
      return { ...state, habits: action.payload };
    case 'UPDATE_ACTIVITIES':
      return { ...state, activities: action.payload };
    case 'UPDATE_CONNECTIONS':
      return { ...state, connections: action.payload };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications] 
      };
    case 'SET_COACH':
      return { ...state, selectedCoach: action.payload };
    case 'SET_COURSE':
      return { ...state, currentCourse: action.payload };
    case 'UPDATE_PROGRESS':
      return { ...state, progressReports: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext); 