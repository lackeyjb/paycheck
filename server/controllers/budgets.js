var _       = require('lodash');
var async   = require('async');
var Budget  = require('../models/budget');
var User    = require('../models/user');
var Expense = require('../models/expense');

module.exports.create = function(req, res) {
  async.waterfall([
    createBudget.bind(this, req),
    updateUser
  ],
  function (err, result) {
    if (err) return res.status(400).json(err);
    return res.status(201).json(result);
  });
};

module.exports.getAllBudgets = function(req, res) {
  User
    .findById("55fefdca2728e8943c3006ec")
    .select('budgets')
    .populate('budgets')
    .exec(function (err, user) {
      if (err) {
        return res.status(400).json(err);
      }
      User.populate(user, {
        path: 'budgets.expenses',
        model: 'Expense'
      }, function (err, user) {
        if (err) return res.status(400).json(err);
        return res.status(200).json(user.budgets);
      });
    });
};

module.exports.getLatestBudget= function(req, res) {
  async.waterfall([
    findLastBudget.bind(this, req),
    populateExpenses
  ],
  function (err, result) {
    if (err) return res.status(400).json(err);
    return res.status(200).json(result);
  });
};

module.exports.addExpenses = function(req, res) {
  async.waterfall([
    findLastBudget.bind(this, req),
    createExpense.bind(this, req),
    addExpense,
    updateUser.bind(this, req),
    populateExpenses
  ], function (err, result) {
    if (err) return res.status(400).json(err);
    return res.status(200).json(result);
  });
};

///////////////////
///////////////////

function updateUser(req, budget, next) {
  User.findByIdAndUpdate("55fefdca2728e8943c3006ec",
    { $push: { budgets: budget._id } },
    { safe: true, upsert: true, new: true },
    function (err, user) {
      if (err) next(err);
      next(null, budget);
    }
  );
}

function createBudget(req, next) {
  Budget.create({
    limit: req.body.limit
  }, function (err, budget) {
    if (err) next(err);
    next(null, req, budget);
  });
}

function findLastBudget(req, next) {
  var latestBudget;
  User
    .findById("55fefdca2728e8943c3006ec")
    .populate('budgets')
    .exec(function (err, user) {
      if (err) next(err);
      latestBudget = _.last(user.budgets);
      next(null, latestBudget);
    });
}

function createExpense(req, latestBudget, next) {
  var description = req.body.description || 'no description';
  var amount      = req.body.amount;
  var dateSpent   = req.body.dateSpent || new Date();
  var category    = req.body.category || 'uncategorized';

  Expense.create({
    description: description,
    amount: amount,
    dateSpent: dateSpent,
    category: category
  },
  function (err, expense) {
    if (err) return next(err);
    next(null, latestBudget, expense);
  });
}

function addExpense(latestBudget, expense, next) {
  var newLimit = latestBudget.limit - expense.amount;
  Budget.findByIdAndUpdate(latestBudget._id,
    {
      $push: { expenses: expense._id },
      limit: newLimit
    },
    { safe: true, upsert: true, new: true },
    function (err, budget) {
      if (err) return next(err);
      next(null, budget);
    }
  );
}

function populateExpenses(budget, next) {
  Budget
  .findById(budget._id)
  .populate('expenses')
  .exec(function (err, budgetWithExpenses) {
    if (err) return next(err);
    next(null, budgetWithExpenses);
  });
}
