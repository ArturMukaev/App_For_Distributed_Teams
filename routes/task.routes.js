const {Router} = require('express');
const router = Router();
const {check} = require('express-validator');
const auth = require("../middleware/auth.middleware");
const {getTaskList, updateTask} = require("../controllers/task.controller");


router.post('/add', auth, [
    check('name', "Введите название задачи!").notEmpty(),
], updateTask);

router.get('/:id', auth, getTaskList);

module.exports = router;