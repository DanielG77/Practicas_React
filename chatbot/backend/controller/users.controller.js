const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const router = express.Router();