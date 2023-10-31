import { scraperElMundoQueue, scraperElPaisQueue } from './scraper.queue';
import { URL_EL_MUNDO, URL_EL_PAIS } from 'config';

const jobScheduleMap = {
  'scraper-el-mundo': '*/5 * * * *',
  'scraper-el-pais': '*/5 * * * *',
};

export const initializeScraperElMundoQueue = async () => {
  const name = scraperElMundoQueue.name;
  await scraperElMundoQueue.add(
    'scrape-el-mundo',
    { url: URL_EL_MUNDO, provider: 'el-mundo' },
    { repeat: { pattern: jobScheduleMap[name], jobId: 'scrape-el-mundo' } },
  );
};

export const initializeScraperElPaisQueue = async () => {
  const name = scraperElPaisQueue.name;
  await scraperElPaisQueue.add(
    'scrape-el-pais',
    { url: URL_EL_PAIS, provider: 'el-pais' },
    { repeat: { pattern: jobScheduleMap[name], jobId: 'scrape-el-pais' } },
  );
};
