import React, { useState} from "react";
import './style.css';
import { useNavigate } from 'react-router-dom'

export default function LoginToSetup() {
    const [passcode, setPasscode] = useState('');
    const navigate = useNavigate()
    const logintimestamp = new Date();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passcode ==='987654'){
            navigate('/SetupTeams')
        }
    }

    return (
        <div className="auth-form-container">
            <h2>Please Enter Admin PIN To Setup Teams</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="password">PIN</label>
                <input value={passcode} onChange={(e) => setPasscode(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <button type="submit">Log In</button>
            </form>
        </div>
    )
}