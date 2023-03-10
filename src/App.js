import React, { useState, useEffect}  from 'react';
import './style.css';
import AllPlayers from './AllPlayers';
import Auction from './Auction';
import Teams from './Teams';
import Dailyscore from './Dailyscore';
import Login from './Login';
import SetupTeams from './SetupTeams';
import ManageTeams from './ManageTeams';
import { Route, Routes, useNavigate } from 'react-router-dom'
import { io } from "socket.io-client";
import DraftRoom from './DraftRoom';

export default function App() {
  const timestamp = new Date();
  let diff ;
  const navigate = useNavigate()
  const [ipAddress, setIpAddress] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [socketInstance, setSocketInstance] = useState("");

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIpAddress(data.ip))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    // Check if the user's IP address matches the allowed address
    console.log(ipAddress);
    if (ipAddress === '50.47.215.77' || ipAddress === '76.144.211.140') {
      

      setShowButtons(true);
    }else{
      setShowButtons(false);
    }
  }, [ipAddress]);

  useEffect(() => {
    const socket = io("localhost:5001/", {
        transports: ["websocket"],
        cors: {
          origin: "http://localhost:3000/efl_2023/#",
        },
      });

      setSocketInstance(socket);

},[])


  const navigateToAuction = () => {
    const stored = localStorage.getItem('timestamp');
    
    if (stored) {
      const storedTime = new Date(stored);
      
      if (isNaN(storedTime)) {
        // handle invalid stored timestamp
        //window.location.href = `${process.env.PUBLIC_URL}/#/login`;
        navigate('/login',{state:{previousurl:'/auction'}})
        return;
      }
      diff = (timestamp.getTime() - storedTime.getTime()) / 3600000;
      if (diff >= 24) {
        // navigate to login page if more than 24 hours
        //window.location.href = `${process.env.PUBLIC_URL}/#/login`;
        navigate('/login',{state:{previousurl:'/auction'}})
        return;
      }
    } else {
      // navigate to login page if timestamp is missing
      //window.location.href = `${process.env.PUBLIC_URL}/#/login`;
      navigate('/login',{state:{previousurl:'/auction'}})
      return;
    }
    // navigate to auction page if less than 24 hours
    //console.log("a",location.pathname)
        navigate('/auction');
  };

  const navigateHome = () => {
    //window.location.href = `${process.env.PUBLIC_URL}/#/home`;
    navigate('/home')
  };
  const navigateToOwners = () => {
    //window.location.href = `${process.env.PUBLIC_URL}/#/owners`;
    navigate('/owners')
  };
  const navigateToDailyScore = () => {
    //window.location.href = `${process.env.PUBLIC_URL}/#/daily`;
    navigate('/daily')
  };

  const navigateToSetupTeams = () => {
    //window.location.href = `${process.env.PUBLIC_URL}/#/login`;
    navigate('/login',{state:{previousurl:'/SetupTeams'}})

  }

  const navigateToManageTeams =() =>{
    navigate('/login',{state:{previousurl:'/ManageTeams'}})
  }

  const navigateToDraftRoom =() =>{
    navigate('/login',{state:{previousurl:'/Draft'}});
    //navigate('/Socket');
  }

console.log(showButtons)
  return (
    <div>
      <div className="container">
          <button className="mainButton" onClick={navigateHome}>Home</button>
          {showButtons && <button className="mainButton" onClick={navigateToAuction}>Auction Page</button>}
          <button className="mainButton" onClick={navigateToOwners}>Owner Teams</button>
          <button className="mainButton" onClick={navigateToDailyScore}>Daily Score</button>
          {showButtons && <button className="mainButton" onClick={navigateToManageTeams}>Manage Teams</button>}
          {showButtons && <button className="mainButton" onClick={navigateToSetupTeams}>Setup Teams</button>}
          <button className="mainButton" onClick={navigateToDraftRoom}>Draft Room</button>
        </div>
        <Routes>
          <Route path="/" element={<h1 style={{color:"black",fontSize:"300%",left:"50%"}}>Welcome To EFL 2023</h1>} />
          <Route path="/home" element={<AllPlayers />} />
          <Route path="/login" element={<Login socket={socketInstance}/>} />
          <Route path="/owners" element={<Teams />} />
          <Route path="/daily" element={<Dailyscore />} />
          <Route path="/auction" element={<Auction socket={socketInstance}/>} />
          <Route path="/SetupTeams" element={<SetupTeams />} />
          <Route path="/ManageTeams" element={<ManageTeams />}/>
          <Route path="/Draft" element={<DraftRoom socket={socketInstance}/>}/>
        </Routes>
    </div>
  );
}
