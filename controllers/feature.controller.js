const {validationResult} = require("express-validator");
const {ObjectId} = require("mongodb");
const Feature = require("../models/Feature");
const Epic = require("../models/Epic");
const Task = require("../models/Task");


module.exports = {
    getFeatures: async (req, res) => {
        try {
            const {id} = req.params;
            let features = await Feature.find({project: id});
            features = await Promise.all(features.map( async (feature) => {
                const {name} = await Epic.findById(feature.epic);
                const allTasks = await Task.find({feature: feature._id});
                const finishedTasksNumber = allTasks.filter((task) => task.state === "Закрыто").length;
                return {
                    id: feature._id,
                    name: feature.name,
                    description: feature.description,
                    state: feature.state,
                    priority: feature.priority,
                    sprintNumber: feature.sprintNumber,
                    type: feature.type,
                    mark: feature.mark,
                    minMark: feature.minMark,
                    maxMark: feature.maxMark,
                    epicId: feature.epic,
                    epicName: name,
                    tasksNumber: allTasks.length,
                    finishedTasksNumber,
                };
            }));
            res.status(200).json(features);
        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'});
        }
    },
    updateFeature: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при сохранении требования!'
                })
            }

            const {id, name, description, state, project, epicId, priority, sprintNumber, mark, minMark, maxMark, type} = req.body;

            const candidate = id.length !== 0;
            if (candidate) {
                await Feature.updateOne({_id : ObjectId(id)},
                    { $set: {name, description, state, epic: epicId, priority, sprintNumber, mark, minMark, maxMark}});
                return res.status(200).json({message: 'Изменения сохранены!'});
            }

            const feature = new Feature({
                name, description, state, project, epic: epicId, priority, sprintNumber, mark, type, minMark, maxMark
            });

            await feature.save();

            res.status(201).json({id: feature.id, message: `${type} создан!`});
        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'})
        }
    },
};