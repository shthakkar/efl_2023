import React from 'react';

 const PlayerCard = ({playerName, country,intro1,intro2,intro3, type, franchise}) => {
  return (
    <div className="player-card">
      <h1 className="player-name" style={{fontSize: '32px'}}>{playerName} ({franchise})</h1>
      <h2 className="player-country" style={{fontSize: '24px'}}>{type} from {country}</h2>
      <h3 className="player-intro" style={{fontSize: '14px',margin:"unset"}}>{intro1}</h3>
      <h4 className="player-intro" style={{fontSize: '14px',margin:"unset"}}>{intro2}</h4>
      <h5 className="player-intro" style={{fontSize: '14px',margin:"unset"}}>{intro3}</h5>
    </div>
  );
}

export default PlayerCard;

