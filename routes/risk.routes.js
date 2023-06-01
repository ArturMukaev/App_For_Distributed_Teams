const {Router} = require('express');
const {getRiskList, addRisk} = require('../controllers/risk.controller');
const router = Router();
const auth = require('../middleware/auth.middleware');
const {check} = require("express-validator");

router.get('/:id', auth, getRiskList);

router.post('/add', auth, [
    check('name', "Введите название риска!").notEmpty(),
], addRisk);

module.exports = router;