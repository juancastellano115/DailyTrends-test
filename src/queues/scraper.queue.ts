import { QueueEventsOptions } from './../../node_modules/bullmq/dist/esm/interfaces/queue-options.d';
import type { Processor, QueueOptions } from 'bullmq';
import { QueueEvents } from 'bullmq';
import { Queue, Worker } from 'bullmq';
import { ElMundoScraper, ElPaisScraper } from '@/lib/scraper.lib';
import { logger } from '@utils/logger';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '@config';
type AugmentedQueue<T> = Queue<T> & {
  events: QueueEvents;
};

type jobData = {
  url: string;
  provider: string;
};

const redisOptions = {
  port: Number.parseInt(REDIS_PORT) || 6379,
  host: REDIS_HOST || 'localhost',
  password: REDIS_PASSWORD || '',
  tls: !!process.env.REDIS_TLS,
};

// Initialize scraper classes
const elMundoScraper = new ElMundoScraper();
const elPaisScraper = new ElPaisScraper();

const registeredQueues = {};
/**
 *
 * @param name Unique name of the queue
 * @param processor
 */
export function registerQueue<T>(name: string, processor: Processor<T>) {
  if (!registeredQueues[name]) {
    const queue = new Queue(name, { connection: redisOptions } as QueueOptions);
    const queueEvents = new QueueEvents(name, { connection: redisOptions } as QueueEventsOptions);
    const worker = new Worker<T>(name, processor, {
      lockDuration: 1000 * 60 * 15,
      concurrency: 8,
      connection: redisOptions as QueueOptions,
    });
    registeredQueues[name] = {
      queue,
      queueEvents,
      worker,
    };
  }
  const queue = registeredQueues[name].queue as AugmentedQueue<T>;
  queue.events = registeredQueues[name].queueEvents;
  return queue;
}

export const scraperElMundoQueue = registerQueue('scraper-el-mundo', async (job: { data: jobData }) => {
  const { url, provider } = job.data;
  logger.info(`Scraping data from ${url}`);
  const data = await elMundoScraper.scrapeNews(url, provider);
  logger.info(`Scraped ${data.length} news from ${provider}`);
});

export const scraperElPaisQueue = registerQueue('scraper-el-pais', async (job: { data: jobData }) => {
  const { url, provider } = job.data;
  logger.info(`Scraping data from ${url}`);
  const data = await elPaisScraper.scrapeNews(url, provider);
  logger.info(`Scraped ${data.length} news from ${provider}`);
});
