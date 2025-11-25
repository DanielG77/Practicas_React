const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.userId } }).select('-passwordHash');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error obtenint usuaris' });
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const me = await User.findById(req.userId).select('-passwordHash');
        res.json(me);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error obtenint usuari' });
    }
});

router.put('/online', auth, async (req, res) => {
    try {
        const onlineValue = typeof req.body.online === 'boolean' ? req.body.online : true;

        await User.findByIdAndUpdate(req.userId, { online: onlineValue }, { new: true });

        const users = await User.find({ _id: { $ne: req.userId } }).select('-passwordHash');

        const io = req.app.get('io');
        io.emit('users_updated', users);

        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error actualitzant estat online' });
    }
});


router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-passwordHash'); // excluimos la contraseña
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error obteniendo usuario', error: err.message });
    }
});


module.exports = router;
