// src/context/BudgetContext.tsx
import { createContext, useContext, useState } from 'react';

interface BudgetContextType {
  budgets: Record<string, number>;
  setBudget: (category: string, amount: number) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
  const [budgets, setBudgets] = useState<Record<string, number>>({
    Food: 500,
    Transport: 300,
    Entertainment: 200,
  });

  const setBudget = (category: string, amount: number) => {
    setBudgets(prev => ({ ...prev, [category]: amount }));
  };

  return (
    <BudgetContext.Provider value={{ budgets, setBudget }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) throw new Error('useBudget must be used within BudgetProvider');
  return context;
};