const express = require('express');
const router = express.Router();
const Form = require('../schemas/Form');
const { checkLoggedIn } = require('../authorisation');

router.get('/', checkLoggedIn, async (req, res) => {
    return res.json(await Form.find());
});

router.get('/:formId', checkLoggedIn, async (req, res) => {
    return res.json(await Form.findOne({ formId: req.params.formId }));
});

module.exports = router;