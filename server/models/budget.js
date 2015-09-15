var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var expenseSchema = new Schema({
  description: {
    type: String,
    defaut: 'no description'
  },
  amount: {
    type: Number,
    get: _getPrice,
    set: _setPrice
  },
  category: {
    type: String,
    default: 'uncategorized'
  }
});

var budgetSchema = new Schema({
  recurrence: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  limit: {
    type: Number,
    get: _getPrice,
    set: _setPrice
  },
  over: {
    type: Boolean,
    default: false
  },
  expenses: [expenseSchema],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

function _getPrice(num) {
  return (num/100).toFixed(2);
}
function _setPrice(num) {
  return num*100;
}
