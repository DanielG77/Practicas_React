const jwt = require('jsonwebtoken');
const User = require('../models/User');


module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No s'ha proporcionat token d'autenticació" });
    }
    const token = authHeader.split(' ')[1];


    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // carregar l'usuari opcionalment
        const user = await User.findById(payload.id).select('-passwordHash');
        if (!user) return res.status(401).json({ message: 'Usuari no trobat' });
        req.user = user;
        next();
    } catch (err) {
        console.error('authMiddleware error:', err.message);
        return res.status(401).json({ message: 'Token invàlid o expirat' });
    }
};