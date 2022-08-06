// *** Imports and express router setup ***
require('dotenv').config()
const axios = require('axios')
const express = require('express')
const router = express.Router()



// *** Constants and env variables ***
const API_KEY = process.env.API_KEY
const MY_SUMMONER_NAME = process.env.SUMMONER_NAME
const AMERICAS_STRING = process.env.AMERICAS_STRING
const NA1_STRING = process.env.NA1_STRING






// *** Routes ***






//Gets my PUUID
router.get('/my/PUUID', async (req, res) => {
    try {
        const PUUID = await getPUUID(MY_SUMMONER_NAME)
        res.status(200).json(PUUID)
    } catch ({ message }) {
        res.status(404).json({ message })
    }
    
})

//Gets PUUID from Summoner name
router.get('/summoner/by-name/:summonerName', async (req, res) => {
    const { summonerName } = req.params
    try {
        const PUUID = await getPUUID(summonerName)
        res.status(200).json(PUUID)
    } catch ({ message }) {
        res.status(400).json({ message })
    }
    
})

//Gets Summoner Name from PUUID
router.get('/summoner/by-puuid/:puuid', async (req, res) => {
    const { puuid } = req.params 
    try {
        const summonerName = await getSummonerName(puuid)
        res.status(200).json(summonerName)
    } catch ({ message }) {
        res.status(404).json({ message })
    }
    
})

//Gets latest game by summoner PUUID
router.get('/games/latestGame/by-puuid/:puuid', async (req, res) => {
    const { puuid } = req.params
    try {
        const gameData = await latestGameFromPUUID(puuid)
        console.log(gameData)
        res.status(200).json(gameData)
    } catch ({ message }) {
        res.status(404).json({message})
    }
    
})

//Gets game data from most recent game 
router.get('/games/latestGame', async (req, res) => {
    try {
        const PUUID = await getPUUID(SUMMONER_NAME)
        const gameID = await getLastGameID(PUUID)
        const gameData = await getGameDataFromID(gameID)
        res.status(200).json(gameData)
    } catch ({ message }) {
        res.status(404).json({ message })
    }
})







// *** Helper functions (axios calls to riot api) ***






//Gets PUUID from given Summoner Name
async function getPUUID(summonerName) {
    const API_CALL = `${NA1_STRING}/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`
    try {
        const { data } = await axios.get(API_CALL)
        return data.puuid
    } catch (err) {
    }
    
}

//Gets list of PUUID from given GameData
async function getPUUIDS(gameData) {
    
}

//Gets Summoner Name from PUUID
async function getSummonerName(PUUID) {
    const API_CALL = `${NA1_STRING}/lol/summoner/v4/summoners/by-puuid/${PUUID}?api_key=${API_KEY}`
    try {
        const { data } = await axios.get(API_CALL)
        return data.name
    } catch (err) {

    }
}

//Gets latest game ID from given PUUID
async function getLastGameID(PUUID) {
    const API_CALL = `${AMERICAS_STRING}/lol/match/v5/matches/by-puuid/${PUUID}/ids?api_key=${API_KEY}`
    try {
        const { data: [first] } = await axios.get(API_CALL)
        return first
    } catch (err) {

    }
}

//Returns game data for given game ID
async function getGameDataFromID(gameID) {
    const API_CALL = `${AMERICAS_STRING}/lol/match/v5/matches/${gameID}?api_key=${API_KEY}`
    try {
        const { data } = await axios.get(API_CALL)
        return data
    } catch (err) {

    }
}

//Returns latest game data for given PUUID
async function latestGameFromPUUID(PUUID) {
    try {
        const gameID = await getLastGameID(PUUID)
        return await getGameDataFromID(gameID)
    } catch (err) {

    }
    
}



module.exports = router