import React from 'react'
import DataTable from 'react-data-table-component';

export default function OwnerStats(props) {
    const columns = [
        { selector: row => row['ownerName'], name: 'Owner' , sortable: true, width: '100px'},
        { selector: row => row['batCount'], name: 'Bat' , sortable: true},
        { selector: row => row['ballCount'], name: 'Bowl' , sortable: true},
        { selector: row => row['wkCount'], name: 'WK' , sortable: true},
        { selector: row => row['arCount'], name: 'AR', sortable: true },
        { selector: row => row['fCount'], name: 'INTL', sortable: true },
        
        ];
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
        const cols = ['Owner', 'Bat(4)','Bowl(4)','WK(1)','AR(2)','I(4-6)'];
        console.log(props.data)
        function makeAbv(string) {
            const words = string.split(' ');
            return words.map(word => word[0].toUpperCase());
          }
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
                <div style={{marginRight:'10px', width: '50px', color: '#3498db',
}}>{makeAbv(item.ownerName)}</div>
                <div style={{marginRight:'10px', width: '50px', color: '#3498db',
}}>{item.batCount}</div>
                <div style={{marginRight:'10px', width: '50px', color: '#3498db',
}}>{item.ballCount}</div>
                <div style={{marginRight:'10px', width: '50px', color: '#3498db',
}}>{item.wkCount}</div>
                <div style={{marginRight:'10px', width: '50px', color: '#3498db',
}}>{item.arCount}</div>
                <div style={{marginRight:'10px', width: '50px', color: '#3498db',
}}>{item.fCount}</div>
                </div>
            ))}
            </div>
    </div>
        
    
  )
}
