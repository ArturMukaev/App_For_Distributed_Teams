const {Router} = require('express');
const {getEpicList, addEpic} = require('../controllers/epic.controller');
const router = Router();
const auth = require('../middleware/auth.middleware');
const {check} = require("express-validator");

router.get('/:id', auth, getEpicList);

router.post('/add', auth, [
    check('name', "Введите название эпика!").notEmpty(),
], addEpic);
//
// router.post('/positions', auth, updatePositions);

module.exports = router;