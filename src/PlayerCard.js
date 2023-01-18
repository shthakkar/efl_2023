import React from 'react';

 const PlayerCard = ({playerName, country, type, franchise}) => {
  return (
    <div className="player-card">
      <h1 className="player-name" style={{fontSize: '32px'}}>{playerName}</h1>
      <h2 className="player-country" style={{fontSize: '24px'}}>{country}</h2>
      <h3 className="player-type" style={{fontSize: '20px'}}>{type}</h3>
      <h3 className="player-franchise" style={{fontSize: '20px'}}>{franchise}</h3>
    </div>
  );
}

export default PlayerCard;