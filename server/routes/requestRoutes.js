const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { createRequest, myRequests, receivedRequests, updateStatus } = require('../controllers/requestController');
router.use(protect);
router.get('/my', myRequests);
router.get('/received', receivedRequests);
router.post('/', (req, res, next) => req.user.role === 'ngo' ? createRequest(req, res, next) : res.status(403).json({ message: 'NGO access required' }));
router.patch('/:id/status', updateStatus);
module.exports = router;
