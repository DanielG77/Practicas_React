// routes/messages.routes.js
const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { to, content } = req.body;

    if (!content || typeof content !== 'string') {
        return res.status(400).json({ message: 'Contingut del missatge invàlid' });
    }

    try {
        const msg = new Message({ from: req.userId, to: to || null, content });
        await msg.save();
        await msg.populate('from', 'name');

        const io = req.app.get('io');
        if (!io) {
            console.warn('Socket.IO no disponible a req.app');
        } else {
            if (to) {
                io.to(to.toString()).emit('new_message', msg);
                io.to(req.userId.toString()).emit('new_message', msg);
            } else {
                io.emit('new_message', msg);
            }
        }

        res.json(msg);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error enviant missatge' });
    }
});

router.get('/', auth, async (req, res) => {
    const other = req.query.userId || null;
    try {
        let msgs;
        if (other) {
            msgs = await Message.find({
                $or: [
                    { from: req.userId, to: other },
                    { from: other, to: req.userId }
                ]
            }).sort('createdAt').populate('from', 'name');
        } else {
            msgs = await Message.find({ to: null }).sort('createdAt').populate('from', 'name');
        }
        res.json(msgs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error recuperant missatges' });
    }
});

router.post('/mark-read', auth, async (req, res) => {
    const { messageIds } = req.body;
    try {
        await Message.updateMany({ _id: { $in: messageIds } }, { $set: { read: true } });

        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error' });
    }
});

module.exports = router;
