const {Schema,model, Types} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: false},
    state: {type: Number, required: true},
    feature: {type: Types.ObjectId, ref: 'Feature'},
    responsible: {type: Types.ObjectId, ref: 'User'},
    time: {type: Number, default: 0 }
})

module.exports = model('Task',schema)