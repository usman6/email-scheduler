const express = require('express');
const router = express.Router();

const UserEmailService = require('./user-email.service');

const userEmailService = new UserEmailService();



router.post('/', async (req, res, next) => {

        try {
            let result = await userEmailService.createAll(req.body);
            return res.json(result);
        } catch (err) {
            next(err);
        }
    
    });

module.exports = router;
