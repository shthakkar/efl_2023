import React from 'react'
import { useState, useEffect } from 'react'
import ProgressBar from './ProgressBar';

export default function PlayerRestrictions(data) {
    const [batsmanCount, setBatsmanCount] = useState(0);
    const [bowlerCount, setBowlerCount] = useState(0);
    const [keeperCount, setKeeperCount] = useState(0);
    const [allRounderCount, setAllRounderCount] = useState(0);
    const [foreignerCount, setForeignerCount] = useState(0);
    
    useEffect(() => {
    data.data.forEach(function (item) {
      switch (item.role) {
        case 'Batter':
              setBatsmanCount(batsmanCount + 1);
              break;
        case 'Bowler':
              setBowlerCount(bowlerCount + 1);
              break;
        case 'AllRounder':
              setAllRounderCount(allRounderCount + 1);
              break;
        case 'WK-Batter':
              setKeeperCount(keeperCount + 1);
              setBatsmanCount(batsmanCount + 1);
              break;
        default:
              break;
      }
      if(item.country != "India")
      {
          setForeignerCount(foreignerCount+1);
      }
    });
},[]);
    return (
    <div>
        <ProgressBar label="Batsmen:" progress = {batsmanCount} max = {4}/>
        <ProgressBar label="Bowler:" progress = {bowlerCount} max = {4}/>
        <ProgressBar label="WK:" progress = {keeperCount} max = {1}/>
        <ProgressBar label="Allrounder:" progress = {allRounderCount} max = {2}/>
        <ProgressBar label="Foreigner:" progress = {foreignerCount} max = {4}/>
    </div>
  )
}
