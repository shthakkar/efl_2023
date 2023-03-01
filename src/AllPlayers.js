import React, { useState, useEffect} from "react";
import './style.css';
import DataTable, { createTheme } from 'react-data-table-component';


export default function AllPlayers() {
  const [Allplayers,setAllPlayerslist] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [soldPlayers, setSoldPlayers] = useState([])

  useEffect(() => {
    async function getallplayerslist(){
        try {
            const response = await fetch('https://testefl2023.azurewebsites.net/getallplayers');
            if(response.ok){
                const data = await response.json();
                //console.log(data)
                setAllPlayerslist(data);
                setFilteredPlayers(data.filter(item => item.status !== 'sold'));
                setSoldPlayers(data.filter(item => item.status !== 'sold'))
            } else {
                console.log('Error: ' + response.status + response.body);
            }
        } catch (error) {
        console.error(error);
        }

      }
      getallplayerslist();
  },[])
 
  const conditionalRowStyles = [
    {
      when: (row) => row.tier === 1,
      style: {
        border: '1px solid black',
        backgroundColor: 'lightgreen',
      },
    },
    {
      when: (row) => row.tier === 2,
      style: {
        border: '1px solid black',
        backgroundColor: 'lightblue',
      },
    },
    {
      when: (row) => row.tier === 3,
      style: {
        border: '1px solid black',
        backgroundColor: 'orange',
      },
    },
    {
      when: (row) => row.tier === 4,
      style: {
        border: '1px solid black',
        backgroundColor: 'lightpink',
      },
    },
  ];

  const columns = [
    { selector: (row) => row['name'], name: 'Name' , sortable: true, filterable: true},
    { selector: (row) => row['iplTeam'], name: 'IPL Team' , sortable: true, filterable: true},
    { selector: (row) => row['status'], name: 'Status' , sortable: true},
    { selector: (row) => row['role'], name: 'Role' , sortable: true, filterable: true},
    { selector: (row) => row['country'], name: 'Country' , sortable: true},
    { selector: (row) => row['tier'], name: 'Tier', sortable: true },
    { selector: (row) => row['points'], name: 'Points' , sortable: true},
    { selector: (row) => row['salaryNumber'], name: 'Salary', sortable: true },
    {
      id: 'eflBase',
      selector: (row) => row['eflBase'],
      name: 'EFL Base Salary',
      sortable: true,
    },
    {
      id: 'rank',
      selector: (row) => row['rank'],
      name: 'Rank',
      sortable: true,
    },
  ];

  const handleFilter = (e) => {
    const value = e.target.value;
    const filtered = soldPlayers.filter((player) =>
      player.name.toLowerCase().includes(value.toLowerCase())||
      player.iplTeam.toLowerCase().includes(value.toLowerCase())||
      player.role.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPlayers(filtered);
  };


  return (
    <div>
      <DataTable
        columns={columns}
        data={filteredPlayers}
        conditionalRowStyles={conditionalRowStyles}
        defaultSortFieldId="rank"
        onFilter={handleFilter}
        subHeader
        subHeaderComponent={<input type="text" placeholder="Filter String" onChange={handleFilter} />}
      />
    </div>
  );
}
