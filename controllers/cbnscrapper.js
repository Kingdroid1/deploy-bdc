const axios = require('axios');
const cheerio = require('cheerio');

const siteUrl = "https://www.cbn.gov.ng/rates/ExchRateByCurrency.asp";
const currencies = new Set();

const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

const getResults = async () => {
  const $ = await fetchData();
  
  let totalRun = 0;
  let nrow = 2;


  currencies.clear();

  while (totalRun < 5) {

    let count = 0;
    let date = $(`table.mytables tbody tr:nth-child(${nrow}) > td:nth-child(1)`).text();

    while (count < 3 ) {
      let moneyType = $(`table.mytables tbody tr:nth-child(${nrow}) > td:nth-child(2)`).text();

      let rate = $(`table.mytables tbody tr:nth-child(${nrow}) > td:nth-child(4)`).text();

      currencies.add({
        currencyDate: date,
        currency: moneyType,
        cbnRate: rate
      });  

      nrow++
      count++
    }    
    totalRun++;
    switch(totalRun) {
      case 1: nrow = 14; break;
      case 2: nrow = 26; break;
      case 3: nrow = 38; break;
      case 4: nrow = 50; break;

      default:
        nrow = undefined;
    }
  }  

  return {
    currencies: [...currencies]
  };

}

module.exports.cbnRates = async (req, res) => {
  const result = await getResults();	
  res.status(200).json({
    status: true,
    result: result
  });
}