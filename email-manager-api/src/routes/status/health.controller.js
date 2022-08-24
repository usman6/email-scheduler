const express = require('express');
const router = express.Router();

const { HttpMessage } = require('../../core');

router.get('/health', async (req, res, next) => {

    try {
        return res.json(HttpMessage.ok());
    } catch (err) {
        next(err);
    }

});

module.exports = router;
