const RateModel = require('../../models/rate');
let convertedValue;
let sellingRate;

module.exports.converterUSD = async(usd) => {
    let ngn;
    
     const newRate =  await RateModel.find({}).sort({createdAt: -1});
        newRate.filter(rate => {
            if(rate.baseCurrency === 'USD'){
                sellingRate = rate.sellingRate;
                ngn = rate.sellingRate;
                if(usd > 0) convertedValue = ngn * usd;
            }
        })
        return {
            convertedValue,
            sellingRate
        };
        
    
}

module.exports.converterGBP = async(gbp) => {
    let ngn;
     const newRate =  await RateModel.find({}).sort({createdAt: -1});
        newRate.filter(rate => {
            if(rate.baseCurrency === 'GBP'){
                sellingRate = rate.sellingRate;
                ngn = rate.sellingRate;
                if(gbp > 0) convertedValue = ngn * gbp;
            }
        })
        return {
            convertedValue,
            sellingRate
        };
    
}

module.exports.converterEUR = async(eur) => {
    let ngn;
     const newRate =  await RateModel.find({}).sort({createdAt: -1});
        newRate.filter(rate => {
            if(rate.baseCurrency === 'EUR'){
                sellingRate = rate.sellingRate;
                ngn = rate.sellingRate;
                if(eur > 0) convertedValue = ngn * eur;
            }
        })
        return {
            convertedValue,
            sellingRate
        };
    
}

module.exports.converterYEN = async(yen) => {
    let ngn;
     const newRate =  await RateModel.find({}).sort({createdAt: -1});
        newRate.filter(rate => {
            if(rate.baseCurrency === 'YEN'){
                sellingRate = rate.sellingRate;
                ngn = rate.sellingRate;
                if(yen > 0) convertedValue = ngn * yen;
            }
        })
        return {
            convertedValue,
            sellingRate
        };
    
}
