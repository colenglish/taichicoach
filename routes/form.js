const express = require('express');
const router = express.Router();
const Form = require('../schemas/Form');

router.get('/', async (req, res) => {
    return res.json(await Form.find());
});

router.get('/:formId', async (req, res) => {
    return res.json(await Form.findOne({ formId: req.params.formId }));
});

module.exports = router;