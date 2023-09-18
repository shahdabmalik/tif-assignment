const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)

const communitySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        primaryKey: true
    },
    name: {
        type: String,
        required: true,
        maxlength: 128
    },
    slug: {
        type: String,
        slug: "name",
        unique: true,
        slugPaddingSize: 2,
        maxlength: 255
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})


const Community = mongoose.model("community", communitySchema)

module.exports = Community