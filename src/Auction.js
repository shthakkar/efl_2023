import React, { useState, useEffect, useRef } from 'react';
import PlayerCard from './PlayerCard'
import OwnerStats from './OwnerStats'
import './style.css'; 
import settings from './settings.json'

export default function 
Auction({socket}) {
  const [timer, setTimer] = useState(20)
  const timerId = useRef()

  /*
  useEffect(() => {
    timerId.current = setInterval(() => {
            setTimer(timer => timer - 1)
        },1000)
        return () => clearInterval(timerId.current)
    }, [timer])

    useEffect(() =>{
        if (timer <= 0) {
            clearInterval(timerId.current)
        }
    }, [timer])*/

    
  const [remainingTime, setRemainingTime] = useState(20);
  const [intervalId, setIntervalId] = useState(null);


  const handleStartTimer = () => {
    socket.emit('start_timer');
  };
  const handleRestartTimer = () => {
    socket.emit('restart_timer');
  };

  const handleStopTimer = () => {
    socket.emit('stop_timer');
    clearInterval(intervalId);
  };

  const handleGetTime = () => {
    socket.emit('get_time');
  };


  const [selectedButton, setSelectedButton] = useState(null);
  const [bidder, setBidder] = useState('');
  const [amount, setAmount] = useState(20);
  
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
  const [getRandom, setData] = useState(sample);
  const [isflag, setFlag] = useState(false) 
  const [ownerToMaxBid, setOwnerToMaxBid] = useState({})
  const [ownersData, setOwnersData] = useState()
  const [isSold, setIsSold] = useState(false);
  const [isunSold, setIsunSold] = useState(false);
  const [buttonSold, setButtonSold] = useState(true);
  const [buttonunSold, setButtonUnSold] = useState(true);
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
        console.log('CURR',curr);
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

  useEffect(() => {

    const handleDisconnect = () => {
      console.log("Disconnected from socket server.");
    };

    const handleNextPlayer = (data) => {
      //setNextPlayer([data]);
      actionsAfterGetPlayer(data);
      handleStartTimer();
      handleGetTime()
    };


    socket.on("disconnect", handleDisconnect);
    socket.on("getplayer", handleNextPlayer);
    socket.on("getspecificplayer", handleNextPlayer);
    socket.on('timer_started', () => {
      setIntervalId(setInterval(handleGetTime, 1000));
    });
  
    socket.on('timer_update', (remainingTime) => {
      setRemainingTime(Math.max(remainingTime, 0));
    });
  


    return () => {
      socket.off("disconnect", handleDisconnect);
      socket.off("getplayer", handleNextPlayer);
    };
  }, [socket, getRandom]);



  const handleClick = async () => {
    if(requestedPlayer!=="")
    {
      /*try{
      const response = await fetch('https://testefl2023.azurewebsites.net/getspecificplayer/'+requestedPlayer);
      if(response.ok)
      {
        const json = await response.json();
        actionsAfterGetPlayer(json);
     } else {
       console.log('Error: ' + response.status + response.body);
     }
      

      }catch (error) {
        console.error(error);
      }
      return*/
      socket.emit('getspecificplayer', { playername: requestedPlayer });
      
    }
    //Commenting below code to add socket code
    /*
    try {
      const response = await fetch('https://testefl2023.azurewebsites.net/getplayer');
      if(response.ok){
        const json = await response.json();
        actionsAfterGetPlayer(json);
     } else {
       console.log('Error: ' + response.status + response.body);
     }
    } catch (error) {
      console.error(error);
    }*/
    else{
      socket.emit("getplayer");
    }
    
  };

  
  const buttonTexts = settings.setup.teamNames;
  

  const handleSoldClick = (inStatus,inBidder,inAmount) => {
   
    const payload = { ownerTeam: inBidder , status: inStatus, boughtFor: inAmount, role: getRandom.role, country: getRandom.country };
    console.log(inStatus,inBidder,inAmount)
    if (inStatus === 'sold')
    {
      setIsSold(true)
      setButtonSold(true)
    }
    else
    {
      setIsunSold(true)
      setButtonUnSold(true)
    }
    fetch('https://testefl2023.azurewebsites.net/updateplayer/'+getRandom._id.$oid, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
    setFlag(false)
    handleStopTimer()
    socket.on('timer_stopped', () => {
      clearInterval(intervalId);
    });
  }
  const [firstClick,setFirstClick] = useState(true)

  function actionsAfterGetPlayer(json) {
    setData(json);
    setAmount(json.eflBase);
    setBidder('');
    setSelectedButton(null);
    setTimer(20);
    setFlag(true);
    setFirstClick(true);
    setIsSold(false);
    setIsunSold(false);
    setButtonSold(false);
    setButtonUnSold(false);
    setRequestedPlayerChange("");
    getOwnersData(json.country);
  }

  function increaseAmount(playercountry)
  {
    // for the first bid set to base price
    if(firstClick)
    {
      setFirstClick(false)
      return
    }
    let increment = 5;
    if (amount >= 200)
    {
      increment = 20;
    }else if (amount >= 100){
      increment = 10;
    }
    setAmount(amount+increment)
    const disableMapTemp = ownersData.reduce((map, curr) => {
      console.log('CURR',curr);
      // if squad is full or foreigner count is 6 or current amount is greater than maxBid for owner
      // set disable to true
      if(curr.totalCount===settings.squadSize||(curr.fCount===6 && playercountry !== 'India')||curr.maxBid<amount)
      {
        map[curr.ownerName]=true;
      }
      return map;
  }, {});
  console.log(disableMapTemp);
  setDisableMap(disableMapTemp);
  }
/*
  function shouldBeEnabled(teamName){
    const currentRole = getRandom.role;
    const currentCountry = getRandom.country;
    const ownerForeignerCount = getOwnerAttr(teamName);
    const ownerRoleCount = getOwnerAttr(teamName, currentRole);

    if(currentCountry.toLowerCase()!="india" && ownerForeignerCount>=6){
      return false;
    }


    
  }*/
const [disableMap, setDisableMap] = useState({})
const [editing, setEditing] = useState(false);
const handleDoubleClick = () => {
  setEditing(true);
};

const handleBlur = () => {
  setEditing(false);
};

const handleChange = event => {
  setAmount(parseInt(event.target.value));
};

const [requestedPlayer, setRequestedPlayerChange] = useState("");
const handleRequestedPlayerChange = event => {
  setRequestedPlayerChange(event.target.value);
};

/*
const handleSetup = () => 
{
  fetch('https://testefl2023.azurewebsites.net/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings.setup)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
}*/
     // const getRandom = null
  return (
    <div className="App">
      <div className="top-row">
      <div className="owner-table-item">
          <div style={{display: "flex", flexDirection:"column",position:"relative",marginTop:"15px"}}>
          {ownersData && <OwnerStats data={ownersData}/> }
          </div>
      </div>
        <div className="top-row-item" style={{position:"relative",marginTop:"15px"}}>
           { console.log(getRandom.type)}
         <PlayerCard playerName={getRandom.name}
         country={getRandom.country} 
         intro1={getRandom.intro[0]}
         intro2={getRandom.intro[1]}
         intro3={getRandom.intro[2]}
         type={getRandom.role} 
         franchise={getRandom.iplTeam}/>
        </div>
        <div className="top-row-item">
          <div>
         <p style={{marginTop:"15px",marginRight:"20px"}} className='shiny-text'> Current Bidder: {bidder}</p>
         <div className="editable-amount">
      {editing ? (
        <input
          type="text"
          value={amount}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      ) : (
        <p className="shiny-text" onDoubleClick={handleDoubleClick}>
          BID: {amount} lacs
        </p>
      )}
    </div>
  
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
        {isSold && <div className="sold-text show">SOLD</div>}
      </div>
      <div>
        {isunSold && <div className="unsold-text show">UNSOLD</div>}
      </div>

      <div className="bottom-row" style={{position:"relative",bottom:"-40px"}}>
      
      {buttonTexts.map((text, index) => (
        <div key={index} className="container-for-team">
          <img src={require('./auction_hand.png')} alt="my-image" className="my-image" style={{ display: selectedButton === index ? 'block' : 'none'}}/>
          <button id= {text} disabled={disableMap[text]} onClick={() => {setSelectedButton(index)
          setBidder(text); increaseAmount(getRandom.country);setTimer(20)}} className={`${disableMap[text] ? "button-disabled" : "my-button teamButton"}`}>{text}</button>
      
        </div>
      ))}
      <div style={{display: 'flex', flexDirection: 'column',position:"relative",bottom:"20px"}}>
      
      <input type="text" placeholder="Player Name" value={requestedPlayer} onChange={handleRequestedPlayerChange}/> 
      <button className="action-button" onClick={handleClick}>Next Player</button>
      
      </div>
      <button className="action-button" onClick={()=>handleSoldClick('sold', bidder, amount)} disabled={buttonSold}>Mark Sold</button>
      <button className="action-button" onClick={()=>handleSoldClick('unsold-processed','',0)} disabled={buttonunSold}>Mark Unsold</button>

      
      </div>
    </div>
  )
}
