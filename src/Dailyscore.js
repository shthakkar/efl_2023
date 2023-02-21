import React, { useState, useEffect} from "react";
import './style.css';
import DataTable from 'react-data-table-component';

export default function Dailyscore() {
  const [Playersownerslist, setPlayerownersslist] = useState([]);
  const [Teamsstats, setTeamsstats] = useState([])

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
        const response = await fetch('https://testefl2023.azurewebsites.net/getallsoldplayers');
        if(response.ok){
          const data = await response.json();
          //console.log(data)
          setPlayerownersslist(data);
        } else {
          console.log('Error: ' + response.status + response.body);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getallsoldplayers();
  }, [])

  useEffect(() => {
    async function getallteampoints(){
      try {
        const response = await fetch('https://testefl2023.azurewebsites.net/getallownersdata');
        if(response.ok){
          const stats = await response.json();
          //console.log(data)
          setTeamsstats(stats);
        } else {
          console.log('Error: ' + response.status + response.body);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getallteampoints();
  }, [])

  const teamData = Playersownerslist.reduce((acc, player) => {
    if (!acc[player.ownerTeam]) {
      acc[player.ownerTeam] = [];
    }
    acc[player.ownerTeam].push({ name: player.name, points: player.points });
    return acc;
  }, {});

  const teampoints = Teamsstats.reduce((tcc, teams) => {
    if (!tcc[teams.ownerName]) {
      tcc[teams.ownerName] = teams.totalPoints;
    }
    return tcc;
  }, {});
  
  const data = [];
  const teamtotalpoints = teampoints

  for (const [teamName, players] of Object.entries(teamData)) {
    const team = {
      teamName: teamName,
      totalpoint:teamtotalpoints[teamName],
      players: players,
    };
    data.push(team);
  }
  
  const TeamTable = ({ teams }) => {
    const [selectedTeam, setSelectedTeam] = useState(null);

    const columns = [
        { selector: (row) => row["teamName"], name: "Team", sortable: true },
        {
            id: 'totalpoint',
            selector: (row) => row['totalpoint'],
            name: 'Total Points',
            sortable: true,
          },
      ];
  
    if (selectedTeam) {
      const team = teams.find((t) => t.teamName === selectedTeam);
      const playerColumns = [
        { selector: row => row['name'], name: 'Name' , sortable: true},
        {
            id: 'points',
            selector: (row) => row['points'],
            name: 'Points',
            sortable: true,
          },
          //{ selector: row => row['points'], name: 'Points' , sortable: true},
      ];
      return (
        <div>
          <DataTable
            title={`Players for ${team.teamName}`}
            data={team.players}
            columns={playerColumns}
            defaultSortFieldId = "points"
            defaultSortAsc={false}
            customStyles={customStyles}

          />
          <button className="action-button" onClick={() => setSelectedTeam(null)}>Back</button>
        </div>
      );
    }
  
    return (
    <div style={{fontSize: '20px',fontWeight: 'Bold',color: 'black',textAlign:'center'}}>
          <h2>LeaderBoard</h2>
        <DataTable
            data={teams}
            columns={columns}
            onRowClicked={(row) => console.log(row)}
            defaultSortFieldId="totalpoint"
            defaultSortAsc={false}
            highlightOnHover ={true}
            expandableRows
            expandableRowExpanded={(row) => row.teamName === selectedTeam}
            onRowExpandToggled={(state, row) =>setSelectedTeam(state ? row.teamName : null)}
            customStyles={customStyles}
            
        />
    </div>
    )
  };
  
  return <TeamTable teams={data} />;
}