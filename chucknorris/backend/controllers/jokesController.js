const { chuckAPI, libreTranslateAPI } = require('../utils/apiClient');
const User = require('../models/User');

exports.getCategories = async (req, res) => {
    try {
        const response = await chuckAPI.get('/jokes/categories');
        res.json({ categories: response.data });
    } catch (err) {
        console.error('getCategories error:', err.message);
        res.status(500).json({ message: 'Error obtenint categories' });
    }
};

const fetchTwoJokes = async (category) => {
    try {
        const j1 = await chuckAPI.get('/jokes/random', { params: { category } });
        const j2 = await chuckAPI.get('/jokes/random', { params: { category } });
        return [j1.data, j2.data];
    } catch (err) {
        console.warn('fetchTwoJokes advertència:', err.message);
        try {
            const one = await chuckAPI.get('/jokes/random', {
                params: {
                    category
                }
            });
            return [one.data];
        } catch (e) {
            return [];
        }
    }
};

exports.getJokesByCategory = async (req, res) => {
    try {
        const { category, translateTo } = req.body;
        if (!category) return res.status(400).json({
            message: 'Falta category al body'
        });
        const jokes = await fetchTwoJokes(category);
        if (!translateTo) {
            if (req.user) await incrementUserCategory(req.user._id, category,
                jokes.length);
            return res.json({ jokes });
        }
        const translated = [];
        for (const j of jokes) {
            try {
                const payload = {
                    q: j.value, source: 'en', target: translateTo,
                    format: 'text'
                };
                const r = await libreTranslateAPI.post('/translate', payload);
                translated.push({ ...j, translated: r.data.translatedText || '' });
            } catch (err) {
                console.warn('Error traduint acudit:', err.message);
                translated.push({ ...j, translated: null });
            }
        }
        if (req.user) await incrementUserCategory(req.user._id, category,
            translated.length);
        res.json({ jokes: translated });
    } catch (err) {
        console.error('getJokesByCategory error:', err.message);
        res.status(500).json({ message: 'Error obtenint acudits' });
    }
};

const incrementUserCategory = async (userId, category, inc = 1) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;
        const item = user.jokesViewed.find(x => x.category === category);
        if (item) item.count += inc;
        else user.jokesViewed.push({ category, count: inc });
        await user.save();
    } catch (err) {
        console.error('incrementUserCategory error:', err.message);
    }
};

exports.getMyStats = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('username email preferredLanguage jokesViewed totalLoggedSeconds lastLogin');
        res.json({ user });
    } catch (err) {
        console.error('getMyStats error:', err.message);
        res.status(500).json({ message: 'Error obtenint estadístiques' });
    }
};