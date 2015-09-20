var express         = require('express');
var router          = express.Router();
var budgetCtrl      = require('../controllers/budgets');
var isAuthenticated = require('../utils/authMiddleware');

// router.use(isAuthenticated);

router.post('/budgets/new', budgetCtrl.create);
router.get('/budgets/latest', budgetCtrl.getLatestBudget);
router.get('/budgets', budgetCtrl.getAllBudgets);
router.post('/budgets/expenses', budgetCtrl.addExpenses);

module.exports = router;
