import React from 'react'
import DataTable from 'react-data-table-component';

export default function OwnerStats(props) {
        const customStyles = {
            rows: {
                style: {
                    maxHeight: '12px', // override the row height
                },
            },
            columns:
            {
                style:
                {
                    maxWidth: '10px'
                }
            }
            
        };
        const cols = ['Owner', 'Bat(4)','Bowl(4)','WK(1)','AR(2)','I(4-6)', 'Sq(15)'];
        console.log(props.data)
        function makeAbv(string) {
            const words = string.split(' ');
            return words.map(word => word[0].toUpperCase());
          }
        const countStyle = {marginRight:'10px', width: '50px', color: '#3498db',
    };
    const countStyleGreen = {marginRight:'10px', width: '50px', color: 'white', backgroundColor: 'lightGreen'
    };
  return (
    // TITLE
    <div style={{display:'flex',  marginRight:'10px'}}>
            
            <div style={{display:'flex', flexDirection:'column'}}> 
            <div style={{display:'flex', flexDirection:'row'}}>
            {cols.map((item, index) => (
            <div style={{width: '50px', marginRight:'10px', color: 'blue'}} key={index}>{item}</div>
            ))}
            </div>
             {props.data.map((item, index) => (
            <div style={{display:'flex', flexDirection:'row', marginRight:'10px'}} key={index}>
                <div style={countStyle}>{makeAbv(item.ownerName)}</div>
                <div style={item.batCount >= 4 ? countStyleGreen : countStyle}>{item.batCount}</div>
                <div style={item.ballCount >= 4 ? countStyleGreen : countStyle}>{item.ballCount}</div>
                <div style={item.wkCount >= 1 ? countStyleGreen : countStyle}>{item.wkCount}</div>
                <div style={item.arCount >= 2 ? countStyleGreen : countStyle}>{item.arCount}</div>
                <div style={item.fCount >= 4 ? countStyleGreen : countStyle}>{item.fCount}</div>
                <div style={item.totalCount >= 15 ? countStyleGreen : countStyle}>{item.totalCount}</div>
                </div>
            ))}
            </div>
    </div>
        
    
  )
}
