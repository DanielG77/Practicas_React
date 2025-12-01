// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

if (!process.env.JWT_SECRET) {
    console.warn('Atenció: JWT_SECRET no està definit en les variables d\'entorn.');
}

const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign({ id: userId }, secret, { expiresIn });
};

exports.register = async (req, res) => {
    try {
        const { username, email, password, preferredLanguage } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Falten camps requerits: username, email i password' });
        }

        // Comprovar si ja existeix usuari per email o username
        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            return res.status(400).json({ message: 'Usuari o email ja existeix' });
        }

        // Hashear contrasenya
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Crear i guardar usuari
        const user = new User({
            username,
            email,
            passwordHash,
            preferredLanguage: preferredLanguage || 'en'
        });

        await user.save();

        // Generar token (només id dins el token)
        const token = generateToken(user._id);

        // No retornis passwordHash ni dades sensibles
        return res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                preferredLanguage: user.preferredLanguage
            }
        });
    } catch (err) {
        console.error('register error:', err && err.message ? err.message : err);
        return res.status(500).json({ message: 'Error intern al registrar usuari' });
    }
};

exports.login = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;
        if (!emailOrUsername || !password) {
            return res.status(400).json({ message: 'Falten camps requerits' });
        }

        const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
        if (!user) return res.status(401).json({ message: 'Credencials invàlides' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ message: 'Credencials invàlides' });

        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user._id);
        return res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                preferredLanguage: user.preferredLanguage
            }
        });
    } catch (err) {
        console.error('login error:', err && err.message ? err.message : err);
        return res.status(500).json({ message: 'Error intern a l\'iniciar sessió' });
    }
};

exports.reportSession = async (req, res) => {
    try {
        const { seconds } = req.body;
        if (typeof seconds !== 'number') {
            return res.status(400).json({ message: 'S\'ha d\'enviar seconds com a número' });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'Usuari no trobat' });

        user.totalLoggedSeconds = (user.totalLoggedSeconds || 0) + seconds;
        await user.save();

        return res.json({ message: 'Temps de sessió actualitzat', totalLoggedSeconds: user.totalLoggedSeconds });
    } catch (err) {
        console.error('reportSession error:', err && err.message ? err.message : err);
        return res.status(500).json({ message: 'Error intern al reportar sessió' });
    }
};
