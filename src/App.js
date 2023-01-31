import React from 'react';
import './style.css';
import AllPlayers from './AllPlayers';
import Auction from './Auction';
import Teams from './Teams';
import CircularNumber from './CircularNumber';
import { Route, Routes } from 'react-router-dom'

export default function App() {

  const navigateToAuction = () => {
    window.location.href = '/auction';
  };

  const navigateHome = () => {
    window.location.href = '/home';
  };
  const navigateToOwners = () => {
    window.location.href = '/owners';
  };
  const navigateToDailyScore = () => {
    window.location.href = '/daily';
  };
  return (
    <div>
      <div className="container">
          <button className="mainButton" onClick={navigateHome}>Home</button>
          <button className="mainButton" onClick={navigateToAuction}>Auction Page</button>
          <button className="mainButton" onClick={navigateToOwners}>Owner Teams</button>
          <button className="mainButton" onClick={navigateToDailyScore}>Daily Score</button>
        </div>
        <Routes>
          <Route path="/home" element={<AllPlayers />} />
          <Route path="/auction" element={<Auction />} />
          <Route path="/owners" element={<Teams />} />
          <Route path="/daily" element={<CircularNumber />} />
        </Routes>
    </div>
  );
}
