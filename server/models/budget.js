var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

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
  expenses: [{
    type: Schema.Types.ObjectId,
    ref: 'Expense'
  }]
});

function _getPrice(num) {
  return (num/100).toFixed(2);
}
function _setPrice(num) {
  return num*100;
}

module.exports = mongoose.model('Budget', budgetSchema);
