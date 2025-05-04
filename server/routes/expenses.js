const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Added this missing import
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// Protect all expense routes
router.use(auth);

// @route   POST /api/expenses
router.post('/', async (req, res) => {
  try {
    // Input validation
    if (!req.body.title || !req.body.amount || !req.body.category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const expense = new Expense({
      title: req.body.title,
      amount: req.body.amount,
      category: req.body.category,
      userId: req.user.id
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/expenses?month=2024-05
router.get('/', async (req, res) => {
  try {
    const { month, category } = req.query;
    let query = { userId: req.user.id };
    
    if (month) {
      const [year, monthNum] = month.split('-');
      if (!year || !monthNum) {
        return res.status(400).json({ error: 'Invalid month format (use YYYY-MM)' });
      }
      query.date = { 
        $gte: new Date(year, monthNum - 1, 1),
        $lt: new Date(year, monthNum, 1)
      };
    }
    
    if (category) query.category = category;
    
    const expenses = await Expense.find(query).sort('-date');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ msg: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/expenses/analytics?month=2024-05
router.get('/analytics', async (req, res) => {
  try {
    const { month } = req.query;
    
    if (!month) {
      return res.status(400).json({ error: 'Month parameter required (YYYY-MM)' });
    }

    const [year, monthNum] = month.split('-');
    if (!year || !monthNum) {
      return res.status(400).json({ error: 'Invalid month format (use YYYY-MM)' });
    }

    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 1);

    const data = await Expense.aggregate([
      {
        $match: {
          userId: req.user.id,
          date: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;