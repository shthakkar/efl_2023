import React, { useState, useEffect, useRef } from 'react';
import PlayerCard from './PlayerCard'
import "./style.css";
import settings from './settings.json'
import OwnerStats from './OwnerStats'

export default function DraftRoom({socket}) {
  const [message, setMessage] = useState(false);
  //const [timer, setTimer] = useState(20)
  const [remainingTime, setRemainingTime] = useState(20);
  const [intervalId, setIntervalId] = useState(null);
  const [isflag, setFlag] = useState(false) 
  const sample = {
    "_id":{"$oid":"63b90a44f4902c26b5359388"},
    "name": "Player Name",
    "salary": "50.0 L",
    "status": "unsold",
    "tier": 4,
    "role": "Type",
    "intro": [
      "intro1",
      " intro2",
      " intro3"
    ],
    "country": "Country Name",
    "iplTeam": "Franchise",
    "ownerTeam": "",
    "boughtFor": 0,
    "salaryNumber": 50,
    "eflBase": 20,
    "rank": 172
  }
  const [nextPlayer, setNextPlayer] = useState([sample]);

  const handleRestartTimer = () => {
    socket.emit('restart_timer');
   };

  useEffect(() => {
    // Check if the socket is already connected before adding event listeners
    if (socket.connected) {
      console.log("Connected to socket server.");
    } else {
      console.log("Connecting to socket server...");
      socket.connect();
    }

    const handleDisconnect = () => {
      console.log("Disconnected from socket server.");
    };

    const handleNextPlayer = (data) => {
      setNextPlayer([data]);
      actionstobedoneAfterGetPlayer(data);
    };


    const handleGetTime = () => {
      socket.emit('get_time');
    };
  
    handleRestartTimer()

    socket.on("disconnect", handleDisconnect);
    socket.on("getplayer", handleNextPlayer);
    socket.on("getspecificplayer", handleNextPlayer);

    socket.on('timer_started', () => {
      setIntervalId(setInterval(handleGetTime, 1000));
    });
  
    socket.on('timer_update', (remainingTime) => {
      setRemainingTime(Math.max(remainingTime, 0));
    });

    socket.on('timer_stopped', () => {
      clearInterval(intervalId);
    });
  

    // Return a cleanup function that removes the event listeners
    return () => {
      socket.off("disconnect", handleDisconnect);
      socket.off("getplayer", handleNextPlayer);
    };
  }, [socket, nextPlayer]);

  const handlebid = () => {
   
    handleRestartTimer()

    socket.on('timer_restarted', () => {
      clearInterval(intervalId);
      setRemainingTime(20);
      setIntervalId(setInterval(socket.emit('get_time'), 1000));
    });

  };

 const [ownerToMaxBid, setOwnerToMaxBid] = useState({})
 const [ownersData, setOwnersData] = useState()
 const [amount, setAmount] = useState(20);
 const [bidder, setBidder] = useState('');
 const [disableMap, setDisableMap] = useState({})
 async function getOwnersData(prop)
  {
    try {
      const response = await fetch('https://testefl2023.azurewebsites.net/getallownersdata');
      if(response.ok){
        const json = await response.json();
        setOwnersData(json)
        const data = json.reduce((acc, curr) => {
          acc[curr.ownerName] = {maxBid:curr.maxBid,currentPurse: curr.currentPurse};
          return acc;
      }, {});
      const disableMapTemp = json.reduce((map, curr) => {
        //console.log('CURR',curr);
        // if squad is full or foreigner count is 6 or current amount is greater than maxBid for owner
        // set disable to true
        if(curr.totalCount===settings.squadSize||(curr.fCount===6 && prop !== 'India')||curr.maxBid<amount)
        {
          map[curr.ownerName]=true;
        }
        return map;
    }, {});
    console.log(disableMapTemp);
    setDisableMap(disableMapTemp);
        console.log(data)
        setOwnerToMaxBid(data)
     } else {
       console.log('Error: ' + response.status + response.body);
     }
    } catch (error) {
      console.error(error);
    }
  }

  function actionstobedoneAfterGetPlayer(json) {
    setAmount(json.eflBase);
    getOwnersData(json.country);
    setFlag(true)
  }


  return (
    <div className="App">
      <div className="top-row">
      <div className="owner-table-item">
          <div style={{display: "flex", flexDirection:"column",position:"relative",marginTop:"15px"}}>
          {ownersData && <OwnerStats data={ownersData}/> }
          </div>
      </div>
        <div className="top-row-item" style={{position:"relative",marginTop:"15px"}}>
                {nextPlayer[0]&&<PlayerCard playerName={nextPlayer[0].name}
            country={nextPlayer[0].country} 
            intro1={nextPlayer[0].intro[0]}
            intro2={nextPlayer[0].intro[1]}
            intro3={nextPlayer[0].intro[2]}
            type={nextPlayer[0].role} 
            franchise={nextPlayer[0].iplTeam}/>}
            </div>
            <div className="top-row-item">
          <div>
         <p style={{marginTop:"15px",marginRight:"20px"}} className='shiny-text'> Current Bidder: {bidder}</p>
        <p className="shiny-text" >BID: {amount} lacs</p>
         <p className='shiny-text'>Current Purse: {ownerToMaxBid[bidder]?.currentPurse} lacs</p>
         <p className='shiny-text'>Max Bid: {ownerToMaxBid[bidder]?.maxBid} lacs</p>
         </div>
        </div>
      </div>
      <div style={{display: "flex",position:"relative",bottom:"-30px",left:"95px",color: remainingTime.toFixed(0) <= 5 ? 'red':'black' }}>
        {isflag &&(
          <div className="time-text show">Time Remaining: {remainingTime.toFixed(0)}</div>) }
      </div>
        <div>
        <button className="mainButton" onClick={handlebid}>Bid</button>
        </div>
    </div>
    
  );
}
