const abcon = require('../models/abconnews');

module.exports.saveNews = (req, res) => {
    let news = new abcon(
        req.body
    );

    news.save()
        .then(newsdoc => {
            res.status(200).json({status: true,
                message: 'Abcon news saved succesfully', newsdoc})
        }).catch(err => res.send('Could not save news item, please retry.', err));
}

module.exports.getAllNews = (req, res) => {
    abcon.find({})
         .then(news => res.status(200).send({news})
         ).catch(err => res.send(err));
}

module.exports.getNewsById = (req, res) => {
    const {id} = req.params._id;
    abcon.findById({id})
         .then(doc => res.status(200).send({doc})
         ).catch(err => res.send('Could not get this particular news data', err));
}

module.exports.deleteNews = (req, res) => {
    const {id} = req.params._id;
    abcon.findByIdAndRemove({id})
         .then(doc => res.status(200).json({
             status: true,
             message: 'News deleted successfully', doc})
         ).catch(err => res.send('Could not delete news', err));
}