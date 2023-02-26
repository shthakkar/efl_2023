import React from 'react';
import './style.css';
import AllPlayers from './AllPlayers';
import Auction from './Auction';
import Teams from './Teams';
import Dailyscore from './Dailyscore';
import Login from './Login';
import SetupTeams from './SetupTeams';
import ManageTeams from './ManageTeams';
import { Route, Routes, useNavigate } from 'react-router-dom'

export default function App() {
  const timestamp = new Date();
  let diff ;
  const navigate = useNavigate()

  const navigateToAuction = () => {
    //localStorage.removeItem('timestamp')
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
    window.location.href = `${process.env.PUBLIC_URL}/#/auction`;
  };

  const navigateHome = () => {
    window.location.href = `${process.env.PUBLIC_URL}/#/home`;
  };
  const navigateToOwners = () => {
    window.location.href = `${process.env.PUBLIC_URL}/#/owners`;
  };
  const navigateToDailyScore = () => {
    window.location.href = `${process.env.PUBLIC_URL}/#/daily`;
  };

  const navigateToSetupTeams = () => {
    //window.location.href = `${process.env.PUBLIC_URL}/#/login`;
    navigate('/login',{state:{previousurl:'/SetupTeams'}})

  }

  const navigateToManageTeams =() =>{
    navigate('/login',{state:{previousurl:'/ManageTeams'}})
  }

  return (
    <div>
      <div className="container">
          <button className="mainButton" onClick={navigateHome}>Home</button>
          <button className="mainButton" onClick={navigateToAuction}>Auction Page</button>
          <button className="mainButton" onClick={navigateToOwners}>Owner Teams</button>
          <button className="mainButton" onClick={navigateToDailyScore}>Daily Score</button>
          <button className="mainButton" onClick={navigateToManageTeams}>Manage Teams</button>
          <button className="mainButton" onClick={navigateToSetupTeams}>Setup Teams</button>
        </div>
        <Routes>
          <Route path="/" element={<h1 style={{color:"black",fontSize:"300%",left:"50%"}}>Welcome To EFL 2023</h1>} />
          <Route path="/home" element={<AllPlayers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/owners" element={<Teams />} />
          <Route path="/daily" element={<Dailyscore />} />
          <Route path="/auction" element={<Auction />} />
          <Route path="/SetupTeams" element={<SetupTeams />} />
          <Route path="/ManageTeams" element={<ManageTeams />}/>
        </Routes>
    </div>
  );
}
