const express = require('express');
const router = express.Router();
const Group = require('../models/Groups');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, async (req, res) => {
    const { name, members } = req.body;
    if (!name || !members || !Array.isArray(members)) {
        return res.status(400).json({ message: 'Nombre y miembros obligatorios' });
    }
    try {
        const group = await Group.create({
            name,
            members,
            admin: req.userId
        });
        res.status(201).json(group);
    } catch (err) {
        res.status(500).json({ message: 'Error creando grupo', error: err.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const groups = await Group.find({ members: req.userId }).populate('members', 'name');
        res.json(groups);
    } catch (err) {
        res.status(500).json({ message: 'Error listando grupos', error: err.message });
    }
});

router.post('/:id/join', auth, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Grupo no encontrado' });

        if (!group.members.includes(req.userId)) {
            group.members.push(req.userId);
            await group.save();
        }

        res.json({ message: 'Usuario añadido al grupo', group });
    } catch (err) {
        res.status(500).json({ message: 'Error al unirse al grupo', error: err.message });
    }
});

module.exports = router;
