import axios from 'axios';
import { ElMundoScraper, ElPaisScraper } from '../lib/scraper.lib';
import FeedModel from '../models/feed.model';

jest.mock('axios');
jest.mock('../models/feed.model');

const mockFeedModel = FeedModel as jest.MockedClass<typeof FeedModel>;
mockFeedModel.mockImplementation(() => ({
  create: jest.fn(),
  insertMany: jest.fn(),
  deleteById: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  updateById: jest.fn(),
}));

// After each test, clear axios mock
afterEach(() => {
  (axios.get as jest.MockedFunction<typeof axios.get>).mockClear();
});

describe('ElMundoScraper', () => {
  const scraper = new ElMundoScraper();
  const mockHtml = `<html><body><article><h2>Test header</h2><div class="ue-c-cover-content__byline-name"><div class="ue-c-cover-content__link">Author Test</div></div> <p class="ue-c-cover-content__footer">Test subheader</p><a class="ue-c-cover-content__link-whole-content" href="http://test.com"></a><picture class="ue-c-cover-content__figure"><source srcset="https://phantom-elmundo.unidadeditorial.es/af6aeaf010d71d8edf74f576739ec694/resize/450/f/webp/assets/multimedia/imagenes/2023/10/27/16984211023274.jpg 450w,https://phantom-elmundo.unidadeditorial.es/487a03882025d9974804c6a1a5a0ddfa/resize/475/f/webp/assets/multimedia/imagenes/2023/10/27/16984211023274.jpg 475w,https://phantom-elmundo.unidadeditorial.es/707f1ae4719d138c2cf03e139d55988e/resize/900/f/webp/assets/multimedia/imagenes/2023/10/27/16984211023274.jpg 900w,https://phantom-elmundo.unidadeditorial.es/d98c45b7d8ec162609e7750832c47469/resize/950/f/webp/assets/multimedia/imagenes/2023/10/27/16984211023274.jpg 950w"></source></picture></article></body></html>`;
  const mockResponse = { data: mockHtml };
  it('should scrape news from El Mundo', async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce(mockResponse);
    const articles = await scraper.scrapeNews('https://www.elmundo.es/', 'el-mundo');

    expect(articles.length).toBeGreaterThan(0);
    expect(articles[0].heading).toBeTruthy();
    expect(articles[0].author).toBeTruthy();
    expect(articles[0].subHeading).toBeTruthy();
    expect(articles[0].link).toBeTruthy();
    expect(articles[0].image).toBeTruthy();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('https://www.elmundo.es/', { responseType: 'arraybuffer' });
    expect(mockFeedModel).toHaveBeenCalled();
    expect(mockFeedModel.mock.instances[0].insertMany).toHaveBeenCalled();
  });

  it('should scrape news from El Mundo with no image and no subheader', async () => {
    const mockHtml = `<html><body><article><h2>Test header</h2><div class="ue-c-cover-content__byline-name"><div class="ue-c-cover-content__link">Author Test</div></div><a class="ue-c-cover-content__link-whole-content" href="http://test.com"></a></article></body></html>`;
    const mockImageResponse = { data: mockHtml };
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce(mockImageResponse);
    const articlesNoImage = await scraper.scrapeNews('https://www.elmundo.es/', 'el-mundo');

    expect(articlesNoImage.length).toBeGreaterThan(0);
    expect(articlesNoImage[0].heading).toBeTruthy();
    expect(articlesNoImage[0].author).toBeTruthy();
    expect(articlesNoImage[0].subHeading).toBeFalsy();
    expect(articlesNoImage[0].link).toBeTruthy();
    expect(articlesNoImage[0].image).toBeFalsy();
  });
});

describe('ElPaisScraper', () => {
  const scraper = new ElPaisScraper();
  const mockHtml =
    '<html><body><article><header><h2>Test header</h2></header><p class="c_a_a">Author Test</p><p class="c_d">Test subheader</p><a href="http://test.com"></a><img srcset="https://phantom-elmundo.unidadeditorial.es/af6aeaf010d71d8edf74f576739ec694/resize/450/f/webp/assets/multimedia/imagenes/2023/10/27/16984211023274.jpg 450w,https://phantom-elmundo.unidadeditorial.es/487a03882025d9974804c6a1a5a0ddfa/resize/475/f/webp/assets/multimedia/imagenes/2023/10/27/16984211023274.jpg 475w,https://phantom-elmundo.unidadeditorial.es/707f1ae4719d138c2cf03e139d55988e/resize/900/f/webp/assets/multimedia/imagenes/2023/10/27/16984211023274.jpg 900w,https://phantom-elmundo.unidadeditorial.es/d98c45b7d8ec162609e7750832c47469/resize/950/f/webp/assets/multimedia/imagenes/2023/10/27/16984211023274.jpg 950w"></img></article></body></html>';
  const mockResponse = { data: mockHtml };

  it('should scrape news from El Pais', async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(mockResponse);
    const articles = await scraper.scrapeNews('https://elpais.com/', 'el-pais');

    expect(articles.length).toBeGreaterThan(0);
    expect(articles[0].heading).toBeTruthy();
    expect(articles[0].author).toBeTruthy();
    expect(articles[0].subHeading).toBeTruthy();
    expect(articles[0].link).toBeTruthy();
    expect(articles[0].image).toBeTruthy();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('https://elpais.com/', { responseType: 'arraybuffer' });
    expect(mockFeedModel).toHaveBeenCalled();
    expect(mockFeedModel.mock.instances[0].insertMany).toHaveBeenCalled();
  });

  it('should scrape news from El Pais with no image and no subheader', async () => {
    const mockHtml =
      '<html><body><article><header><h2>Test header</h2></header><p class="c_a_a">Author Test</p><a href="http://test.com"></a></article></body></html>';
    const mockImageResponse = { data: mockHtml };
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce(mockImageResponse);
    const articlesNoImage = await scraper.scrapeNews('https://elpais.com/', 'el-pais');

    expect(articlesNoImage.length).toBeGreaterThan(0);
    expect(articlesNoImage[0].heading).toBeTruthy();
    expect(articlesNoImage[0].author).toBeTruthy();
    expect(articlesNoImage[0].subHeading).toBeFalsy();
    expect(articlesNoImage[0].link).toBeTruthy();
    expect(articlesNoImage[0].image).toBeFalsy();
  });
});
