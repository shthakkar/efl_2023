import React, { useState, useEffect} from "react";
import './style.css';
import DataTable, { createTheme } from 'react-data-table-component';
import _ from 'lodash'
import TeamRestrictions from "./TeamRestrictions";


export default function Teams() {
    const [Playerslist, setPlayerslist] = useState([]);
    
    const customTableStyles = {
    rows: {
      style: {
        maxHeight: '10px',
        fontSize: '12px',
        border: '1px solid black',
        backgroundColor: 'green',
      },
    },
    headCells: {
      style: {
        border: '2px solid black',
        fontSize: '16px',
        fontWeight: 'Bold',
        color: 'blue'
      },
    },
    cells: {
      style: {
        border: '1px solid black',
        color: 'black',
        fontSize: '14px'
      },
    },
  };
    
    useEffect(() => {
        async function getallplayers(){
            try {
                const response = await fetch('https://testefl2023.azurewebsites.net/getallplayers');
                if(response.ok){
                    const data = await response.json();
                    //console.log(data)
                    setPlayerslist(data);
                } else {
                    console.log('Error: ' + response.status + response.body);
                }
            } catch (error) {
            console.error(error);
            }
    
    }
    getallplayers();
    },[])

    const groupedsoldPlayers = Playerslist.filter(item =>item.status==='sold' && item.ownerTeam)
    
    const groupedData = _.groupBy(groupedsoldPlayers, 'ownerTeam');

    const columns = [
    { selector: row => row['name'], name: 'Name' , sortable: true},
    { selector: row => row['iplTeam'], name: 'IPL Team' , sortable: true},
    { selector: row => row['role'], name: 'Role' , sortable: true},
    { selector: row => row['country'], name: 'Country' , sortable: true},
    { selector: row => row['tier'], name: 'Tier', sortable: true },
    {
        id: 'boughtFor',
        selector: (row) => row['boughtFor'],
        name: 'BoughtFor',
        sortable: true,
      },
    ];

  return (
    <div>
      {Object.keys(groupedData).map(groupKey => (
        <div style={{fontSize: '20px',fontWeight: 'Bold',color: 'black',textAlign:'center'}} key={groupKey}>
          <h2>{groupKey}</h2>
          <DataTable
            data={groupedData[groupKey]}
            columns={columns}
            customTableStyles = {customTableStyles}
            sortable
            defaultSortFieldId="boughtFor"
          />
          <TeamRestrictions data={groupedData[groupKey]}/>
        </div>
      ))}
    </div>
  );
}


  
    
