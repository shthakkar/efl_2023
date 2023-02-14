import React, { useState, useEffect} from "react";
import './style.css';
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [pass, setPass] = useState('');
    const navigate = useNavigate()
    const timestamp = new Date();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pass ==='123456'){
            localStorage.setItem('pin',pass)
            localStorage.setItem('timestamp',timestamp)
            navigate('/auction')
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