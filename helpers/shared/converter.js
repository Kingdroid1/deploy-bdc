const RateModel = require('../../models/rate');


module.exports.converterUSD = async(usd) => {
    let ngn;
    let convertedValue;
     const newRate =  await RateModel.find({}).sort({createdAt: -1});
        newRate.filter(rate => {
            if(rate.baseCurrency === 'USD'){
                ngn = rate.sellingRate;
                if(usd > 0) convertedValue = ngn * usd;
            }
        })
        return convertedValue;
    
}

module.exports.converterGBP = async(gbp) => {
    let ngn;
    let convertedValue;
     const newRate =  await RateModel.find({}).sort({createdAt: -1});
        newRate.filter(rate => {
            if(rate.baseCurrency === 'GBP'){
                ngn = rate.sellingRate;
                if(gbp > 0) convertedValue = ngn * gbp;
            }
        })
        return convertedValue;
    
}

module.exports.converterEUR = async(eur) => {
    let ngn;
    let convertedValue;
     const newRate =  await RateModel.find({}).sort({createdAt: -1});
        newRate.filter(rate => {
            if(rate.baseCurrency === 'EUR'){
                ngn = rate.sellingRate;
                if(eur > 0) convertedValue = ngn * eur;
            }
        })
        return convertedValue;
    
}

module.exports.converterYEN = async(yen) => {
    let ngn;
    let convertedValue;
     const newRate =  await RateModel.find({}).sort({createdAt: -1});
        newRate.filter(rate => {
            if(rate.baseCurrency === 'YEN'){
                ngn = rate.sellingRate;
                if(yen > 0) convertedValue = ngn * yen;
            }
        })
        return convertedValue;
    
}
