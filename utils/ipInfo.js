const fetch = require('node-fetch');
const ipCheck = async (ip) => {
    try {
        // Check the clint ip address if it's fraud or proxy
        const ipInfoUrl = `https://ipqualityscore.com/api/json/ip/${process.env.IP_INFO_TOKEN}/${ip}`;

        const response = await fetch(ipInfoUrl);
        console.log("ipCheck -> response", response)

        const data = await response.json();


        if (data.vpn || data.proxy || data.tor ||
            data.fraud_score > 85 || data.active_vpn || data.active_tor) {
            return false;
        }

        return true;
    }

    catch (e) {
        console.log(e);
        return false;
    }
};

module.exports = ipCheck;