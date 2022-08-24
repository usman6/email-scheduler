const express = require('express');
const router = express.Router();

const UserService = require('./user.service');

const userService = new UserService();

router.get('/sent/emails', async (req, res, next) => {

    try {
        let result = await userService.findAllUsersSentEmails();
        return res.json(result);
    } catch (err) {
        next(err);
    }

});

router.get('/', async (req, res, next) => {

    try {
        let result = await userService.findAll({
            pageNo: req.query.pageNo,
            pageSize: req.query.pageSize
        });
        return res.json(result);
    } catch (err) {
        next(err);
    }

});

router.get('/:id', async (req, res, next) => {

    try {
        let result = await userService.findById(req.params.id);
        return res.json(result);
    } catch (err) {
        next(err);
    }

});

router.post('/', async (req, res, next) => {

        try {
            let result = await userService.create(req.body);
            return res.json(result);
        } catch (err) {
            next(err);
        }
    
    });

router.post('/query', async (req, res, next) => {

    try {
        let result = await userService.findAllByQuery(req.body);
        return res.json(result);
    } catch (err) {
        next(err);
    }

});

router.post('/query/all', async (req, res, next) => {

    try {
        let result = await userService.findAllByQueryNoLimit(req.body);
        return res.json(result);
    } catch (err) {
        next(err);
    }

});


router.put('/:id', async (req, res, next) => {

    try {
        let result = await userService.update(req.params.id, req.body);
        return res.json(result);
    } catch (err) {
        next(err);
    }

});

router.delete('/:id', async (req, res, next) => {

    try {
        let result = await userService.delete(req.params.id);
        return res.json(result);
    } catch (err) {
        next(err);
    }

});


module.exports = router;
