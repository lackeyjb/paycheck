var _      = require('lodash');
var async  = require('async');
var Budget = require('../models/budget');
var User   = require('../models/user');

module.exports.create = function(req, res) {
  async.waterfall([
    function createBudget(next) {
      Budget.create({
        limit: req.body.limit
      }, function (err, budget) {
        if (err) next(err);
        next(null, budget);
      });
    },
    function updateUser(budget, next) {
      User.findByIdAndUpdate(req.user._id,
      { $push: { budgets: budget._id } },
      { safe: true, upsert: true, new: true },
      function (err, user) {
        if (err) next(err);
        next(null, budget);
      });
    }
  ], function (err, result) {
    if (err) return res.status(400).json(err);
    return res.status(201).json(result);
  });
};

module.exports.getLatestBudget= function(req, res) {
  var latestBudget;
  User
    .findById(req.user._id)
    .populate('budgets')
    .exec(function (err, user) {
      if (err) {
        return res.status(400).json(err);
      }
      latestBudget = _.last(user.budgets);
      return res.status(200).json(latestBudget);
    });
};
