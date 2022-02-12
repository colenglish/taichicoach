const express = require('express');
const router = express.Router();
const Form = require('../schemas/Form');
const Movement = require('../schemas/Movement');
const Video = require('../schemas/Video');
const Practitioner = require('../schemas/Practitioner');
const { checkLoggedIn } = require('../authorisation');

router.get('/', checkLoggedIn, async (req, res) => {
    return res.json(await deepPopulateForm(Form.find()));
});

router.get('/:formId', checkLoggedIn, async (req, res) => {
    return res.json(await deepPopulateForm(Form.findOne({ formId: req.params.formId })));
});

var deepPopulateForm = findCall => {
    return findCall.populate({
        path: 'movements',
        populate: {
            path: 'videos',
            populate: {
                path: 'practitioner'
            }
        }
    }).populate({
        path: 'videos',
        populate: {
            path: 'practitioner'
        }
    })
};

module.exports = router;