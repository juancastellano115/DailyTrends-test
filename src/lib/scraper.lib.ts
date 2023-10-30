import axios from 'axios';
import { CheerioAPI, load } from 'cheerio';
import iconv from 'iconv-lite';
import FeedModel from '@/models/feed.model';
import { Feed } from '@/interfaces/feed.interface';

const NUMBER_OF_NEWS = 5;
const feedModel = new FeedModel();

/**
 * Abstract class representing a scraper.
 * @abstract
 */
export abstract class Scraper {
  /**
   * Array of Feed objects.
   * @protected
   */
  protected articles: Feed[];
  /**
   * Object containing encodings for different providers.
   * @private
   */
  private encondings = {
    'el-mundo': 'latin1',
    'el-pais': 'UTF-8',
  };
  /**
   * Creates an instance of Scraper.
   */
  constructor() {
    this.articles = [];
  }
  /**
   * Scrapes news from a given URL and provider.
   * @param {string} url - The URL to scrape news from.
   * @param {string} provider - The provider to scrape news from.
   * @returns {Promise<Feed[]>} - A promise that resolves to an array of Feed objects.
   */
  public async scrapeNews(url, provider): Promise<Feed[]> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const html = iconv.decode(Buffer.from(response.data), this.encondings[provider]);
    const $ = load(html);

    for (let i = 0; i < NUMBER_OF_NEWS; i++) {
      try {
        const articleData = await this.extractArticles($, i);
        // Clean properties where value is ""
        Object.keys(articleData).forEach(key => articleData[key] === '' && delete articleData[key]);

        this.articles.push(articleData);
      } catch (error) {
        console.error(`Error extracting article ${i} from ${url}: ${error}`);
      }
    }

    await feedModel.insertMany(this.articles.map(article => ({ ...article, provider: provider })));
    return this.articles;
  }
  /**
   * Extracts articles from a CheerioAPI object.
   * @param {CheerioAPI} $ - The CheerioAPI object to extract articles from.
   * @param {number} i - The index of the article to extract.
   * @returns {Promise<Feed>} - A promise that resolves to a Feed object.
   * @protected
   * @abstract
   */
  protected abstract extractArticles($: CheerioAPI, i: number): Promise<Feed>;
}

export class ElMundoScraper extends Scraper {
  protected async extractArticles($: CheerioAPI, i: number): Promise<Feed> {
    const heading = $('article').eq(i).find('h2').text();
    const author = $('article').eq(i).find('.ue-c-cover-content__byline-name .ue-c-cover-content__link').text();
    const subHeading = $('article').eq(i).find('.ue-c-cover-content__footer').text();
    const link = $('article').eq(i).find('.ue-c-cover-content__link-whole-content').attr('href');
    const image = $('article').eq(i).find('.ue-c-cover-content__figure').find('source').attr('srcset');

    return { heading, author, subHeading, link, image: image && image.split(' ')[0] };
  }
}

export class ElPaisScraper extends Scraper {
  protected async extractArticles($: CheerioAPI, i: number): Promise<Feed> {
    const heading = $('article').eq(i).find('header h2').text();
    const author = $('article').eq(i).find('.c_a_a').text();
    const subHeading = $('article').eq(i).find('.c_d').text();
    const link = $('article').eq(i).find('a').attr('href');
    const image = $('article').eq(i).find('img').attr('srcset');

    return { heading, author, subHeading, link, image: image && image.split(' ')[0] };
  }
}
