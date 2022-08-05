const mongoose = require('mongoose')

const gameSchema = mongoose.Schema({
    gameID: {
        type: String,
        required: true
    },
    total_kills: {
        type: Number,
        required: true
    },
    total_deaths: {
        type: Number,
        required: true
    },
    total_assists: {
        type: Number,
        required: true
    },
    cs: {
        type: Number,
        required: true
    },
    vision_score: {
        type: Number,
        required: true
    },
    gameLengthSeconds: {
        type: Number,
        required: true
    }

})

module.exports = mongoose.model('Game Data', gameSchema)