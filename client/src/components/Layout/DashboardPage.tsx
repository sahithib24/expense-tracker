import { useState, useEffect } from 'react';
import { Grid, Typography, Select, MenuItem, Box, Paper, Button } from '@mui/material';
import { CategoryPieChart } from '../Analytics/CategoryPieChart';
import { MonthlyBarChart } from '../Analytics/MonthlyBarChart';
import { ExpenseList } from '../Expense/ExpenseList';
import { ExpenseForm } from '../Expense/ExpenseForm';
import { DashboardCard } from '../Layout/DashboardCard';
import { Expense } from '../../services/api';
import { api } from '../../services/api';
import { subMonths } from 'date-fns';
import { PDFExportButton } from '../Export/PDFExport';

export const DashboardPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '12m'>('6m');
  const [editExpense, setEditExpense] = useState<Expense | null>(null);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    try {
      const expenseDate = new Date(expense.date);
      const cutoffDate = subMonths(new Date(), 
        timeRange === '1m' ? 1 : 
        timeRange === '3m' ? 3 : 
        timeRange === '6m' ? 6 : 12
      );
      return expenseDate >= cutoffDate;
    } catch (e) {
      console.warn('Invalid date format:', expense.date);
      return false;
    }
  });

  const handleEdit = (expense: Expense) => {
    setEditExpense(expense);
  };

  const handleDeleteSuccess = () => {
    fetchExpenses();
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div id="dashboard-export">
      <Box sx={{ p: 3 }}>
        {/* Expense Management Section (Top) */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="h5" gutterBottom>
              Expense Management
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <PDFExportButton 
                elementId="dashboard-export" 
                filename="expense-report.pdf" 
              />
              <Button 
                variant="contained" 
                onClick={fetchExpenses}
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <DashboardCard title={editExpense ? "Edit Expense" : "Add New Expense"}>
                <ExpenseForm 
                  expense={editExpense}
                  onAdd={fetchExpenses}
                  onUpdate={fetchExpenses}
                  onCancel={() => setEditExpense(null)}
                  isEditing={Boolean(editExpense)}
                />
              </DashboardCard>
            </Grid>
            <Grid item xs={12} md={8}>
              <DashboardCard title="Recent Expenses">
                <ExpenseList 
                  refreshTrigger={loading ? 1 : 0}
                  onEdit={handleEdit}
                  onDeleteSuccess={handleDeleteSuccess}
                />
              </DashboardCard>
            </Grid>
          </Grid>
        </Paper>

        {/* Analytics Section (Bottom) */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Expense Analytics
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '1m' | '3m' | '6m' | '12m')}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="1m">Last 1 Month</MenuItem>
              <MenuItem value="3m">Last 3 Months</MenuItem>
              <MenuItem value="6m">Last 6 Months</MenuItem>
              <MenuItem value="12m">Last 12 Months</MenuItem>
            </Select>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DashboardCard title="Spending by Category">
                <CategoryPieChart expenses={filteredExpenses} />
              </DashboardCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <DashboardCard title="Monthly Spending">
                <MonthlyBarChart expenses={filteredExpenses} />
              </DashboardCard>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </div>
  );
};