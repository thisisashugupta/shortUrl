const Redis = require("ioredis");
// new Redis("redis://username:authpassword@127.0.0.1:6380/4");
const redis = new Redis(process.env.REDIS_URL);
// Use the environment variables to configure the Redis client
//   host: process.env.REDISHOST,
//   port: process.env.REDISPORT,
//   password: process.env.REDISPASSWORD,
//   username: process.env.REDISUSER,

module.exports = redis;
