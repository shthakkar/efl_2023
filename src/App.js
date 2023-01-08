import React, { useState } from 'react';
import './style.css';
import AllPlayers from './AllPlayers';

export default function App() {
  const [page, setPage] = useState('home');
  const handleClick = (page) => {
    setPage(page);
  };
  return (
    <>
      <div className="container">
        <button onClick={() => handleClick('home')}>Home</button>
        <button onClick={() => handleClick('away')}>Auction Page</button>
        <button onClick={() => handleClick('home')}>Owner Teams</button>
        <button onClick={() => handleClick('away')}>Daily Score</button>
      </div>
      <AllPlayers />
    </>
  );
}
