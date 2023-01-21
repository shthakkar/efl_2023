import React from 'react'
import ProgressBar from './ProgressBar'
import PlayerRestrictions from './PlayerRestrictions'

export default function TeamRestrictions(data) {
   
  const arr = data.data
  
  
  
    
    return (
        <div>
    
    <ProgressBar label="Squad:" progress={arr.length} max={15} />
    <PlayerRestrictions data={data.data}/>
    
    </div>
    
  )
}
