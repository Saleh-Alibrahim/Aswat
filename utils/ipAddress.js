
const getIpAddress = async (req) => {

    return (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress ||
        req.ip;

};

module.exports = getIpAddress;