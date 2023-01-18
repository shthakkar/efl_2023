import React from 'react'

export default function PlayerIntro(props) {
    const styles = {
        container: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        },
        name: {
          fontSize: '1.5em',
          fontWeight: 'bold',
          color: '#3498db',
          margin: '10px 0'
        }
      };
      
      
  return (
    
    <div style={styles.container}>
     
      {props.intro.map(name => (
        <div key={name} style={styles.name}>
          {name}
        </div>
      ))}
    </div>
  )
}
