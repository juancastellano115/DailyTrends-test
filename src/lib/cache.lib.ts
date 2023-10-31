import type { RedisClientType } from 'redis';
import { createClient } from 'redis';
import { logger } from '../utils/logger';
import { REDIS_URL } from 'config';

let redisClient: RedisClientType;
let isReady: boolean;

const cacheOptions = {
  url: REDIS_URL,
};

export const REDIS_EXPIRATION_TIME = 60;

async function getCache(): Promise<RedisClientType> {
  if (!isReady) {
    redisClient = createClient({
      ...cacheOptions,
    });
    redisClient.on('error', err => logger.error(`Redis Error: ${err}`));
    redisClient.on('reconnecting', () => logger.info('Redis reconnecting'));
    redisClient.on('ready', () => {
      isReady = true;
    });
    await redisClient.connect();
  }
  return redisClient;
}

getCache()
  .then(connection => {
    redisClient = connection;
  })
  .catch(err => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    logger.error(`Error connecting to Redis: ${err}`);
  });

export { getCache };
