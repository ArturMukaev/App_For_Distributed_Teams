const {Router} = require('express')
const bcrypt = require('bcryptjs')// хэширование паролей
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const Team = require('../models/Team')
const router = Router()

router.post(
    '/register',
    [
        check('email', "Некорректный email").isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({min: 6}),
        check('name', 'Введите имя').notEmpty(),
        check('surname', 'Введите фамилию').notEmpty(),
        check('fatherName', 'Введите отчество').notEmpty(),
        check('team', 'Выберите команду').notEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                })
            }
            const { password, email, team } = req.body

            const candidate = await User.findOne({email});
            const teamSelected = await Team.findOne({ name: team});
            if (candidate) {
                return res.status(400).json({message: 'Такой пользователь уже есть!'})
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({...req.body, password: hashedPassword, team: teamSelected._id})

            await user.save()

            res.status(201).json({message: 'Пользователь создан'})
        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'})
        }
    })

router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (e) {
        res.status(500).json({message: 'Что то пошло не так!'})
    }
})


router.post(
    '/login',
    [
        check('email','Введите корректный email').normalizeEmail().isEmail(),
        check('password','Введите пароль!').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе'
                })
            }
            const {email,password} = req.body
            const user = await User.findOne({email})

            if(!user){
                return res.status(400).json({message: 'Пользователь не найден!'})
            }
            const isMatch = await  bcrypt.compare(password,user.password)
            if(!isMatch){
                return res.status(400).json({message: 'Неверный пароль, попробуйте снова'})
            }

            const token = jwt.sign({ userId: user.id },config.get('jwtSecret'),{expiresIn: '10h'})

            res.json({token,userId: user.id, team: user.team, role: user.role})

        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'})
        }
    })

module.exports = router