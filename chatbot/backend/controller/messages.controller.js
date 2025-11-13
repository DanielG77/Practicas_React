const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/authMiddleware');
const router = express.Router();