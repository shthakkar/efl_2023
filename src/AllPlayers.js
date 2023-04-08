import React, { useState, useEffect, useMemo} from "react";
import './style.css';
import DataTable, { createTheme } from 'react-data-table-component';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


export default function AllPlayers() {
  const [Allplayers, setAllPlayerslist] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [soldPlayers, setSoldPlayers] = useState([]);
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);

  const baseURL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    async function getallplayerslist() {
      try {
        const response = await fetch(
          baseURL+'/getallplayers'
        );
        if (response.ok) {
          const data = await response.json();
          setAllPlayerslist(data);
          setFilteredPlayers(data.filter((item) => item.status !== 'sold'));
          setSoldPlayers(data.filter((item) => item.status !== 'sold'));
        } else {
          console.log('Error: ' + response.status + response.body);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getallplayerslist();
  }, []);
  
  const defaultColDef = {
    sortable: true,
    resizable: true,
    //filter: true,
  };

  const columnDefs = [
    { field: "name", headerName: "Name", width: 200, filter: true},
    { field: "iplTeam", headerName: "IPL Team", width: 150, filter: true },
    { field: "status", headerName: "Status", width: 150,filter: true },
    { field: "role", headerName: "Role", width: 150, filter: true },
    { field: "country", headerName: "Country", width: 150,filter: true },
    { field: "tier", headerName: "Tier", width: 100, filter: true },
    { field: "points", headerName: "Points", width: 150 },
    { field: "salaryNumber", headerName: "Salary", width: 100 },
    { field: "eflBase", headerName: "EFL Base Salary", width: 200 },
    { field: "rank", headerName: "Rank",sort:'asc', width: 150 },
  ];

  const getRowStyle = (params) => {
    const tier = params.data.tier;
    switch (tier) {
      case 1:
        return { backgroundColor: "lightgreen" };
      case 2:
        return { backgroundColor: "lightblue" };
      case 3:
        return { backgroundColor: "orange" };
      case 4:
        return { backgroundColor: "lightpink" };
      default:
        return null;
    }
  };

    
    const handleFilter = (e) => {
    const value = e.target.value;
    const filtered = soldPlayers.filter((player) =>
    player.name.toLowerCase().includes(value.toLowerCase()) ||
    player.iplTeam.toLowerCase().includes(value.toLowerCase()) ||
    player.role.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPlayers(filtered);
    };
    
    return (
    <div style={containerStyle}>
    <div className="ag-theme-alpine" style={{ height: 600 }}>
    <AgGridReact
    rowData={filteredPlayers}
    columnDefs={columnDefs}
    defaultColDef={defaultColDef}
    getRowStyle={getRowStyle}
    onFilterChanged={handleFilter}
    //floatingFilter={true}
    />
    </div>
    </div>
    );
    }

/*
export default function AllPlayers() {
  const [Allplayers,setAllPlayerslist] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [soldPlayers, setSoldPlayers] = useState([])

  useEffect(() => {
    async function getallplayerslist(){
        try {
            const response = await fetch('https://efl2023.azurewebsites.net/getallplayers');
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
}*/
