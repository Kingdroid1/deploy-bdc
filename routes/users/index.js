const express = require('express');
const router = express.Router();

const userController = require ('./../../controllers/user');
const validateToken = require('./../../helpers/validateToken');

router.get('/', userController.listUsers);

router.get('/user/:id',userController.getUser);

router.post('/add', userController.createUser);

router.put('/:id', userController.updateUser);

router.post('/createPassword', userController.createPassword);

router.get('/seed', userController.seedAdmin);

router.put('/password/:id', userController.updatepassword);

router.delete('/:id',  userController.deleteUser);

router.post('/login', userController.login);

router.post('/comparepassword/:id', userController.comparepassword);

router.get('/health', (req, res) => {
  res.send('OK');
});

module.exports = router;