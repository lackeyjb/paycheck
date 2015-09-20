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
    set: _setPrice,
    required: true
  },
  dateSpent: {
    type: Date,
    default: new Date()
  },
  category: {
    type: String,
    default: 'uncategorized'
  }
});

function _getPrice(num) {
  return (num/100).toFixed(2);
}
function _setPrice(num) {
  return num*100;
}

module.exports = mongoose.model('Expense', expenseSchema);
