const redis = require('redis');
let client;

exports.connectCache = () => {
  // create cache client
  client = redis.createClient(6379);

};

exports.cacheIP = async (ip, pollID) => {
  return new Promise((resolve, reject) => {
    client.get(ip, (err, data) => {

      // Check if there is an error throw it
      if (err) reject(err);

      if (!data) {
        const pollList = [pollID];
        client.setex(ip, 30, JSON.stringify(pollList));
        resolve(true);
      }
      else {
        data = JSON.parse(data);

        if (!data.includes(pollID)) {
          data.push(pollID);
          client.setex(ip, 30, JSON.stringify(data));
          resolve(true);
        }

        resolve(false);
      }


    });
  });

};