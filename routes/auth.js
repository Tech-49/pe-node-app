const router = require('express').Router();
const controller = require('../controllers/auth');

router.post('/', controller.loginUser);
router.post('/recover', controller.recoverPassword);
router.post('/resetPassword/:token', controller.resetPassword);

module.exports = router;