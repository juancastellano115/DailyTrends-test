import { QueueEventsOptions } from './../../node_modules/bullmq/dist/esm/interfaces/queue-options.d';
import type { Processor, QueueOptions } from 'bullmq';
import { QueueEvents } from 'bullmq';
import { Queue, Worker } from 'bullmq';
import { scrapeNews } from '@/lib/scraper.lib';

type AugmentedQueue<T> = Queue<T> & {
  events: QueueEvents;
};
type RegisteredQueue = {
  queue: Queue;
  queueEvents: QueueEvents;
  worker: Worker;
};
declare global {
  var __registeredQueues: Record<string, RegisteredQueue> | undefined;
}
const redisOptions = {
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || 'localhost',
  password: process.env.REDIS_PASSWORD || '',
  tls: process.env.REDIS_TLS || false,
};

const registeredQueues = global.__registeredQueues || (global.__registeredQueues = {});
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

export const scraperQueue = registerQueue('scraper', async (job: { data: { url: string } }) => {
  const { url } = job.data;
  const data = await scrapeNews(url);
  console.log(data);
});
