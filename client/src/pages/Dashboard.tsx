import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ExpenseForm } from '../components/Expense/ExpenseForm';
import { ExpenseList } from '../components/Expense/ExpenseList';
import { Box, Container, Typography } from '@mui/material';

export const Dashboard = () => {
  const { userId } = useAuth(); // Removed logout (now in Navbar)
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Container maxWidth="md">
      {/* Header Section (simplified) */}
      <Box sx={{ mb: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Your Expense Tracker!
        </Typography>
        <Typography variant="body1" paragraph>
          User ID: {userId}
        </Typography>
      </Box>

      {/* Expense Management Section */}
      <Box sx={{ 
        p: 3, 
        border: '1px solid #eee', 
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: 'background.paper'
      }}>
        <ExpenseForm onAdd={() => setRefreshKey((prev) => prev + 1)} />
        <ExpenseList key={refreshKey} />
      </Box>
    </Container>
  );
};