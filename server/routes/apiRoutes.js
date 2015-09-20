var express             = require('express');
var router              = express.Router();
var budgetCtrl          = require('../controllers/budgets');
var ensureAuthenticated = require('../utils/authMiddleware');

// router.use(ensureAuthenticated);
router.post('/budget/new', budgetCtrl.create);
router.get('/budget', budgetCtrl.getLatestBudget);

module.exports = router;
