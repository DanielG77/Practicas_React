require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');


const authRoutes = require('./routes/auth');
const jokesRoutes = require('./routes/jokes');
const translateRoutes = require('./routes/translate');


const app = express();


app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));


const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    message: {
        message: "Masses peticions, torna-ho a intentar d'aquí un minut."
    }
});
app.use(limiter);


// Connectar a MongoDB
connectDB();


app.use('/api/auth', authRoutes);
app.use('/api/jokes', jokesRoutes);
app.use('/api/translate', translateRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Error intern del servidor' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor escoltant al port ${PORT}`);
});