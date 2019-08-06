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

router.use('/users', usersRouter);
router.use('/adverts', advertsRouter);
router.use('/times', timeRouter);
router.use('/locations', locationsRouter);
router.use('/news', newsRouter);
router.use('/currency', currencyRouter);
router.use('/rates', rateRouter);
router.use('/operators', operatorRouter);

module.exports = router;