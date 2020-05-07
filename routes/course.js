const router = require('express').Router();
const course = require('../controllers/course');
const { grantAccess, verifyToken } = require('../middleware/auth');

router.get("/", verifyToken, grantAccess('readAny', 'course'), course.getCourses);
router.get("/:id", verifyToken, grantAccess('readAny', 'course'), course.getCourse);
router.post('/create', verifyToken, grantAccess('createAny', 'course'), course.createCourse);

module.exports = router;