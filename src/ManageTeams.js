import React, { useState, useEffect, useMemo} from "react";
import './style.css';
import DataTable from 'react-data-table-component';
import { createTheme } from "react-data-table-component";


export default function ManageTeams() {
  const [SoldPlayerslist, setSoldPlayerslist] = useState([]);
  const [GetPlayer, setPlayer] = useState();

  const baseURL = process.env.REACT_APP_BASE_URL;
  
  createTheme('solarized', {
    text: {
      primary: '#268bd2',
      secondary: '#2aa198',
    },
    background: {
      default: '#BDB76B',
    },
    context: {
      background: '#cb4b16',
      text: '#FFFFFF',
    },
    divider: {
      default: '#073642',
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)',
    },
  }, 'dark');
  
  
  const customStyles = {
    rows: {
      style: {
        maxHeight: '10px',
        fontSize: '14px',
        fontWeight: 'Bold'
      },
    },
    headCells: {
      style: {
        border: '2px solid black',
        fontSize: '16px',
        fontWeight: 'Bold',
        color:'red'
      },
    },
    cells: {
      style: {
        color: 'black',
        fontSize: '14px'
      },
    },
  };

  useEffect(() => {
    async function getallsoldplayers(){
      try {
        const response = await fetch(baseURL+'/getallsoldplayers');
        if(response.ok){
          const soldplayerlist = await response.json();
          //console.log(data)
          setSoldPlayerslist(soldplayerlist);
        } else {
          console.log('Error: ' + response.status + response.body);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getallsoldplayers();
  }, [])

  const columns = [
    { selector: (row) => row['name'], name: 'Name' , sortable: true},
    { selector: (row) => row['iplTeam'], name: 'IPL Team' , sortable: true},
    { selector: (row) => row['status'], name: 'Status' , sortable: true},
    { selector: (row) => row['role'], name: 'Role' , sortable: true},
    { selector: (row) => row['country'], name: 'Country' , sortable: true},
    { selector: (row) => row['tier'], name: 'Tier', sortable: true },
    { selector: (row) => row['boughtFor'], name: 'BoughtFor', sortable: true },
    {
      id: 'ownerTeam',
      selector: (row) => row['ownerTeam'],
      name: 'OwnerTeam',
      sortable: true,
    },
  ];

  const contextActions = useMemo(() => {
     const Deleteplayer =() =>{
        const player = GetPlayer
        const payload = { ownerTeam: player[0].ownerTeam ,status: "unsold",boughtFor:player[0].boughtFor,role:player[0].role,country:player[0].country};
        fetch(baseURL+'/deleteplayer/'+player[0]._id.$oid, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            })
            
            .then(response => response.json())
            .then(data => {
              console.log(data);
              window.location.reload();
            })
            .catch(error => {
              console.error(error);
            });
    };

    return (
        <button className="action-button" key="delete" onClick={Deleteplayer} style={{ backgroundColor: 'red' }}>
            Delete
        </button>
    );
}, [GetPlayer]);

 const handleChange = ({ selectedRows }) => {
    setPlayer(selectedRows);
  };
  return (
    <div>
      <DataTable
        title={"List of Sold Players"}
        columns={columns}
        data={SoldPlayerslist}
        defaultSortFieldId="ownerTeam"
        customStyles={customStyles}
        selectableRows ={true}
        highlightOnHover ={true}
        selectableRowsHighlight
        contextActions={contextActions}
        onSelectedRowsChange={handleChange}
        theme='solarized'

      />
    </div>
  );
}
