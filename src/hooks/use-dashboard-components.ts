'use client';

import { useState, useEffect, useCallback } from 'react';

export type DashboardComponent = 
  | 'summaryCards'
  | 'financialSummary'
  | 'expenseBreakdown'
  | 'transactionHistory'
  | 'budgetSummary'
  | 'upcomingBills'
  | 'financialInsights'
  | 'emergencyFund';

type ComponentVisibility = Record<DashboardComponent, boolean>;

const LOCAL_STORAGE_KEY = 'dashboard-component-visibility';

const defaultVisibility: ComponentVisibility = {
  summaryCards: true,
  financialSummary: true,
  expenseBreakdown: true,
  transactionHistory: true,
  budgetSummary: true,
  upcomingBills: true,
  financialInsights: true,
  emergencyFund: true,
};

export function useDashboardComponents() {
  const [visibleComponents, setVisibleComponents] = useState<ComponentVisibility>(defaultVisibility);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (item) {
        // Ensure that new components from updates are added to the user's settings
        const storedVisibility = JSON.parse(item);
        const mergedVisibility = { ...defaultVisibility, ...storedVisibility };
        setVisibleComponents(mergedVisibility);
      } else {
        setVisibleComponents(defaultVisibility);
      }
    } catch (error) {
      console.error('Error reading from localStorage', error);
      setVisibleComponents(defaultVisibility);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(visibleComponents));
      } catch (error) {
        console.error('Error saving to localStorage', error);
      }
    }
  }, [visibleComponents, isLoaded]);

  const handleVisibilityChange = useCallback((component: DashboardComponent, checked: boolean) => {
    setVisibleComponents(prev => ({ ...prev, [component]: checked }));
  }, []);

  return { visibleComponents, handleVisibilityChange };
}