const axios = require('axios');


const chuckAPI = axios.create({
    baseURL: 'https://api.chucknorris.io',
    timeout: 5000
});


const libreTranslateAPI = axios.create({
    baseURL: process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com',
    timeout: 8000,
    headers: { 'accept': 'application/json' }
});


module.exports = { chuckAPI, libreTranslateAPI };