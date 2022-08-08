import axios from 'axios'
import { useState, useEffect } from 'react'

const App = () => {

  const [PUUID, setPUUID] = useState()

  useEffect(() => {
    async function getPUUID() {
      const result = await axios.get('/last-n-matches/by-summoner/10/peepoDoorSlam')
      console.log(result)
      setPUUID(result)
    }
    getPUUID()
    
  },[])

  return (
    <div className='App'>
      {PUUID?.data.map(gameData => {
        return <div style={{marginTop: '20px'}}>{JSON.stringify(gameData)}</div>
      })}
    </div>
  )
}

export default App