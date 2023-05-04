const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: false},
    epic: {type: Types.ObjectId, ref: 'Epic'},
    likelyHood: {type: Number, required: true},
    consequence: {type: Number, required: true},
    solution: {type: String},
    responsible: {type: Types.ObjectId, ref: 'User'},
});

module.exports = model('Risk', schema);