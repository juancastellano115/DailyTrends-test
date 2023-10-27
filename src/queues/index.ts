import { scraperQueue } from './scraper.queue';

const jobScheduleMap = {
  scraper: '*/1 * * * *',
};

export const initializeScraperQueue = () => {
  const name = scraperQueue.name;
  scraperQueue.add('scrape', { url: process.env.URL_EL_MUNDO }, { repeat: { pattern: jobScheduleMap[name], jobId: 'scrape-el-mundo' } });
  scraperQueue.add('scrape', { url: process.env.URL_EL_PAIS }, { repeat: { pattern: jobScheduleMap[name], jobId: 'scrape-el-pais' } });
};
