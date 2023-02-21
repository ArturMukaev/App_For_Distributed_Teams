const {Router} = require('express');
const Team = require('../models/Team');
const router = Router();
const {check, validationResult} = require('express-validator');


router.post('/add', [
    check('name', "Введите имя команды!").notEmpty(),
],
    async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации команды'
            })
        }

        const {name, description} = req.body;

        const candidateTeam = await Team.findOne({name});
        if (candidateTeam) {
            return res.status(400).json({message: 'Такая команда уже есть!'})
        }


        const team = new Team({
            name, description
        })

        await team.save()

        res.status(201).json({...team,message: 'Команда создана!'})

    } catch (e) {
        res.status(500).json({message: 'Что то пошло не так!'})
    }
})

router.get('/', async (req, res) => {
    try {
        const teams = await Team.find({});
        res.json(teams);
    } catch (e) {
        res.status(500).json({message: 'Что то пошло не так!'})
    }
})


// router.get('/:id', async (req, res) => {
//     try {
//         var item = req.url.replace('/','')
//         const tasks = await Task.find( {whichDay: item})
//         res.json(tasks)
//     } catch (e) {
//         res.status(500).json({message: 'Что то пошло не так!'})
//     }
// })
//
// router.delete('/deleteMany',async (req,res) =>{
//     try {
//         const tasks = await Task.deleteMany( {whichDay: req.body.id})
//         res.json(tasks)
//     } catch (e) {
//         res.status(500).json({message: 'Что то пошло не так!'})
//     }
// })
//
// router.delete('/delete',async (req,res) =>{
//     try {
//         const task = await Task.findOneAndDelete( {_id: req.body.id})
//         res.json(task)
//     } catch (e) {
//         res.status(500).json({message: 'Что то пошло не так!'})
//     }
// })

module.exports = router