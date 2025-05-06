import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { api } from '../../services/api';
import { Delete, Edit } from '@mui/icons-material';
import { format } from 'date-fns';
import { Button } from '@mui/material';

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  userId: string;
}

export const ExpenseList = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState<string | null>(null);

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

  const deleteExpense = async (id: string) => {
    setDeleteLoading(id);
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(prev => prev.filter(expense => expense._id !== id));
    } catch (err) {
      console.error('Failed to delete expense:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEditClick = (id: string) => {
    setEditLoading(id);
    // Here you would typically open a modal or navigate to an edit page
    console.log('Edit expense with id:', id);
    // Simulate edit operation
    setTimeout(() => {
      setEditLoading(null);
    }, 1000);
  };

  const columns: GridColDef<Expense>[] = [
    { 
      field: 'title', 
      headerName: 'Title', 
      width: 200,
      editable: true
    },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      width: 120,
      type: 'number',
      valueFormatter: (value: number) => `$${value.toFixed(2)}`,
      editable: true
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 150,
      editable: true
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      valueFormatter: (value: string) => {
        try {
          return format(new Date(value), 'MMM dd, yyyy');
        } catch {
          return 'Invalid date';
        }
      },
      editable: true,
      type: 'date'
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<Edit />}
          label="Edit"
          onClick={() => handleEditClick(params.id as string)}
          showInMenu
          disabled={editLoading === params.id}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<Delete />}
          label="Delete"
          onClick={() => deleteExpense(params.id as string)}
          showInMenu
          disabled={deleteLoading === params.id}
        />
      ]
    }
  ];

  const processRowUpdate = async (newRow: Expense, oldRow: Expense) => {
    try {
      // Call your API to update the expense
      const response = await api.put(`/expenses/${newRow._id}`, newRow);
      setExpenses(expenses.map(row => (row._id === newRow._id ? response.data : row)));
      return response.data;
    } catch (err) {
      console.error('Failed to update expense:', err);
      return oldRow; // Revert back if error
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [refreshTrigger]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={expenses}
        columns={columns}
        loading={loading}
        getRowId={(row) => row._id}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => console.error(error)}
        editMode="row"
      />
    </div>
  );
};