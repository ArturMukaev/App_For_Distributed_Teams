const {Schema,model, Types} = require('mongoose');

const schema = new Schema({
    epic: {type: Types.ObjectId, ref: 'Epic'},
    name: {type: String, required: true},
    description: {type: String, required: false},
    type: {type: String, required: false},
    state: {type: String, required: true},
    priority: {type: String, required: true},
    sprintNumber: {type: Number},
    minMark: {type: Number},
    mark: {type: Number},
    maxMark: {type: Number},
    tasks: [{type: Types.ObjectId, ref: 'Task'}],
    project: {type: Types.ObjectId, ref: 'Project'}
});

module.exports = model('Feature',schema);