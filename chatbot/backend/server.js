require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const authRouter = require('./routes/auth.routes');
const usersRouter = require('./routes/users.routes');
const messagesRouter = require('./routes/messages.routes');

const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || '*',
        methods: ['GET', 'POST'],
    },
});

app.set('io', io);

io.use((socket, next) => {
    const token = socket.handshake?.auth?.token;
    if (!token) return next();

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = payload.userId || payload.id || payload._id;
        return next();
    } catch (err) {
        console.warn('Socket auth failed:', err.message);
        return next();
    }
});

io.on('connection', async (socket) => {
    console.log('Socket connected:', socket.id, 'userId:', socket.userId);

    try {
        if (socket.userId) {
            socket.join(socket.userId.toString());

            await User.findByIdAndUpdate(socket.userId, { online: true });

            const users = await User.find().select('-passwordHash');
            io.emit('users_updated', users);
        }
    } catch (err) {
        console.error('Error en conexión socket handling:', err);
    }

    socket.on('disconnect', async () => {
        console.log('Socket disconnected:', socket.id, 'userId:', socket.userId);
        try {
            if (socket.userId) {
                await User.findByIdAndUpdate(socket.userId, { online: false });
                const users = await User.find().select('-passwordHash');
                io.emit('users_updated', users);
            }
        } catch (err) {
            console.error('Error al desconectar socket:', err);
        }
    });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connectat');
        server.listen(PORT, () => console.log('Server escoltant al port', PORT));
    })
    .catch(err => console.error('MongoDB connection error:', err));
