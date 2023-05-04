const {validationResult} = require("express-validator");
const {ObjectId} = require("mongodb");
const Feature = require("../models/Feature");
const Task = require("../models/Task");

module.exports = {
    getTaskList: async (req, res) => {
        try {
            const {id} = req.params;
            const parsedId = id.split('_');

            const features = await Feature.find({project: parsedId[0], sprintNumber: Number(parsedId[1])});
            const featuresWithTasks = await Promise.all(features.map(async ({_id, name: fName, state: fState, type}) => {
                let tasks = await Task.find({feature: _id});
                tasks = tasks.map(({name, description, state, responsible, time, feature, _id}) => ({
                    name,
                    description,
                    state,
                    responsible,
                    time,
                    feature,
                    id: _id
                }));
                return {
                    id: _id,
                    type,
                    name: fName,
                    state: fState,
                    tasks,
                };
            }));
            res.status(200).json(featuresWithTasks);
        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'});
        }
    },
    updateTask: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при сохранении задачи!'
                })
            }

            const {id, name, description, state, feature, responsible, time} = req.body;

            const candidate = id.length !== 0;
            if (candidate) {
                await Task.updateOne({_id: ObjectId(id)},
                    {$set: {name, description, state, feature, responsible, time}});
                return res.status(200).json({message: 'Изменения сохранены!'});
            }

            const task = new Task({name, description, state, feature, responsible, time});

            await task.save();

            res.status(201).json({id: task.id, message: `Задача создана!`});
        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'})
        }
    },
};