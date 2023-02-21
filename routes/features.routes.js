const {Router} = require('express');
const Feature = require('../models/Feature');
const router = Router();
const {check, validationResult} = require('express-validator');
const {ObjectId} = require('mongodb');

router.post('/add', [
        check('name', "Введите название!").notEmpty(),
        check('description', "Введите описание!").notEmpty(),
        check('state', "Заполните статус!").notEmpty(),
        check('priority', "Заполните приоритет!").notEmpty(),
        check('sprintNumber', "Введите номер спринта!").isNumeric().notEmpty(),
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при добавлении требования!'
                })
            }

            const { _id, team, name, description, state, priority, sprintNumber } = req.body;

            const candidate = _id.length !== 0;
            if (candidate) {
                await Feature.updateOne({_id : ObjectId(_id)},
                    { $set: {name, description, state, priority, sprintNumber}});
                return res.status(200).json({message: 'Изменения сохранены!'})
            }


            const feature = new Feature({
                name, team, description, state, priority, sprintNumber
            })

            await feature.save()

            res.status(201).json({feature: feature,message: 'Требование создано!'})

        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'})
        }
})

router.get('/', async (req, res) => {
    try {
        const features = await Feature.find({});
        res.json(features);
    } catch (e) {
        res.status(500).json({message: 'Что то пошло не так!'})
    }
})

module.exports = router