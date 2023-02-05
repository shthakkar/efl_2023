import React, { useState, useEffect, useRef } from 'react';
import PlayerIntro from './PlayerIntro'
import PlayerCard from './PlayerCard'
import OwnerStats from './OwnerStats'


export default function 
Auction() {
  const [timer, setTimer] = useState(20)
  const timerId = useRef()

  useEffect(() => {
    timerId.current = setInterval(() => {
            setTimer(timer => timer - 1)
        },1000)
        return () => clearInterval(timerId.current)
    }, [timer])

    useEffect(() =>{
        if (timer <= 0) {
            clearInterval(timerId.current)
            console.log('SOLD')
        }
    }, [timer])

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
      "intro2",
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
 async function getOwnersData()
  {
    try {
      const response = await fetch('https://efl2023test.azurewebsites.net/getallownersdata');
      if(response.ok){
        const json = await response.json();
        setOwnersData(json)
        const data = json.reduce((acc, curr) => {
          acc[curr.ownerName] = {maxBid:curr.maxBid,currentPurse: curr.currentPurse};
          return acc;
      }, {});
        console.log(data)
        setOwnerToMaxBid(data)
     } else {
       console.log('Error: ' + response.status + response.body);
     }
    } catch (error) {
      console.error(error);
    }
  }

  const handleClick = async () => {
    try {
      const response = await fetch('https://efl2023test.azurewebsites.net/getplayer');
      if(response.ok){
        const json = await response.json();
        setData(json);
        setAmount(getRandom.salaryNumber)
        setBidder('')
        setSelectedButton(null)
        setTimer(20)
        setFlag(true)
        getOwnersData()
     } else {
       console.log('Error: ' + response.status + response.body);
     }
    } catch (error) {
      console.error(error);
    }
  };
  const buttonTexts = ["Gajjab Gujjus", "Bhaisaab's Royal Fixers", "My Lord Dilwale", "Dad's Army", "One Pitch One Hand", "Untouchaballs", "Lions Of Mirzapur"];
 
  const handleSoldClick = (inStatus,inBidder,inAmount) => {
    const payload = { ownerTeam: inBidder , status: inStatus, boughtFor: inAmount, role: getRandom.role, country: getRandom.country };
    console.log(inStatus,inBidder,inAmount)
    fetch('https://efl2023test.azurewebsites.net/updateplayer/'+getRandom._id.$oid, {
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
  }
  function increaseAmount()
  {
    let increment = 5;
    if (amount >= 200)
    {
      increment = 20;
    }else if (amount >= 100){
      increment = 10;
    }
    setAmount(amount+increment)
  }


      
     // const getRandom = null
  return (
    <div className="App">
      <div className="top-row">
        <div className="top-row-item">
        <div style={{display: "flex", flexDirection:"column"}}>
        <PlayerIntro intro={getRandom.intro}/>
        {ownersData && <OwnerStats data={ownersData}/> }
        </div>
        </div>
        <div className="top-row-item">
           { console.log(getRandom.type)}
         <PlayerCard playerName={getRandom.name}
         country={getRandom.country} 
         type={getRandom.role} 
         franchise={getRandom.iplTeam}/>
        </div>
        <div className="top-row-item">
          <div>
         <p style={{marginRight:"20px"}} className='shiny-text'> Current Bidder: {bidder}</p>
         <p className='shiny-text'>BID: {amount} lacs</p>
         <p className='shiny-text'>Current Purse: {ownerToMaxBid[bidder]?.currentPurse} lacs</p>
         <p className='shiny-text'>Max Bid: {ownerToMaxBid[bidder]?.maxBid} lacs</p>

         </div>
        </div>
      </div>
      <div>
        {isflag &&(
          <div>
           <h1>Time Remaining: {timer}</h1>
           </div>) }
      </div>
      <div className="bottom-row">
      
      {buttonTexts.map((text, index) => (
        <div key={index} className="container-for-team">
          <img src={require('./auction_hand.png')} alt="my-image" className="my-image" style={{ display: selectedButton === index ? 'block' : 'none' }}/>
          <button id= {text}  onClick={() => {setSelectedButton(index)
          setBidder(text); increaseAmount();setTimer(20)}} className="my-button teamButton">{text}</button>
      
        </div>
      ))}
      <button className="action-button" onClick={handleClick}>Next Player</button>
      <button className="action-button" onClick={()=>handleSoldClick('sold', bidder, amount)}>Mark Sold</button>
      <button className="action-button" onClick={()=>handleSoldClick('unsold-processed','',0)}>Mark Unsold</button>
      
      
      </div>
    </div>
  )
}
