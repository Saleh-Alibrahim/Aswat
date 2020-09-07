const redis = require('redis');
let client;

exports.connectCache = () => {
  // create cache client
  client = redis.createClient(process.env.REDISCLOUD_URL, { no_ready_check: true });

};

exports.cacheIP = async (ip, pollID) => {

  // Create unique ID from the poll id and the ip address
  const uniqueID = `${ip}-${pollID}`;

  return new Promise((resolve, reject) => {
    client.get(uniqueID, (err, data) => {

      // Check if there is an error  it
      if (err) reject(err);

      // Check if the key exists 
      if (!data) {
        // Add the uniqueID to the cache and let the user continue
        client.setex(uniqueID, 172800, true);

        resolve(true);
      }
      else
        // The uniqueID exists reject the user
        resolve(false);
    }
    );
  });

};