const fetch = require('node-fetch');
const checkRecaptcha = async (ip) => {

    // Check if the user is human or not by calling the recaptcha api from google
    const recaptchaUrl = `https://ipqualityscore.com/api/json/ip/${process.env.VPN_TOKEN}/${ip}`;

    const response = await fetch(recaptchaUrl, { method: 'POST' });

    const data = await response.json();

    return data;
};

module.exports = checkRecaptcha;