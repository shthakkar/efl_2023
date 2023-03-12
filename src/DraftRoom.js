import React, { useState, useEffect, useRef } from 'react';
import PlayerCard from './PlayerCard'
import "./style.css";
import settings from './settings.json'
import OwnerStats from './OwnerStats'

export default function DraftRoom({socket}) {
  const [message, setMessage] = useState(false);
  //const [timer, setTimer] = useState(20)
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


    socket.on("disconnect", handleDisconnect);
    socket.on("getplayer", handleNextPlayer);
    socket.on("getspecificplayer", handleNextPlayer);

    // Return a cleanup function that removes the event listeners
    return () => {
      socket.off("disconnect", handleDisconnect);
      socket.off("getplayer", handleNextPlayer);
    };
  }, [socket, nextPlayer]);

  const handleSubmit = () => {
    setNextPlayer([]);
    socket.emit("getplayer");
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
        <div>
        <button className="mainButton" onClick={handleSubmit}>Get Player</button>
        </div>
    </div>
    
  );
}
