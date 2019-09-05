const express = require('express');
const router = express.Router();

const contactController = require ('../../controllers/contacts');

router.get('/', contactController.listContacts);

router.get('/:id',contactController.getConstantById);

router.post('/', contactController.createContact);

router.put('/:id', contactController.updateConatct);

router.get('/seed', contactController.seedContact);

router.delete('/:id',  contactController.deleteContact);

router.get('/health', (req, res) => {
  res.send('OK');
});

module.exports = router;