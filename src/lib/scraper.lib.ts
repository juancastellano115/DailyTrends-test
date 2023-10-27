/**
 * This lib is responsible for scraping the data from the websites elmundo.es and elpais.es,
 * It should use cheerio to parse the html and save the 5 most recent news from each website
 */

import axios from 'axios';
import { CheerioAPI, load } from 'cheerio';
import iconv from 'iconv-lite';
import { Article } from '@/interfaces/article.interface';

const NUMBER_OF_NEWS = 5;

export async function scrapeNews(url: string): Promise<Article[]> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const html = iconv.decode(Buffer.from(response.data), url === process.env.URL_EL_PAIS ? 'UTF-8' : 'latin1');
  const $ = load(html);
  const articles: Article[] = [];

  for (let i = 0; i < NUMBER_OF_NEWS; i++) {
    try {
      const articleData = await extractArticles(url, $, i);
      articles.push(articleData);
    } catch (error) {
      console.error(`Error extracting article ${i} from ${url}: ${error}`);
    }
  }
  return articles;
}

async function extractArticles(url: string, $: CheerioAPI, i: number): Promise<Article> {
  switch (url) {
    case process.env.URL_EL_MUNDO:
      return extractArticlesElMundo($, i);
    case process.env.URL_EL_PAIS:
      return extractArticlesElPais($, i);
    default:
      throw new Error(`Unsupported URL: ${url}`);
  }
}

async function extractArticlesElMundo($: CheerioAPI, i: number): Promise<Article> {
  const heading = $('article').eq(i).find('h2').text();

  const author = $('article').eq(i).find('.ue-c-cover-content__byline-list').text();

  const subHeading = $('article').eq(i).find('.ue-c-cover-content__footer').text();

  const link = $('article').eq(i).find('.ue-c-cover-ue-c-cover-content__link-whole-content').attr('href');

  return { heading, author, subHeading, link };
}

async function extractArticlesElPais($: CheerioAPI, i: number): Promise<Article> {
  // Skip the first article
  i++;

  const heading = $('article').eq(i).find('header h2').text();

  const author = $('article').eq(i).find('.c_a_a').text();

  const subHeading = $('article').eq(i).find('.c_d').text();

  const link = $('article').eq(i).find('a').attr('href');

  return { heading, author, subHeading, link };
}
