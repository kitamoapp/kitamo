
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

interface GoalContextType {
  emergencyFundGoal: number;
  setEmergencyFundGoal: (goal: number) => void;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'kitamo-goals';

export const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [emergencyFundGoal, setEmergencyFundGoalState] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (item) {
        const storedGoals = JSON.parse(item);
        if (storedGoals.emergencyFund) {
          setEmergencyFundGoalState(storedGoals.emergencyFund);
        }
      }
    } catch (error) {
      console.error('Error reading goals from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        const goals = { emergencyFund: emergencyFundGoal };
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(goals));
      } catch (error) {
        console.error('Error saving goals to localStorage', error);
      }
    }
  }, [emergencyFundGoal, isLoaded]);

  const setEmergencyFundGoal = useCallback((goal: number) => {
    setEmergencyFundGoalState(goal);
  }, []);

  return (
    <GoalContext.Provider value={{ emergencyFundGoal, setEmergencyFundGoal }}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};
