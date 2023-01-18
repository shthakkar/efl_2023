import React, { useState } from 'react';
import './style.css';
import AllPlayers from './AllPlayers';
import Auction from './Auction';

export default function App() {
  const [page, setPage] = useState('home');
  const handleClick = (page) => {
    setPage(page);
  };
  return (
    <>
      <div className="container">
        <button className = "mainButton" onClick={() => handleClick('home')}>Home</button>
        <button className = "mainButton" onClick={() => handleClick('auction')}>Auction Page</button>
        <button className = "mainButton" onClick={() => handleClick('owners')}>Owner Teams</button>
        <button className = "mainButton" onClick={() => handleClick('daily')}>Daily Score</button>
      </div>
      
      {page==="home" && <AllPlayers />}
      {page==="auction" && <Auction />}
    </>
  );
}
