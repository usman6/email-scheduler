const express = require('express');
const router = express.Router();

const EmailService = require('./email.service');

const emailService = new EmailService();

router.get('/', async (req, res, next) => {

    try {
        let result = await emailService.findAllEmails();
        return res.json(result);
    } catch (err) {
        next(err);
    }

});

module.exports = router;
