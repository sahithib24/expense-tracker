// src/components/Analytics/BudgetAlerts.tsx
import { Alert, AlertTitle, Box } from '@mui/material';
import { useBudget } from '../../context/BudgetContext';
import {Expense} from "../../services/api"

interface BudgetAlertsProps {
  expenses: Expense[];
}

export const BudgetAlerts = ({ expenses }: BudgetAlertsProps) => {
  const { budgets } = useBudget();
  
  const categoryTotals = Object.keys(budgets).map(category => ({
    category,
    total: expenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0)
  }));

  const exceededBudgets = categoryTotals.filter(
    ({ category, total }) => total > budgets[category]
  );

  if (exceededBudgets.length === 0) return null;

  return (
    <Box sx={{ mb: 3 }}>
      {exceededBudgets.map(({ category, total }) => (
        <Alert severity="warning" key={category} sx={{ mb: 1 }}>
          <AlertTitle>Budget Exceeded</AlertTitle>
          {category}: Spent ${total.toFixed(2)} (Budget: ${budgets[category].toFixed(2)})
        </Alert>
      ))}
    </Box>
  );
};