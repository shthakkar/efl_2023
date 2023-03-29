import React, { useState} from "react";
import './style.css';
import { useNavigate, useLocation } from 'react-router-dom'

export default function Login() {
    const [pass, setPass] = useState('');
    const navigate = useNavigate()
    const timestamp = new Date();
    const location = useLocation();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pass ==='123456') {
            if(location.state.previousurl==='/auction'){
                localStorage.setItem('pin',pass)
                localStorage.setItem('timestamp',timestamp)
                navigate(location.state.previousurl)
            }
            else if (location.state.previousurl==='/SetupTeams'){
                navigate(location.state.previousurl)
            }
            else if (location.state.previousurl==='/ManageTeams'){
                navigate(location.state.previousurl)
            }   

        }
    }

    return (
        <div className="auth-form-container">
            <h2>Please Enter Admin PIN</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="password">PIN</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <button type="submit">Log In</button>
            </form>
        </div>
    )
}
