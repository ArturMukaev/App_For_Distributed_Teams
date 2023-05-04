const Epic = require("../models/Epic");
const {validationResult} = require("express-validator");
const {ObjectId} = require("mongodb");


module.exports = {
    getEpicList: async (req, res) => {
        try {
            const {id} = req.params;
            let epics = await Epic.find({project: id});
            epics = epics.map(({_id, name, description, state}) => ({
                id: _id, name, description, state
            }));
            res.status(200).json(epics);
        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'});
        }
    },
    addEpic: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при сохранении эпика!'
                })
            }

            const {id, name, description, state, project} = req.body;

            const candidate = id.length !== 0;
            if (candidate) {
                await Epic.updateOne({_id : ObjectId(id)},
                    { $set: {name, description, state}});
                return res.status(200).json({message: 'Изменения сохранены!'});
            }

            const epic = new Epic({
                name, description, state, project
            });

            await epic.save();

            res.status(201).json({id: epic.id, message: 'Эпик создан!'});
        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'})
        }
    },
};