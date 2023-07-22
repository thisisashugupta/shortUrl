const Redis = require("ioredis");
const redis = new Redis({
  // Use the environment variables to configure the Redis client
  url: process.env.REDIS_URL, // Redis server URL
  //   host: process.env.REDISHOST,      // Redis server host
  //   port: process.env.REDISPORT,      // Redis server port
  //   password: process.env.REDISPASSWORD,  // Redis server password (if required)
  //   username: process.env.REDISUSER,      // Redis server username (if required)
  // Add any additional configuration options as needed
});

module.exports = redis;
