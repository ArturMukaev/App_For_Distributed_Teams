const {Router} = require('express');
const router = Router();
const {check} = require('express-validator');
const auth = require("../middleware/auth.middleware");
const {updateFeature, getFeatures} = require("../controllers/feature.controller");

router.post('/add', auth, [
        check('name', "Введите название требования!").notEmpty(),
    ], updateFeature);

router.get('/:id', auth, getFeatures);

module.exports = router;