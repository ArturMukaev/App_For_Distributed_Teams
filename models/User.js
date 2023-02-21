const {Schema,model, Types} = require('mongoose')

const schema = new Schema({
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    name:{type: String, required: true},
    surname:{type: String, required: true},
    fatherName:{type: String, required: true},
    team: {type: Types.ObjectId, ref: 'Team'},
    role: {type: Boolean, required: true}
})

module.exports = model('User',schema)