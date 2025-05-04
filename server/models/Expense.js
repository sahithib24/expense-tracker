const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'] 
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);