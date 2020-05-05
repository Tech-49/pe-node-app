const router = require('express').Router();
const user = require('../controllers/user');
const { grantAccess, verifyToken } = require('../middleware/auth');

router.get("/", verifyToken, grantAccess('readAny', 'user'), user.getUsers);
router.post('/create', verifyToken, grantAccess('createAny', 'user'), user.createUser);
router.post('/update', verifyToken, grantAccess('updateAny', 'user'), user.updateUser);

module.exports = router;