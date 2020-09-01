const fetch = require('node-fetch');
const checkIP = async (ip) => {

    // Check the clint ip address if it's fraud or proxy
    const ipInfoUrl = `https://ipqualityscore.com/api/json/ip/${process.env.IP_INFO_TOKEN}/${ip}`;

    const response = await fetch(ipInfoUrl);

    const data = await response.json();

    if (data.vpn || data.proxy || data.tor || data.fraud_score > 85) {
        return false;
    }

    return true;
};

module.exports = checkIP;