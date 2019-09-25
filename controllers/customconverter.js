const bdcconverter = require('../models/customconverter');
const converter = require('../helpers/shared/converter');
let payload;

module.exports.seedconversion = (req, res) => {
    const customconversions = [{
            baseCurrency: "USD",
            baseValue: 1,
            convertedValue: 361.50
        },
        { 
            baseCurrency: "GBP",
            baseValue: 1,
            convertedValue: 450.98
        },
        {
            baseCurrency: "EUR",
            baseValue: 1,
            convertedValue: 397.74
        },
        {
            baseCurrency: "YEN",
            baseValue: 1,
            convertedValue: 3.36
        },
        {
            baseCurrency: "NGN",
            baseValue: 1,
            convertedValue: 1.0
        },
    ]

    // use the Event model to insert/save
    bdcconverter.deleteOne({}, () => {
        for (conversion of customconversions) {
            console.log(conversion)
            let newConv = new bdcconverter(conversion);
            newConv.save();
        }
    });

    // seeded!
    res.send('Database seeded!');
}

module.exports.getcustomconversions = (req, res) => {
    bdcconverter.find({})
        .then(conversions => {
            res.send(conversions)
        }).catch(err => {
            throw err
        });
}

module.exports.getusdrate = async (req, res) => {
    const {amount} = req.body;
    if(typeof amount != 'number') res.status(403).send({error: 'Invalid Number'});
    payload = await converter.converterUSD(amount);
    console.lo
    res.send({
        message: 'Converted value', 
        amount: payload.convertedValue,
        sellingRate: payload.sellingRate
    })
}

module.exports.getgbprate = async (req, res) => {

    const {amount} = req.body;
    if(typeof amount != 'number') res.status(403).send({error: 'Invalid Number'});
    payload = await converter.converterGBP(amount);
    console.log(payload)
    res.send({
        message: 'Converted value', 
        amount:payload.convertedValue,
        sellingRate: payload.sellingRate
    })

}

module.exports.geteurrate = async (req, res) => {

    const {amount} = req.body;
    if(typeof amount != 'number') res.status(403).send({error: 'Invalid Number'});
    payload = await converter.converterEUR(amount);
        res.send({
        message: 'Converted value', 
        amount:payload.convertedValue,
        sellingRate: payload.sellingRate
    })
}

module.exports.getyenrate = async (req, res) => {

    const {amount} = req.body;
    if(typeof amount != 'number') res.status(403).send({error: 'Invalid Number'});
    payload = await converter.converterYEN(amount);
    res.send({
        message: 'Converted value', 
        amount:payload.convertedValue,
        sellingRate: payload.sellingRate
    })
}