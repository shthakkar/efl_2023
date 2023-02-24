import React from 'react'
import ProgressBar from './ProgressBar'
import PlayerRestrictions from './PlayerRestrictions'
import settings from './settings.json'

export default function TeamRestrictions(data) {
   
  const arr = data.data
  
  
  
    
    return (
        <div>
    
    <ProgressBar label="Squad:" progress={arr.length} max={settings.squadSize} />
    <PlayerRestrictions data={data.data}/>
    
    </div>
    
  )
}
