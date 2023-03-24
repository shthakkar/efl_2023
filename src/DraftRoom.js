import React, { useState, useEffect, useRef } from 'react';
import PlayerCard from './PlayerCard'
import "./style.css";
import settings from './settings.json'
import OwnerStats from './OwnerStats'

export default function DraftRoom({socket}) {
  
  const [playerstatus, setPlayerStatus] = useState('')
  const [remainingTime, setRemainingTime] = useState(20);
  const [intervalId, setIntervalId] = useState(null);
  const [isflag, setFlag] = useState(false) 
  const [ackMsg, setAckMsg] = useState(null);
  const [events,setEvents] = useState([]);
  const [amount, setAmount] = useState(20);
  const [nextBid,setNextBid] = useState(0)
  const [firstClick,setFirstClick] = useState(false)

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: '10px',
      backgroundColor: '#f5f5f5',
      border: '1px solid #ddd',
      borderRadius: '5px',
    },
    infoContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    label: {
      fontWeight: 'bold',
      marginRight: '5px',
    },
    value: {
      fontSize: '16px',
    },
  };
  const [isdisplay, setDisplay] = useState(false)
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

   const handleGetTime = () => {
    socket.emit('get_time');
  };
  useEffect(() => {
    const handleAckActivityEvent = (data) => {
      setAckMsg(data);
      console.log(events);
      console.log(data.eventType);
      if (data.eventType === "join") {
        setEvents((prevEvents) => [data.ownerName + " from " + data.teamName + " joined at " + data.time,  ...prevEvents ]);
      }else{
        setEvents((prevEvents) => [data.ownerName + " from " + data.teamName + " palced bid of " + data.bidAmount + " at "+data.time,        ...prevEvents]);
      }
      console.log(events.length);
    };
  
    socket.on("ackActivityEvent", handleAckActivityEvent);
  
    // Clean up the event listener when the component unmounts or when the effect runs again
    return () => {
      socket.off("ackActivityEvent", handleAckActivityEvent);
    };
  }, [events, ackMsg]);
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
      setFirstClick(true)// when new player comes, the first bid should be base bid
      actionstobedoneAfterGetPlayer(data);
    };

    handleGetTime()
  
    handleRestartTimer()

    const handlemessage =(data) => {
      setDisplay(true)
      setPlayerStatus(data)
      setFlag(false)
      //console.log(data)
    }

    
    socket.on('message', handlemessage)

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
      setDisplay(false)
      //clearInterval(intervalId);

    };
  }, [socket, nextPlayer, events]);

const sendBid = () =>{
  const activity_message = {
    "eventType": "bid",
    "teamName": localStorage.getItem('teamname'),
    "ownerName": localStorage.getItem('playername'),
    "bidAmount": 500
}
socket.emit('sendActivityEvent',activity_message)


}

  const handlebid = () => {
   
    handleRestartTimer()
    sendBid()

    socket.on('timer_restarted', () => {
      clearInterval(intervalId);
      setRemainingTime(20);
      setIntervalId(setInterval(handleGetTime, 1000));
    });

  };
  useEffect(() => {
    setNextBid(getNextBid());
  },  [amount, nextPlayer]);
  
 const [ownerToMaxBid, setOwnerToMaxBid] = useState({})
 const [ownersData, setOwnersData] = useState()
 
 const [bidder, setBidder] = useState('');
 const [disableMap, setDisableMap] = useState({})
 
 async function getOwnersData(prop)
  {
    try {
      const response = await fetch('http//localhost:5001/getallownersdata');
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
const getNextBid = () =>
  {
    if(firstClick)
    {
      setFirstClick(false)
      setNextBid(amount)
      return amount
    }
    let increment = 5;
    if (amount >= 200)
    {
      increment = 20;
    }else if (amount >= 100){
      increment = 10;
    }
    const bid  = amount+increment
    setNextBid(bid)
    console.log(amount,increment,nextBid)
    return bid
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
            <div
      style={{
        backgroundColor: '#f5f5f5',
        padding: '10px',
        borderRadius: '5px',
        maxHeight: '200px', // set the maximum height
        overflowY: 'scroll', // enable vertical scroll
      }}
    >
      {events.map((event, index) => (
        <div key={index} style={{ marginBottom: '5px' }}>
          {event}
        </div>
      ))}
    </div>
    </div>
      </div>
      <div>
        {isdisplay && <div className="sold-text show" style={{color: playerstatus === 'SOLD' ? 'red':'grey' }}>{playerstatus}</div>}
      </div>
      <div>
        {isdisplay && <div className="sold-text show" style={{color: playerstatus === 'SOLD' ? 'red':'grey' }}>{playerstatus}</div>}
      </div>
      <div style={{display: "flex",position:"relative",bottom:"-30px",left:"95px", color: remainingTime.toFixed(0) <= 5 ? 'red':'black' }}>
        {isflag &&(
          <div className="time-text show">Time Remaining: {remainingTime.toFixed(0)}</div>) }
      </div>
      <div className="compact-ui" style={{marginTop:"100px"}}>
      <div className="info">
        <span className="label">Bid By: Gajjab Gujjus</span>
        <span className="value">{bidder}</span>
      </div>
      <div className="info">
        <span className="label">Current Bid:</span>
        <span className="value">{amount} lacs</span>
      </div>
      <div className="info">
        <span className="label">Max Bid Allowed: 5964</span>
        <span className="value">{ownerToMaxBid[bidder]?.maxBid}</span>
      </div>
      <div className="info">
        <span className="label">Current Purse: 6000</span>
        <span className="value">{ownerToMaxBid[bidder]?.currentPurse}</span>
      </div>
    </div>
    
        <div style={{display: "flex", marginTop: "100px",justifyContent:"center"}}>
        
        <div className="info">
        <span className="label">Place Next Bid For:</span>
        <span className="value">{nextBid} lacs</span>
      </div>
      <button className="mainButton" onClick={handlebid}>Place Next Bid</button>
      

        </div>
        
    </div>
    
    
  );
}
