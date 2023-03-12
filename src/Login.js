import React, { useState,useEffect} from "react";
import './style.css';
import { useNavigate, useLocation } from 'react-router-dom'
import settings from './settings.json'
import Select from 'react-select';


export default function Login({socket}) {
    const [ipAddress, setIpAddress] = useState('');
    const [isadmin,setAdmin] = useState(false)
    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
          .then(response => response.json())
          .then(data => setIpAddress(data.ip))
          .catch(error => console.error(error));
      }, []);
    
    useEffect(() => {
        // Check if the user's IP address matches the allowed address
        if (ipAddress === '50.47.215.77' || ipAddress === '76.144.211.140') {
            setAdmin(true)
        }
        },[ipAddress]);

    const [teamowner, setTeamOwner] = useState('');
    const navigate = useNavigate()
    const timestamp = new Date();
    const location = useLocation();
    const teams = settings['setup']['teamNames']
    const [isClearable, setIsClearable] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const teamnames = teams.map(name =>{
        return{
            label:name,
            value:name
        }

    })
    const customStyles = {
        option: (provided, state) => ({
          ...provided,
          color: "black",
          backgroundColor: state.isSelected ? "#e0e0e0" : "white",
          "&:hover": {
            backgroundColor: "lightblue",
          },
        }),
      };

    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isadmin) {
            if(location.state.previousurl==='/auction'){
                socket.emit('join', { team_name: selectedOption.value });
                localStorage.setItem('teamname',selectedOption.value)
                localStorage.setItem('timestamp',timestamp)
                navigate(location.state.previousurl)
            }
            else if (location.state.previousurl==='/SetupTeams'){
                navigate(location.state.previousurl)
            }
            else if (location.state.previousurl==='/ManageTeams'){
                navigate(location.state.previousurl)
            }
            else if (location.state.previousurl==='/Draft'){
                socket.emit('join', { team_name: selectedOption.value });
                localStorage.setItem('teamname',selectedOption.value)
                navigate(location.state.previousurl)
            }      
        }
        else{
            if (location.state.previousurl==='/Draft'){
                socket.emit('join', { team_name: selectedOption.value });
                localStorage.setItem('teamname',selectedOption.value)
                navigate(location.state.previousurl)
            }
        }
    }
   
    return (
        <div className="auth-form-container">
            <h2>Please Select Team and Name</h2>
            <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="text">Teams</label>
            <div style={{display: 'inline-block',fontSize: 14,marginTop: '1em',width:"194px"}}>
            <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={selectedOption}
                isClearable={isClearable}
                isDisabled={isDisabled}
                onChange={setSelectedOption}
                options={teamnames}
                styles={customStyles}
             /></div>
                <label htmlFor="text">Name</label>
                <input value={teamowner} onChange={(e) => setTeamOwner(e.target.value)}type="text" placeholder="TeamOwnerName" id="text" name="text" />
                <button type="submit">Log In</button>
            </form>
        </div>
    )
}
