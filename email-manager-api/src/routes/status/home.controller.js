const express = require('express');
const router = express.Router();

const moment = require('moment');

router.get('/', async (req, res, next) => {

    try {
        return res.json({
            version: '1.0',
            service: 'email-manager',
            description: 'Email Manager',
            timestamp: moment()
        });
    } catch (err) {
        next(err);
    }

});

module.exports = router;
