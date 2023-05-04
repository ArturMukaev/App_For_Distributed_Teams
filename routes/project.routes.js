const {Router} = require('express');
const {getProjectList, addProject, updatePositions, updateProject, getUsersOfProject, addUser, getClientInfo} = require('../controllers/project.controller');
const router = Router();
const auth = require('../middleware/auth.middleware');
const {check} = require("express-validator");

router.get('/:id', auth, getProjectList);

router.get('/users/:id', auth, getUsersOfProject);

router.get('/client/:id', auth, getClientInfo);

router.post('/add', auth, [
    check('name', "Введите название проекта!").notEmpty(),
], addProject);

router.post('/adduser', auth, addUser);

router.post('/update', auth, [
    check('name', "Введите название проекта!").notEmpty(),
], updateProject);

router.post('/positions', auth, updatePositions);

module.exports = router;