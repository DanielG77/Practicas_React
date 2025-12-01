const express = require('express');
const router = express.Router();
const jokesController = require('../controllers/jokesController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/categories', jokesController.getCategories);

router.post('/category', async (req, res, next) => {
    req.user
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')) {
        return authMiddleware(req, res, () =>
            jokesController.getJokesByCategory(req, res));
    }
    return jokesController.getJokesByCategory(req, res);
});
router.get('/me/stats', authMiddleware, jokesController.getMyStats);

module.exports = router;