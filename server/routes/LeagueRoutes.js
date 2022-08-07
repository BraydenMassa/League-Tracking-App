//Imports
import express, { application } from 'express'
import { getPUUIDBySummonerName, getDataBySummonerAndCount } from './LeagueUtils.js'

//Initialize router
const router = express.Router()


//Routes


router.get('/get-puuid/by-summoner-name/:summonerName', async (req, res) => {
    const { summonerName } = req.params
    const PUUID = await getPUUIDBySummonerName(summonerName)

    if (!PUUID) return res.status(404).json({ message: 'Could not get puuid from summoner' })
    
    res.status(200).json(PUUID)
})

router.get('/last-n-matches/by-summoner/:count/:summonerName', async (req, res) => {
    const { count, summonerName } = req.params

    const gameData = await getDataBySummonerAndCount(summonerName, count)
    if (!gameData) return res.status(404).json({ message: 'Unable to get gamedata from summoner and count' })

    res.status(200).json(gameData)
})


export default router