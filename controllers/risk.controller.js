const Risk = require("../models/Risk");
const {validationResult} = require("express-validator");
const {ObjectId} = require("mongodb");


module.exports = {
    getRiskList: async (req, res) => {
        try {
            const {id} = req.params;
            let risks = await Risk.find({epic: id});
            risks = risks.map(({_id, name, description, likelyHood, consequence, solution, responsible}) => ({
                id: _id, name, description, likelyHood, consequence, solution, responsible
            }));
            res.status(200).json(risks);
        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'});
        }
    },
    addRisk: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при сохранении риска!'
                })
            }

            const {id, name, description, likelyHood, consequence, solution, responsible, epic} = req.body;

            const candidate = id.length !== 0;
            if (candidate) {
                await Risk.updateOne({_id: ObjectId(id)},
                    {$set: {name, description, likelyHood, consequence, solution, responsible}});
                return res.status(200).json({message: 'Изменения сохранены!'});
            }

            const risk = new Risk({
                name, description, likelyHood, consequence, solution, responsible, epic
            });

            await risk.save();

            res.status(201).json({id: risk.id, message: 'Риск добавлен!'});
        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'})
        }
    },
};