import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Expense } from '../../services/api';
import { Box, Typography } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  expenses: Expense[];
}

export const CategoryPieChart = ({ expenses }: Props) => {
  // Debug output
  console.log('Rendering Pie Chart with', expenses.length, 'expenses');

  const categories = [...new Set(expenses.map(e => e.category))];
  const categoryTotals = categories.map(cat => 
    expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0)
  );

  // Validation
  if (categories.length === 0) {
    return <Typography>No category data available</Typography>;
  }

  const data = {
    labels: categories,
    datasets: [{
      data: categoryTotals,
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
      ],
    }]
  };

  return (
    <Box sx={{ height: '400px' }}>
      <Pie 
        data={data} 
        options={{
          responsive: true,
          maintainAspectRatio: false
        }} 
      />
    </Box>
  );
};