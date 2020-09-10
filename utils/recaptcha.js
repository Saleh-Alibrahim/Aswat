const fetch = require('node-fetch');
const checkRecaptcha = async (token) => {

    // Check if the user is human or not by calling the recaptcha api from google
    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;

    const response = await fetch(recaptchaUrl, { method: 'POST' });

    const data = await response.json();

    // Check if the recaptcha failed
    if (data.success == false || data.score < 0.3) {
        return false;
    }

    return true;
};

module.exports = checkRecaptcha;