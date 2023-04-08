import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    TableContainer,
    Typography,
    IconButton,
  } from "@material-ui/core";
  import CloseIcon from "@material-ui/icons/Close";
  import { makeStyles } from "@material-ui/core/styles";
  import {
    createTheme,
    ThemeProvider,
  } from "@material-ui/core/styles";
  import { FaArrowUp, FaArrowDown, FaArrowsAltH } from "react-icons/fa";
  import Linechart from "./Linechart";
  import { AgGridReact} from "ag-grid-react";
  import 'ag-grid-community/styles/ag-grid.css';
  import 'ag-grid-community/styles/ag-theme-alpine.css';
  
  
  const theme = createTheme();
  
  const useStyles = makeStyles((theme) => ({
      root: {
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        flexDirection: "row",
      },
      sidePanel: {
        background: "lightblue",
        padding: theme.spacing(2),
        height: "100%",
        overflowY: "auto",
        maxWidth: "40%",
        width: "40%", // update the width to the desired value
        flex: 1
    },
    standingsBox: {
      padding: theme.spacing(2),
      textAlign: "left",
      background: "lightgreen",
      height:"auto",
      width:"55%",
      margin: "0 auto",
      flex: 1
    },
      chartBox: {
        padding: theme.spacing(2),
        textAlign: "center",
        width:"45%",
        overflowX: "auto",
      },
      tableContainer: {
        height: "100%",
        width: "100%",
        overflowY: "auto"
      },
      selectedRow: {
        backgroundColor: "#f4f4f4",
      },
      tableCell: {
        fontSize: 12,
      },
      playerName: {
        fontSize: "12px",
        width: "70%",
      },
      points: {
        fontSize: "12px",
        width: "30%", // adjust the width to fit the content
        textAlign: "right", // align the text to the right
      },
    }));
    
  
  export default function DailyScore() {
    const classes = useStyles();
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [playerData, setPlayerData] = useState([]);
    const [teamData, setTeamData] = useState([]);
    const [timsestamps, setTimestamps] = useState([]);
   
    const baseURL = process.env.REACT_APP_BASE_URL;
    
  
    useEffect(() => {
      async function getallsoldplayers(){
        try {
          const response = await fetch(baseURL+'/getallsoldplayers');
          if(response.ok){
            const data = await response.json();
            setPlayerData(data);
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
          const response = await fetch(baseURL+'/getallownersdata');
          if(response.ok){
            const stats = await response.json();
            setTeamData(stats);
          } else {
            console.log('Error: ' + response.status + response.body);
          }
        } catch (error) {
          console.error(error);
        }
      }
      getallteampoints();
    }, [])


    useEffect(() => {
      async function gettimestamps(){
        try {
          const response = await fetch(baseURL+'/gettimestamps');
          if(response.ok){
            const data = await response.json();
            setTimestamps(data);
          } else {
            console.log('Error: ' + response.status + response.body);
          }
        } catch (error) {
          console.error(error);
        }
      }
      gettimestamps();
    }, [])
  
    //const teamDataWithIndex = teamData.map((team, index) => ({ ...team, index: index + 1 }));

    const standingsDiff = teamData.map(team => {
        const lastTwoStandings = team.standing.slice(-2);
        const diff = lastTwoStandings.length === 2 ? lastTwoStandings[1] - lastTwoStandings[0] : 0;

        return {
            ...team,
            positionDiff: diff
        };
        });
  
    return (
        <ThemeProvider theme={theme}>
          {timsestamps[0] &&
          <Box className={classes.root}>
            {/* Standings */}
            <Box className={classes.standingsBox}>
                <Typography variant="h6" gutterBottom>
                  Standings updated at {timsestamps[0].pointsUpdatedAt}
                </Typography>
                <TableContainer className={classes.tableContainer} component={Paper}>
                  <div className="ag-theme-alpine" style={{ height: "70%", width: "100%" }}>
                    <AgGridReact
                      rowData={teamData}
                      onRowClicked={(event) => setSelectedTeam(event.data)}
                      columnDefs={[
                        { cellRenderer: (params) => params.rowIndex + 1, headerName: "#", width: 80 },
                        { field: "ownerName", headerName: "Team Name", width: 200 },
                        { field: "totalPoints", headerName: "Points", width: 120, sort: "desc" },
                      ]}
                    />
                  </div>
                  <Typography variant="subtitle1" gutterBottom>
                  Trends updated at{timsestamps[0].rankingsUpdatedAt}
                </Typography>
                  <div className="ag-theme-alpine" style={{ height: "70%", width: "100%" }}>
                    <AgGridReact
                      rowData={standingsDiff}
                      columnDefs={[
                        { field: "ownerName", headerName: "Team Name", width: 200 },
                        {
                            field: "positionDiff",
                            headerName: "Trend",
                            width: 120,
                            cellRenderer: (params) => {
                              const value = params.value;
                              const icon = value > 0 ? <FaArrowDown color="red" /> : value < 0 ? <FaArrowUp color="green" /> : <FaArrowsAltH />;
                              return <div> {icon} {Math.abs(value)}</div>;
                            },
                        }
                        /*{
                        field: "positionDiff",
                    headerName: "Diff",
                    width: 80,
                    cellRendererFramework: (params) =>
                      params.value > 0 ? (
                        <span style={{ color: "green" }}>
                          <FaArrowUp />
                          {params.value}
                        </span>
                      ) : params.value < 0 ? (
                        <span style={{ color: "red" }}>
                          <FaArrowDown />
                          {Math.abs(params.value)}
                        </span>
                      ) : (
                        <span style={{ color: "grey" }}>
                            <FaArrowsAltH />
                            {params.value}
                            </span>
                      ),
                  },*/
                      ]}
                    />
                  </div>
                </TableContainer>
                </Box>

                {/* Side panel */}
              {selectedTeam && (
                 <Box className={classes.sidePanel}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" gutterBottom>
                      {selectedTeam.ownerName} Players points updated at {timsestamps[0].pointsUpdatedAt}
                    </Typography>
                    <IconButton onClick={() => setSelectedTeam(null)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <div className="ag-theme-alpine" style={{ height: "100%", width: "100%" }}>
                    <AgGridReact
                      rowData={playerData.filter((player) => player.ownerTeam === selectedTeam.ownerName)}
                      columnDefs={[
                        { headerName: "Player Name", field: "name" },
                        { headerName: "Points", field: "points",sort: "desc" },
                      ]}
                    />
                  </div>
                </Box>
              )}

                
            {/* Chart */}
              <Box className={classes.chartBox}>  
                <Typography variant="h6" gutterBottom>
                  Standings Chart
                </Typography>
               { <Linechart />}
              </Box>
              </Box>}
        </ThemeProvider>
      );
    }      
	
