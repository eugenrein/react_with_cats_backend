const axios = require('axios');
const cheerio = require('cheerio');
const baseUrl = 'https://www.ebay-kleinanzeigen.de/s-katzen/anzeige:angebote';
const category = 'c136';
const catPool = [];

let page = 1;

const request = () => axios.get(`${baseUrl}/seite:${page}/${category}`);

const getNextCat = () => {
  if (catPool.length > 0) {
    return Promise.resolve(catPool.pop());
  }

  return request()
    .then((response) => {
      const $ = cheerio.load(response.data);
      $('.aditem').each(function() {
        const id = $(this).data('adid');
        const image = $(this).find('.imagebox').data('imgsrc');
        const title = $(this).find('.aditem-main h2.text-module-begin a').text().replace(/\s+/gi, ' ');
        const description = $(this).find('.aditem-main p').first().text().replace(/\s+/gi, ' ');

        $(this).find('.aditem-details strong').html('');
        const location = $(this).find('.aditem-details').text().replace(/\s+/gi, ' ');

        if (id && image && title && description && location) {
          catPool.push({
            id,
            image,
            title: title.trim(),
            description: description.trim(),
            location: location.trim()
          });
        }
      });

      if (catPool.length > 0) {
        page++;
        return Promise.resolve(catPool.pop());
      }
      return Promise.reject('failed to load cats')
    });
};

module.exports = {
  getNextCat
};