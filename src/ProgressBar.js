import React from 'react'

export default function ProgressBar(props) {
    const { label,progress, max } = props;
  const width = (progress / max) * 100;
  const isFull = progress >= max
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        {{label}&&<div>{label}</div>}
        <div>{progress}/{max}</div>
        <div style={{ width: `${width}%`, background: isFull? 'green' : 'yellow', height: '20px' }} />
        <div style={{ width: `${100 - width}%`, background: 'lightgray', height: '20px', position: 'absolute', left: `${width}%` }} />
        
    </div>
  )
}
