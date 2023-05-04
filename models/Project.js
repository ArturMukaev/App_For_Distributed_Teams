const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String, default: ''},
    imageSrc: {type: String},
    leader: {type: Types.ObjectId, ref: 'User'},
    sprint: {type: Number, default: 1}
});

module.exports = model('Project', schema);