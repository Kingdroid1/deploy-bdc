const axios = require('axios');
const cheerio = require('cheerio');

const url = "https://www.cbn.gov.ng/rates/ExchRateByCurrency.asp";
const cbnBuyingRate = new Set();
const cbnSellingRate = new Set();
const currency = new Set();

const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

const getResults = async () => {

  const $ = await fetchData();

  $('table > tbody > tr:nth-child(2)').each((index, element) => {
    currency.add($(element).text());
  });

  return {
    currency: [...currency]
  };

}

module.exports.cbnRates = (req, res) => {
  const result = await getResults();
  res.send("index", result);
}
