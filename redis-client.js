const Redis = require("ioredis");

if (!process.env.REDISPORT || !process.env.REDISHOST || !process.env.REDISPASSWORD || !process.env.REDISUSER) {
    throw new Error("REDIS ENV CREDENTIALS ARE NOT SET");
}

// When a new Redis instance is created, a connection to Redis will be created at the same time.
const redis = new Redis({
    port: process.env.REDISPORT, // Redis port
    host: process.env.REDISHOST, // Redis host
    username: process.env.REDISUSER, // needs Redis >= 6
    password: process.env.REDISPASSWORD,
});
redis.on("connect", () => console.log("Redis: CONNECTED"));
redis.on("ready", () => {
    console.log("Redis: READY");
    console.log("emits when CLUSTER INFO reporting the cluster is able to receive commands (if enableReadyCheck is true) or immediately after connect event (if enableReadyCheck is false).")
});
redis.on("close", () => {
    console.log("Redis: CLOSE");
    console.log("emits when an established Redis server connection has closed.")
});
redis.on("reconnecting", () => {
    console.log("Redis: RECONNECTING");
    console.log("emits after close when a reconnection will be made. The argument of the event is the time (in ms) before reconnecting.")
});
redis.on("end", () => {
    console.log("Redis: END");
    console.log("	emits after close when no more reconnections will be made.")
});


console.log("Redis: CONNECTING...");

module.exports = redis;
