const express = require('express');
const router = express.Router();

const usersRouter = require ('./users/index');
const advertsRouter = require ('./adverts/index');
const leftadvertsRouter = require ('./leftadverts/index');
const rightadvertsRouter = require ('./rightadverts/index');
const baseadvertsRouter = require ('./baseadverts/index');
const timeRouter = require ('./time/index');
const locationsRouter = require('./locations/index');
const newsRouter = require('./news/index');
const currencyRouter = require('./currency/index');
const rateRouter = require('./rate/index');
const operatorRouter = require('./bdcoperators/index');
const scrapeRouter = require('./scrapers/index');
const westernRouter = require('./westernrate/index');
const bankRouter = require('./bankrate/index');
const suscribeRouter = require('./suscribe/index');
const contactRouter = require('./contact/index');
const customrateRouter = require('./customconversions/index');


router.use('/users', usersRouter);
router.use('/adverts', advertsRouter);
router.use('/leftadverts', leftadvertsRouter);
router.use('/rightadverts', rightadvertsRouter);
router.use('/baseadverts', baseadvertsRouter);
router.use('/times', timeRouter);
router.use('/locations', locationsRouter);
router.use('/news', newsRouter);
router.use('/currency', currencyRouter);
router.use('/rates', rateRouter);
router.use('/operators', operatorRouter);
router.use('/cbn', scrapeRouter);
router.use('/western', westernRouter);
router.use('/bank', bankRouter);
router.use('/suscribe',suscribeRouter);
router.use('/contacts',contactRouter);
router.use('/bdcconverter', customrateRouter);

module.exports = router;