const redis = require("./redis-client");

function rateLimiter({ secondsWindow, allowedHits }) {
  // rate limit setup
  return async (req, res, next) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log('ip = ', ip);
    const requests = await redis.incr(ip);
    console.log('requests = ', requests);
    console.log(
      `Rate Limiter: Number of requests made by ip address ${ip} are ${requests}`
    );

    let ttl;
    if (requests === 1) {
      await redis.expire(ip, secondsWindow);
      ttl = secondsWindow;
    } else {
      ttl = await redis.ttl(ip);
    }
    console.log("TTL =", ttl);

    if (requests > allowedHits) {
      return res.render("index", {
        urlObj: "oNo: Too Many Requests. Try Again Later.",
        message: `${requests} requests made in under a minute.`,
      });
    } else next();
  };
}

module.exports = rateLimiter;
