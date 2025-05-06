import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TextField, Button, MenuItem, Box, CircularProgress } from '@mui/material';
import { api } from '../../services/api';

const categories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

interface ExpenseFormProps {
  onAdd?: () => void;
  onUpdate?: () => void;
  expense?: {
    id: string;
    title: string;
    amount: number;
    category: string;
  };
  onCancel?: () => void;
  isEditing?: boolean;
}

export const ExpenseForm = ({ 
  onAdd, 
  onUpdate, 
  expense, 
  onCancel, 
  isEditing = false 
}: ExpenseFormProps) => {
  const { userId } = useAuth();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with expense data if editing
  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(expense.amount.toString());
      setCategory(expense.category);
    } else {
      resetForm();
    }
  }, [expense]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory(categories[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const expenseData = {
        title,
        amount: parseFloat(amount),
        category,
        userId,
      };

      if (isEditing && expense) {
        await api.put(`/expenses/${expense.id}`, expenseData);
        onUpdate?.();
      } else {
        await api.post('/expenses', expenseData);
        onAdd?.();
        resetForm();
      }
    } catch (err) {
      console.error('Failed to save expense:', err);
      alert('Failed to save expense!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ 
        mb: 4,
        p: 3,
        border: '1px solid #eee',
        borderRadius: 1,
        backgroundColor: 'background.paper'
      }}
    >
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        margin="normal"
        required
        inputProps={{ step: "0.01" }}
      />
      <TextField
        select
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        fullWidth
        margin="normal"
        required
      >
        {categories.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        {isEditing && (
          <Button 
            variant="outlined" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          variant="contained" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress size={24} />
          ) : isEditing ? (
            'Update Expense'
          ) : (
            'Add Expense'
          )}
        </Button>
      </Box>
    </Box>
  );
};