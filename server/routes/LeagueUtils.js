//Imports 
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

//Constant and environment variables

const NA1_STRING = process.env.NA1_STRING
const AMERICAS_STRING = process.env.AMERICAS_STRING
const API_KEY = process.env.API_KEY




//Gets PUUID given summoner name
export async function getPUUIDBySummonerName(summonerName) {
    const API_CALL = `${NA1_STRING}/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`
    try {
        const { data } = await axios.get(API_CALL)
        return data.puuid
    } catch (err) {
        return null
    }
}

//Gets refined data from last (count) games of given summoner
export async function getDataBySummonerAndCount(summonerName, count) {

    const PUUID = await getPUUIDBySummonerName(summonerName)
    if (!PUUID) return null

    const gameIDs = await gameIDsByPUUIDAndCount(PUUID, count)
    if (!gameIDs) return null

    const gameDataArray = await gameIDsToGameData(gameIDs)
    if (!gameDataArray) return null

    const refinedGameDataArray = []

    for (let i = 0; i < gameDataArray.length; i++) {
        refinedGameDataArray.push(refineGameData(gameDataArray[i]))
    }
    return refinedGameDataArray
}





// *** Helper functions ***




//Refines game data into what we need from it
function refineGameData(unrefinedGameData) {


    const { gameDuration, gameMode, gameVersion, participants } = unrefinedGameData.info
    const refinedData = { 
        gameDuration: secondsToMinutes(gameDuration),
        gameMode,
        gameVersion,
        participants: participants.map(participant => {

            const { summonerName,
                    kills, 
                    deaths, 
                    assists, 
                    neutralMinionsKilled, 
                    totalMinionsKilled,
                    teamId,
                    totalDamageDealtToChampions } = participant

            const team = teamId === 100 ? 'Blue' : 'Red'

            return {
                team,
                summonerName,
                kills, 
                deaths, 
                assists, 
                cs: (neutralMinionsKilled + totalMinionsKilled),
                champDamage: totalDamageDealtToChampions
            }
        })
    }
    return refinedData
}


//Gets list of Game IDs given PUUID and count (if count is 5, returns last 5 game IDs for given PUUID)
async function gameIDsByPUUIDAndCount(PUUID, count) {
    const API_CALL = `${AMERICAS_STRING}/match/v5/matches/by-puuid/${PUUID}/ids?start=0&count=${count}&api_key=${API_KEY}`
    try {
        const { data } = await axios.get(API_CALL)
        return data
    } catch (err) {
        return null
    }
}

//Converts array of gameIDs to an array of gameDatas
async function gameIDsToGameData(gameIDs) {
    try {
        const gameDataArray = []
        for (let i = 0; i < gameIDs.length; i++) {
            const gameData = await getGameDataFromID(gameIDs[i])
            if (!gameData) {
                return null
            }
            gameDataArray.push(gameData)
        }
        return gameDataArray
    } catch (err) {
        return null
    }
}

//Returns game data for given game ID
async function getGameDataFromID(gameID) {
    const API_CALL = `${AMERICAS_STRING}/match/v5/matches/${gameID}?api_key=${API_KEY}`
    try {
        const { data } = await axios.get(API_CALL)
        console.log(data)
        return data
    } catch (err) {
        console.log('here')
        return null
    }
}

function secondsToMinutes(seconds) {
    const minutesString = enforceTwoDigits(Math.floor(seconds / 60))
    const secondsString = enforceTwoDigits(seconds % 60)
    
    return `${minutesString}:${secondsString}`
}

function enforceTwoDigits(num) {
    return num < 10 ? '0' + num : String(num)
}