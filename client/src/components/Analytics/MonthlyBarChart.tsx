import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { format, subMonths } from 'date-fns';
import { Expense } from '../../services/api';
import { Box, Typography } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement);

interface Props {
  expenses: Expense[];
}

export const MonthlyBarChart = ({ expenses }: Props) => {
  console.log('Rendering Bar Chart with', expenses.length, 'expenses');

  const months = Array.from({ length: 6 }, (_, i) => 
    format(subMonths(new Date(), i), 'MMM yyyy')
  ).reverse();

  const monthlyTotals = months.map(month => {
    try {
      const [monthStr, yearStr] = month.split(' ');
      return expenses
        .filter(e => {
          const eDate = new Date(e.date);
          return (
            eDate.getFullYear() === parseInt(yearStr) && 
            format(eDate, 'MMM') === monthStr
          );
        })
        .reduce((sum, e) => sum + e.amount, 0);
    } catch (e) {
      console.error('Date processing error:', e);
      return 0;
    }
  });

  if (monthlyTotals.every(total => total === 0)) {
    return <Typography>No data for selected period</Typography>;
  }

  const data = {
    labels: months,
    datasets: [{
      label: 'Monthly Spending',
      data: monthlyTotals,
      backgroundColor: '#36A2EB',
    }]
  };

  return (
    <Box sx={{ height: '400px' }}>
      <Bar 
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false
        }}
      />
    </Box>
  );
};