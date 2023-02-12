import React, { useState, useEffect} from "react";
import './style.css';
import DataTable, { createTheme } from 'react-data-table-component';


export default function AllPlayers() {
  const [Allplayers,setAllPlayerslist] = useState([]);
  useEffect(() => {
    async function getallplayerslist(){
        try {
            const response = await fetch('https://efl2023test.azurewebsites.net/getallplayers');
            if(response.ok){
                const data = await response.json();
                //console.log(data)
                setAllPlayerslist(data);
            } else {
                console.log('Error: ' + response.status + response.body);
            }
        } catch (error) {
        console.error(error);
        }

      }
      getallplayerslist();
  },[])
  const players = Allplayers.filter(item =>item.status!=='sold')
  const rows = players;
  const customStyles = {
    rows: {
      positive: {
        backgroundColor: 'green',
      },
      negative: {
        backgroundColor: 'red',
      },
    },
    header: {
      style: {
        backgroundColor: '#333',
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'uppercase',
      },
    },
    cells: {
      style: {
        border: '1px solid #ccc',
        padding: '8px',
      },
    },
    evenRows: {
      style: {
        backgroundColor: '#f2f2f2',
      },
    },
    hoveredRow: {
      style: {
        backgroundColor: '#f5f5f5',
      },
    },
    selectedRow: {
      style: {
        backgroundColor: '#007bff',
        color: '#fff',
      },
    },
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const conditionalRowStyles = [
    {
      when: (row) => row.tier === 1,
      style: {
        backgroundColor: getRandomColor(),
      },
    },
    {
      when: (row) => row.tier === 2,
      style: {
        backgroundColor: getRandomColor(),
      },
    },
    {
      when: (row) => row.tier === 3,
      style: {
        backgroundColor: getRandomColor(),
      },
    },
    {
      when: (row) => row.tier === 4,
      style: {
        backgroundColor: getRandomColor(),
      },
    },
  ];

  const columns = [
    { selector: (row) => row['name'], name: 'Name' , sortable: true},
    { selector: (row) => row['iplTeam'], name: 'IPL Team' , sortable: true},
    { selector: (row) => row['status'], name: 'Status' , sortable: true},
    { selector: (row) => row['role'], name: 'Role' , sortable: true},
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
  return (
    <div>
      {console.log('testing')}
      <DataTable
        columns={columns}
        data={rows}
        conditionalRowStyles={conditionalRowStyles}
        defaultSortFieldId="rank"
      />
    </div>
  );
}
