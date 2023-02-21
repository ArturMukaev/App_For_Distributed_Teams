import React from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import { useAuth } from "../hooks/useAuth";
import "../styles/navbar.css"
import 'materialize-css'

export const NavBar = () =>{
    const { logoutFrom } = useAuth();
    const navigate = useNavigate();

    const logoutHandler = event =>{
        event.preventDefault();
        logoutFrom();
        navigate('/');
    }

    return(
        <>
        <nav>
            <div className="nav-wrapper blue darken-1">
                <span className="brand-logo">TeamWork</span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink className="NavLink" to="/board">Доска задач</NavLink></li>
                    <li><NavLink className="NavLink" to="/backlog">Бэклог</NavLink></li>
                    <li><a href="/" className="NavLink" onClick={logoutHandler}>Выйти</a></li>
                </ul>
            </div>
        </nav>
            </>
    )
}