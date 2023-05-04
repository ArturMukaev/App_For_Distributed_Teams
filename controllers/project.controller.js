const Project = require("../models/Project");
const Epic = require("../models/Epic");
const Feature = require("../models/Feature");
const UserInProject = require("../models/UserInProject");
const User = require("../models/User");
const {validationResult} = require("express-validator");
const {ObjectId} = require("mongodb");


module.exports = {
    getProjectList: async (req, res) => {
        try {
            const {id} = req.params;

            // Ищем все проекты данного пользователя
            const projects = await UserInProject.find({user: id});
            // Формируем массив проектов данного пользователя
            const responseProjects = await Promise.all(projects.map(async (element) => {
                const {project, role, position} = element;
                const {id, name, description, imageSrc, leader, sprint} = await Project.findById(project);
                const {name: userName, surname} = await User.findById(leader);
                return {
                    id,
                    name,
                    description,
                    imageSrc,
                    position,
                    leader: `${userName} ${surname}`,
                    leaderId: leader,
                    role,
                    sprint
                };
            }));
            res.status(200).json(responseProjects);

        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'});
        }
    },
    addProject: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при добавлении проекта!'
                })
            }

            const {name, description, imageSrc, position, leader} = req.body;

            const project = new Project({
                name, description, imageSrc, leader
            });

            const userInProject = new UserInProject({
                user: leader,
                project: project.id,
                position,
                role: "Руководитель"
            });

            await project.save();
            await userInProject.save();

            res.status(201).json({id: project.id, message: 'Проект создан!'});
        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'})
        }
    },
    getUsersOfProject: async (req, res) => {
        try {
            const {id} = req.params;

            const users = await UserInProject.find({project: id});

            const responseUsers = await Promise.all(users.map(async (element) => {
                const {user, role} = element;
                const {id, name, surname, email} = await User.findById(user);
                return {
                    id,
                    name: `${name} ${surname}`,
                    role,
                    email,
                };
            }));
            res.status(200).json(responseUsers);

        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'});
        }
    },
    getClientInfo: async (req, res) => {
        try {
            const {id} = req.params;
            const epics = await Epic.find({project: id});
            const users = await UserInProject.find({project: id});
            const allFeatures = await Feature.find({project: id});
            const usersCount = users.filter((item) => item.role !== "Заказчик").length;
            const bugs = allFeatures.filter((bug) => bug.type === "Баг").map((row) => {
                const realMark = Math.floor((row.minMark + 4 * row.mark + row.maxMark) / 6);
                return {...row._doc, realMark};
            });
            const features = allFeatures.filter((feature) => feature.type === "Требование").map((row) => {
                const realMark = Math.floor((row.minMark + 4 * row.mark + row.maxMark) / 6);
                return {...row._doc, realMark};
            });

            // По проекту в общем:
            const epicsDone = epics.filter((epic) => epic.state === "Закрыто");
            const featuresDone = features.filter((feature) => feature.state === "Закрыто");
            const bugsDone = bugs.filter((bug) => bug.state === "Закрыто");
            const bugsMarks = bugs.reduce((acc, bug) => {
                if (bug.state === "Закрыто") {
                    acc.finished += bug.realMark;
                }
                acc.total += bug.realMark;
                return acc;
            }, {
                total: 0,
                finished: 0,
            });
            const featuresMarks = features.reduce((acc, feature) => {
                if (feature.state === "Закрыто") {
                    acc.finished += feature.realMark;
                }
                acc.total += feature.realMark;
                return acc;
            }, {
                total: 0,
                finished: 0,
            });
            const lastSprint = allFeatures.sort((a, b) => b.sprintNumber - a.sprintNumber)[0]?.sprintNumber;

            const projectInfo = {
                totalEpics: epics.length,
                finishedEpics: epicsDone.length,
                totalFeatures: features.length,
                finishedFeatures: featuresDone.length,
                totalBugs: bugs.length,
                finishedBugs: bugsDone.length,
                bugsMarks,
                featuresMarks,
                lastSprint,
                usersCount,
            }

            res.status(200).json(projectInfo);

        } catch (e) {
            console.log(e.message);
            res.status(500).json({message: 'Что то пошло не так!'});
        }
    },
    addUser: async (req, res) => {
        try {
            const {email, role, project } = req.body;

            const candidate = await User.findOne({email});
            if (!candidate) {
                return res.status(400).json({message: 'Пользователь с данным email не зарегистрирован!'})
            }

            if (role === "Руководитель") {
                await UserInProject.updateOne({project: project.id, user: project.leaderId}, {$set: {role: "Исполнитель"}});
                await Project.updateOne({_id: ObjectId(project.id)}, {$set: {leader: candidate._id}});
            }

            const isInProject = await UserInProject.findOne({project: project.id, user: candidate._id});
            if (isInProject) {
                await UserInProject.updateOne({project: project.id, user: candidate._id}, {$set: {role}});
                res.status(200).json({message: 'Данные об участнике обновлены'});
            } else {
                const userInProject = new UserInProject({
                    user: candidate._id,
                    project: project.id,
                    position: 0,
                    role,
                });
                await userInProject.save();
                res.status(200).json({id: candidate._id, name: `${candidate.name} ${candidate.surname}`, message: 'Пользователь добавлен в проект'});
            }
        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'});
        }
    },
    updatePositions: async (req, res) => {
        try {
            const {posArray, user} = req.body;
            await Promise.all(posArray.map(async (element, index) => {
                await UserInProject.updateOne({project: element, user}, {$set: {position: index}});
            }));
            res.status(200).json({message: 'Список проектов обновлен'});
        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'});
        }
    },
    updateProject: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при обновлении проекта!'
                })
            }

            const {id, name, description, imageSrc, leaderId, userId, sprint} = req.body;

            let role = "Руководитель";

            if (leaderId !== userId) {
                await UserInProject.updateOne({project: id, user: userId}, {$set: {role: "Исполнитель"}});
                await UserInProject.updateOne({project: id, user: leaderId}, {$set: {role: "Руководитель"}});
                role = "Исполнитель";
            }

            await Project.updateOne({_id: ObjectId(id)},
                {$set: {name, description, imageSrc, leader: leaderId, sprint}});
            return res.status(200).json({role, message: 'Изменения сохранены!'});

        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так!'});
        }
    },
};