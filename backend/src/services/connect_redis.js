const redis = require("redis");

let redisClient;
const CACHED_DURATION = 180

const connectRedis = async () => {
    redisClient = redis.createClient();
    redisClient.on('error', (error) => console.error(`Redis Error : ${error}`));
    redisClient.on('ready', ()=>{console.log('Redis client is ready !')})
    redisClient.on('reconnecting', ()=>{console.log('Redis client is trying to reconnect !')})
    await redisClient.connect();
}

const redisGet = async (key) => {
    const cachedData = await redisClient.get(key);
    if(cachedData)
        return { cachedData: JSON.parse(cachedData), isCached: true}
    else
        return { cachedData: null, isCached: false}
}

const redisSet = async (key, value, duration = CACHED_DURATION)=>{
    await redisClient.set(key, JSON.stringify(value), 
        {NX: true, EX: duration}); // NX: only set whenever key does not exist in redis
}

const redisHSet = async (key, field, value)=>{
    await redisClient.hSet(key, field, JSON.stringify(value))
}

const redisHVals = async (key)=>{
    const cachedData = await redisClient.hVals(key)
    return cachedData.map( data => JSON.parse(data))
}

const redisExist = async (key) => {
    return await redisClient.exists(key)
}

const redisHDel = async (key, field) => {
    await redisClient.hdel(key, field, (err, reply) => {
        if (err) {
          console.error(err);
          return;
        }
      
        if (reply === 1) {
          console.log(`Field "${field}" deleted successfully from key "${key}"`);
        } else {
          console.log(`Field "${field}" does not exist in key "${key}"`);
        }
      })
}
module.exports = {connectRedis, redisGet, redisSet, redisHSet, redisHVals, redisExist, redisHDel}