import React, { useState,useEffect} from "react";
import settings from './settings.json'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { Layout, Space, Card } from 'antd';
import { AgGridReact} from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "./style.css";



const { Header, Content } = Layout;

const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
  fontSize:'25px',
  fontWeight:'bold',
};

const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '100%',
  padding: '0 50px',
  margintop:'50px',
  height:'100%',
  color: '#fff',
  backgroundColor: 'lightyellow',
};

const table= {
  height: "100%",
  textAlign: "left",
  lineHeight: '100%',
  padding: '0 50px',
  margintop:'50px',
  width: "100%",
  overflowY: "auto",
  backgroundColor: 'lightgreen',
  flexDirection: "column",
};

const tableContainer= {
  height: "100%",
  width: "100%",
  overflowY: "auto"
};


export default function SubstitutePlayers() {
  const teams = settings['setup']['teamNames']
  const [Allplayers, setAllPlayerslist] = useState([]);
  const [unsoldPlayers, setUnSoldPlayers] = useState([]);
  const [soldPlayers, setSoldPlayers] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [mounted, setMounted] = useState(false);
  const [teamplayers, setTeamplayers] = useState([]);
  const [teamsdata, setTeamsData] = useState([]);
  const [playertobereplaced, setTobeReplacedPlayer] = useState([]);
  const [specificteamsdata, setSpecificTeamsData] = useState([]);
  const [tierfilterplayer, setTierfilterplayer] = useState([]);
  const [playertobereplacedwith, setTobeReplacedPlayerWith] = useState([]);
  const [disablebutton, setDisableButton] = useState(true)

  


const columnDefs = [
  { headerName: 'Select', field: 'checkboxSelection', checkboxSelection: true, width:20 },
  { headerName: 'Name', field: 'name' },
  { headerName: 'IPLTeam', field: 'iplTeam' ,width:100},
  { headerName: 'Points', field: 'points',width:100,sort: "desc"},
  { headerName: 'Tier', field: 'tier',width:100 },
];

// Define grid options for the table
const gridOptions = {
  rowSelection: 'single', // enable single-row selection mode
  onRowSelected: (event) => {
    if (event.node.isSelected()) {
      // handle row selection
      const selectedRow = event.node.data;
      setTobeReplacedPlayer(selectedRow);
      setTierfilterplayer(unsoldPlayers.filter((item) => (item.tier >= selectedRow.tier)));
      //console.log(selectedRow);
    } else {
      // handle row deselection
      setTobeReplacedPlayer([]);
      setTierfilterplayer([]);
      setDisableButton(true)
    }
  }
};

const gridOptions1 = {

  rowSelection: 'single', // enable single-row selection mode
  onRowSelected: (event) => {
    if (event.node.isSelected()) {
      // handle row selection
      const selectedRow = event.node.data;
      setTobeReplacedPlayerWith(selectedRow)
      setDisableButton(false)
    } else {
      // handle row deselection
      setTobeReplacedPlayerWith([]);
      setDisableButton(true)
    }
  }
};

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);


  useEffect(() => {
    if (mounted) {
    async function getallplayerslist() {
      try {
        const response = await fetch(
          'http://localhost:5000/getallplayers'
        );
        if (response.ok) {
          const data = await response.json();
          setAllPlayerslist(data);
          setSoldPlayers(data.filter((item) => (item.status === 'sold')));
          setUnSoldPlayers(data.filter((item) => (item.status === 'unsold' || item.status === 'unsold-processed')));
        } else {
          console.log('Error: ' + response.status + response.body);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getallplayerslist();
  }
  }, [mounted]);


  useEffect(() => {
    async function getallteampoints(){
      try {
        const response = await fetch('http://localhost:5000/getallownersdata');
        if(response.ok){
          const stats = await response.json();
          setTeamsData(stats);
        } else {
          console.log('Error: ' + response.status + response.body);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getallteampoints();
  }, [selectedOption])

const handleChange = (event) => {

  setSelectedOption(event.target.value);
};


useEffect(() => {
 
    setTeamplayers(soldPlayers.filter((item) => (item.ownerTeam === selectedOption)));
    setSpecificTeamsData(teamsdata.filter((item) => (item.ownerName === selectedOption))[0])
 
}, [selectedOption])

const handleReplace = () => {
  let currentDate = new Date();
  let formattedDate = currentDate.toDateString();
  setDisableButton(true)

  const payload = { inPlayer: playertobereplacedwith.name , outPlayer: playertobereplaced.name, replacementDate: formattedDate, pointsToDeduct: playertobereplacedwith.points };
 
  fetch('http://localhost:5000/replaceplayer/'+specificteamsdata._id.$oid, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
}



//console.log("tea1",specificteamsdata)

  return (
  <Space direction="vertical" style={{width: '100%',}}size={[0, 48]}>
    <Layout>
    <Header style={headerStyle}>Please select a Team</Header>
      <Content style={contentStyle}>
   
    <FormControl sx={{ m: 1, minWidth: 160,borderRadius:'10px' }}>
    <InputLabel id="demo-simple-select-label">Teams</InputLabel>
    <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedOption}
        label="Teams"
        onChange={handleChange}
      >
      {teams.map(teamsname => (
        <MenuItem key={teamsname} value={teamsname}>
          {teamsname}
        </MenuItem>
      ))}
    </Select>
    
    <FormHelperText>Required</FormHelperText> 


  {specificteamsdata &&

<Card title="Team Data" bordered={true} style={{ width: 300,minHeight: 120,lineHeight: '100%',padding: '0 10px',margintop:'50px',backgroundColor: 'orange'}}>
    <p>Batsman Count: {specificteamsdata.batCount}</p>
    <p>Bowler Count: {specificteamsdata.ballCount}</p>
    <p>WK Count: {specificteamsdata.wkCount}</p>
    <p>AR Count: {specificteamsdata.arCount}</p>
    <p>Foreigner Count: {specificteamsdata.fCount}</p>
  </Card>}
  </FormControl>    
    
</Content>

{selectedOption &&
<Content style={{...table, display:"flex",flexDirection:'row',justifyContent:"space-between"}}>

<Content style={{ ...tableContainer,flex:1}}>

<div className="ag-theme-alpine" style={{ height: '500px', width: '600px'}}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={teamplayers}
        gridOptions={gridOptions}
      />
    </div>
  </Content>
  <div style={{display:"flex",alignItems:"center",left:"-24px",position:"relative"}}>
    <button className="action-button" onClick={handleReplace} disabled={disablebutton}>Replace</button>
  </div>
  {tierfilterplayer &&
  <Content style={{ ...tableContainer,flex:1}}>
 
<div className="ag-theme-alpine" style={{ height: '500px', width: '600px'}}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={tierfilterplayer}
        gridOptions={gridOptions1}
      />
    </div>
</Content>}
</Content>}
</Layout>
</Space>
  );
}

