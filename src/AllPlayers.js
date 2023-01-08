import React from 'react';
import './style.css';
import players from './players.json';
import DataTable, { createTheme } from 'react-data-table-component';

export default function AllPlayers() {
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
    { selector: (row) => row['name'], name: 'Name' },
    { selector: (row) => row['iplTeam'], name: 'IPL Team' },
    { selector: (row) => row['status'], name: 'Status' },

    { selector: (row) => row['role'], name: 'Role' },
    { selector: (row) => row['country'], name: 'Country' },
    { selector: (row) => row['tier'], name: 'Tier' },
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
