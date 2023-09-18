const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        primaryKey: true
    },
    name: {
        type: String,
        required: true,
        maxlength: 64,
        unique: true
    },
    created_at : {
        type : Date,
        default : Date.now
    },
    updated_at : {
        type : Date,
        default : Date.now
    }
})

const Role = mongoose.model("Role", roleSchema)

module.exports = Role