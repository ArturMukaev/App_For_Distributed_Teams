const {Router} = require('express');
const {check} = require('express-validator');
const {register, getUsers, login} = require('../controllers/auth.controller');
const router = Router();

router.post('/register',
    [
        check('email', "Некорректный email").isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({min: 6}),
        check('name', 'Введите имя').notEmpty(),
        check('surname', 'Введите фамилию').notEmpty(),
    ], register);

router.get('/', getUsers);

router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль!').exists()
    ], login);

module.exports = router;