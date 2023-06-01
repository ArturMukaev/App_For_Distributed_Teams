const {validationResult} = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


module.exports = {
    register: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                })
            }
            const {password, email} = req.body

            const candidate = await User.findOne({email});
            if (candidate) {
                return res.status(400).json({message: 'Пользователь с данным email уже есть!'})
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({...req.body, password: hashedPassword});

            await user.save();

            res.status(201).json({message: 'Пользователь создан'})
        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!  Обратитесь: artur.mukaev@mail.ru'})
        }
    },
    login: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе'
                })
            }
            const {email, password} = req.body;
            const user = await User.findOne({email});

            if (!user) {
                return res.status(400).json({message: 'Пользователь с данным email не найден!'});
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({message: 'Неверный пароль, попробуйте снова'});
            }

            const token = jwt.sign({userId: user.id}, 'arty', {expiresIn: '10h'});

            res.json({token, userId: user.id, name: `${user.name} ${user.surname}`});

        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!  Обратитесь: artur.mukaev@mail.ru'});
        }
    },
    getUsers: async (req, res) => {
        try {
            const users = await User.find({});
            res.json(users);
        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'})
        }
    },
};