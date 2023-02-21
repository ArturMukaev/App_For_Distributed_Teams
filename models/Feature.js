const {Schema,model, Types} = require('mongoose')

const schema = new Schema({
    team: {type: Types.ObjectId, ref: 'Team'},
    name: {type: String, required: true},
    description: {type: String, required: false},
    state: {type: Number, required: true},
    priority: {type: Number, required: true},
    sprintNumber: {type: Number, required: true},
    tasks: [{type: Types.ObjectId, ref: 'Task'}]
})

module.exports = model('Feature',schema)