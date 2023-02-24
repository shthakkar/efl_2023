import React from 'react'
import { useState, useEffect } from 'react'
import CircularNumber from './CircularNumber';

export default function PlayerRestrictions(data) {
    const [batsmanCount, setBatsmanCount] = useState(0);
    const [bowlerCount, setBowlerCount] = useState(0);
    const [keeperCount, setKeeperCount] = useState(0);
    const [allRounderCount, setAllRounderCount] = useState(0);
    const [foreignerCount, setForeignerCount] = useState(0);
    
    useEffect(() => {
      setBatsmanCount(0);
      setBowlerCount(0);
      setAllRounderCount(0);
      setKeeperCount(0);
      setForeignerCount(0);
    data.data.forEach(function (item) {
      switch (item.role) {
        case 'Batter':
              setBatsmanCount(prev=>prev + 1);
              break;
        case 'Bowler':
              setBowlerCount(prev=>prev + 1);
              break;
        case 'Allrounder':
              setAllRounderCount(prev=>prev + 1);
              break;
        case 'WK-Batter':
              setKeeperCount(prev=>prev + 1);
              setBatsmanCount(prev=>prev + 1);
              break;
        default:
              break;
      }
      if(item.country !== "India")
      {
          setForeignerCount(prev=>prev+1);
          if(item.ownerTeam === "Gajjab Gujjus")
          {
            console.log(item)
          }
          
      }
    });
},[]);
    return (
    <div style={{display:"flex", marginRight: "500px"}}>
        <CircularNumber text="Batsmen:" progress = {batsmanCount} max = {4}/>
        <CircularNumber text="Bowler:" progress = {bowlerCount} max = {4}/>
        <CircularNumber text="WK:" progress = {keeperCount} max = {1}/>
        <CircularNumber text="Allrounder:" progress = {allRounderCount} max = {2}/>
        <CircularNumber text="Foreigner:" progress = {foreignerCount} max = {4}/>
    </div>
  )
}
