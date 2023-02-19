import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

const CircularNumber = ({ progress, max , text}) => {
  const progressPercentage = (progress / max) * 100;
  
  return (
    <div style={{width: "50px", height : "50px", marginRight:"40px", marginBottom: "20px", marginTop: "20px"}}>
      <CircularProgressbar
        value={progressPercentage}
        strokeWidth={50}
        
        styles={buildStyles({
          strokeLinecap: "butt",
          pathColor:"brown",
          trailColor:"beige"
        })}
      />
      <div style={{fontSize:"15px"}}>{text}  {progress}/{max}</div>
      </div>
      );
};

export default CircularNumber;
