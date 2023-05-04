const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    user: {type: Types.ObjectId, ref: 'User'},
    project: {type: Types.ObjectId, ref: 'Project'},
    role: {type: String, required: true},
    position: {type: Number},
});

module.exports = model('UserInProject', schema);