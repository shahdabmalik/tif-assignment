const { string } = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            primaryKey: true,
        },
        name: {
            type: String,
            required: true,
            maxlength: 64,
        },
        email: {
            type: String,
            maxlength: 128,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            maxlength: 64,
            required: true,
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
    },
);

// Explicitly set primary key to 'id'
userSchema.set('primaryKey', 'id');

// Create a model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
