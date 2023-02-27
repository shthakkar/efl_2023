import React, { useState, useEffect} from "react";
import './style.css';
import DataTable from 'react-data-table-component';
import TeamRestrictions from "./TeamRestrictions";
import { createTheme } from "react-data-table-component";

export default function Teams() {
  const [Playerslist, setPlayerslist] = useState([]);
  
  createTheme('dark', {
    background: {
      default: '#4682B4',
    },
  });

  createTheme('solarized', {
    text: {
      primary: '#268bd2',
      secondary: '#2aa198',
    },
    background: {
      default: '#87CEEB',
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
    async function getallsoldteamplayers(){
      try {
        const response = await fetch('https://testefl2023.azurewebsites.net/getallsoldplayers');
        if(response.ok){
          const playerlist = await response.json();
          //console.log(data)
          setPlayerslist(playerlist);
        } else {
          console.log('Error: ' + response.status + response.body);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getallsoldteamplayers();
  }, [])

  const teamsData = Playerslist.reduce((acc, player) => {
    if (!acc[player.ownerTeam]) {
      acc[player.ownerTeam] = [];
    }
    acc[player.ownerTeam].push({ name: player.name, iplTeam: player.iplTeam, role: player.role, country: player.country, boughtfor: player.boughtFor, tier: player.tier });
    return acc;
  }, {});

  const data = [];
  
  for (const [teamName, players] of Object.entries(teamsData)) {
    const team = {
      teamName: teamName,
      players: players,
      sqaudsize:players.length
    };
    data.push(team);
  }

  console.log("abc",data)

  const ExpandedRow = ({data})=>{
    const [selectedTeam, setSelectedTeam] = useState(data);
    
    if (selectedTeam) {
      //const team = teams.find((t) => t.teamName === selectedTeam);
      const playerColumns = [
        { selector: row => row['name'], name: 'Name' , sortable: true},
        { selector: row => row['iplTeam'], name: 'IPLTeam' , sortable: true},
        { selector: row => row['country'], name: 'Country' , sortable: true},
        { selector: row => row['role'], name: 'Role' , sortable: true},
        { selector: row => row['boughtfor'], name: 'BoughtFor' , sortable: true},
        {
            id: 'tier',
            selector: (row) => row['tier'],
            name: 'Tier',
            sortable: true,
          },
         
      ];
      return (
        <div style={{background:"#87CEEB"}}>
          <DataTable
            title={`Players for ${selectedTeam.teamName}`}
            data={selectedTeam.players}
            columns={playerColumns}
            defaultSortFieldId = "tier"
            defaultSortAsc={false}
            customStyles={customStyles}
            theme='solarized'
          />
          <TeamRestrictions prop={selectedTeam.players}/>
        </div>
      );
  }
}
  
  
  const TeamsTable = ({ teams }) => {
    const [selectedTeam, setSelectedTeam] = useState()

    const columns = [
        {
          id: 'teamName',
          selector: (row) => row['teamName'],
          name: 'Team',
          sortable: true,
        },
        { selector: row => row['sqaudsize'], name: 'SqaudSize' , sortable: true},
      ];
  
  
    return (
    <div style={{fontSize: '20px',fontWeight: 'Bold',color: 'black',textAlign:'center'}}>
          <h2>Owners Teams</h2>
        <DataTable
            data={teams}
            columns={columns}
            onRowClicked={(row) => console.log(row)}
            defaultSortFieldId="teamName"
            highlightOnHover ={true}
            expandableRows
            expandableRowsComponent={ExpandedRow}
            expandableRowExpanded={(row) => row.teamName === selectedTeam}
            onRowExpandToggled={(state, row) =>setSelectedTeam(state ? row.teamName : null)}
            customStyles={customStyles}
            theme='dark'
        />
    </div>
    )
  };
  
  return <TeamsTable teams={data} />;
}
