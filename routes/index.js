const express = require('express');
const router = express.Router();

const usersRouter = require ('./users/index');
const advertsRouter = require ('./adverts/index');
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

router.use('/users', usersRouter);
router.use('/adverts', advertsRouter);
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

module.exports = router;