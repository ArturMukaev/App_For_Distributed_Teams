const {Schema,model, Types} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String },
    members: [{type: Types.ObjectId, ref: 'User'}]
})

module.exports = model('Team',schema)