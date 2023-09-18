const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        primaryKey: true
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Community"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const Member = mongoose.model("member", memberSchema)

module.exports = Member