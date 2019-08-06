const express = require('express');
const router = express.Router();

const userController = require ('./../../controllers/user');
const validateToken = require('./../../helpers/validateToken');

router.get('/', userController.listUsers);

router.get('/user/:id', validateToken.verifyToken, userController.getUser);

router.post('/add', userController.createUser);

router.put('/user/:id', validateToken.verifyToken, userController.updateUser);

router.post('/createPassword', userController.createPassword);

router.get('/seed', userController.seedAdmin);

router.put('/password/:id', validateToken.verifyToken, userController.updatepassword);

router.delete('/user/:id', validateToken.verifyToken, userController.deleteUser);

router.post('/login', userController.login);

router.post('/password/:id', validateToken.verifyToken, userController.comparepassword);

router.get('/health', (req, res) => {
  res.send('OK');
});

module.exports = router;