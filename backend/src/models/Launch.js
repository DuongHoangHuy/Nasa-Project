const mongoose = require('mongoose')

const launchSchema = mongoose.Schema({
    flightNumber:{
        type: Number,
        required: true
    },
    mission: {
        type: String,
        required: true
    },
    rocket: {
        type: String,
        required: true
    },
    launchDate: {
        type: Date,
        required: true
    },
    target: {
        type: String,
    },
    customers: {
        type: [String],
        required: true
    },
    upcoming: {
        type: Boolean,
        required: true,
        default: true
    },
    success:{
        type: Boolean,
        required: true,
        default: true
    },
})

const Launch = mongoose.model('Launch', launchSchema)

module.exports = Launch