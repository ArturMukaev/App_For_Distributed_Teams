import {useHttp} from "../hooks/UseHTTP";
import React, {useState,useEffect} from 'react'
import {useMessage} from "../hooks/useMessage";
import { login } from '../redux/authReducer'
import { useDispatch} from "react-redux";
import { NavLink } from 'react-router-dom';
import '../styles/auth.css';

export const AuthPage = () => {
    const message = useMessage();
    const dispatch = useDispatch();
    const {loading, error, request,clearError} = useHttp();
    const [form, setForm] = useState({
        email: '', password: ''
    })

    useEffect(()=>{
        message(error)
        clearError()
    },[error,message,clearError]);

    useEffect(() =>{
        window.M.updateTextFields()
    },[]);

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value});
    };

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            dispatch(login(data));
        } catch (e) {

        }
    }
    return (
        <div className="container paddings">
            <div className="card">
                <div className="card-header">
                    <h1>Авторизация</h1>
                </div>
                <div className="card-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Адрес почты:</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                placeholder="Введите email"
                                value={form.email}
                                onChange={changeHandler}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Пароль</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Введите пароль"
                                name="password"
                                value={form.password}
                                onChange={changeHandler}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-enter light-green accent-4"
                            disabled={loading}
                            onClick={loginHandler}
                        >Войти
                        </button>
                        <NavLink to="/register" className="btn btn-register">Зарегистрироваться</NavLink>
                    </form>
                </div>
            </div>
        </div>
    )
}