const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: false},
    state: {type: String, required: true},
    features: [{type: Types.ObjectId, ref: 'Feature'}],
    risks: [{type: Types.ObjectId, ref: 'Risk'}],
    project: {type: Types.ObjectId, ref: 'Project'}
});

module.exports = model('Epic', schema);