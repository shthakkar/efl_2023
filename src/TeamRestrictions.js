import React from 'react'
import ProgressBar from './ProgressBar'
import PlayerRestrictions from './PlayerRestrictions'
import settings from './settings.json'

export default function TeamRestrictions(prop) {
   
  const players = prop
 
    return (
        <div>
    
    <ProgressBar label="Squad:" progress={players.prop.length} max={settings.squadSize} />
    <PlayerRestrictions data={players.prop}/>
    
    </div>
    
  )
}

