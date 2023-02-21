const {Router} = require('express');
const Task = require('../models/Task');
const router = Router();
const {check, validationResult} = require('express-validator');
const {ObjectId} = require('mongodb');


router.post('/add', [
        check('name', "Введите название!").notEmpty(),
        check('description', "Введите описание!").notEmpty(),
        check('state', "Заполните статус!").notEmpty(),
        check('feature', "Выберите требование!").notEmpty(),
        check('responsible', "Выберите ответственного!").notEmpty(),
        check('time', "Введите списанное время!").isNumeric().notEmpty(),
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при добавлении задачи!'
                })
            }

            const { _id, name, description, state, feature, responsible, time } = req.body;

            const candidate = _id.length !== 0;
            if (candidate) {
                await Task.updateOne({_id : ObjectId(_id)},
                    { $set: {name, description, state, feature, responsible, time}});
                return res.status(200).json({message: 'Изменения сохранены!'})
            }


            const task = new Task({
                name, description, state, feature, responsible, time
            })

            await task.save()

            res.status(201).json({task: task,message: 'Задача создана!'})

        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'})
        }
    })

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.json(tasks);
    } catch (e) {
        res.status(500).json({message: 'Что то пошло не так!'})
    }
})

module.exports = router