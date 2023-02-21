import {useHttp} from "../hooks/UseHTTP";
import React, {useState,useEffect, useCallback} from 'react'
import {useMessage} from "../hooks/useMessage";
import {Loader} from "../components/Loader";
import {useNavigate} from 'react-router-dom'
import '../styles/auth.css';

export const RegisterPage = () => {
    const message = useMessage();
    const {loading, error, request,clearError} = useHttp();
    const navigate = useNavigate();

    // ** State **

    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        surname: '',
        fatherName: '',
        team: '',
        role: false,
    });
    const [teamForm, setTeamForm] = useState({
        name: '',
        description: '',
    })
    const [teams, setTeams] = useState([]);
    const [newTeam, setNewTeam] = useState(false);

    // ** **

    const fetchTeams = useCallback(async () =>{
        try {
            const fetched = await request('/api/team','GET',null);
            setTeams(fetched);
        }catch (e) {

        }
    },[request]);

    // ** Effects **

    useEffect(()=>{
        fetchTeams()
    },[fetchTeams]);

    useEffect(()=>{
        message(error)
        clearError()
    },[error,message,clearError]);

    useEffect(() =>{
        window.M.updateTextFields()
    },[]);

    // ** **


    // ** Handlers **
    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }
    const changeHandler1 = event => {
        setTeamForm({...teamForm, [event.target.name]: event.target.value})
    }
    const registerHandler = async () => {
        try {
            if (newTeam) {
                const data1 = await request('/api/team/add', 'POST', {...teamForm});
                message(data1.message);
                const data2 = await request('/api/auth/register', 'POST', {...form,
                    team: teamForm.name,
                    role: true
                });
                message(data2.message)
            } else {
                const data = await request('/api/auth/register', 'POST', {...form})
                message(data.message)
            }
            navigate('/');
        } catch (e) {

        }
    }
    const changeTeamHandler = event =>{
        event.preventDefault();
        setNewTeam(prevState => !prevState);
    }

    // ** **


    if(loading){
        return < Loader/>
    }

    return (
        <div className="container paddings">
            <div className="card">
                <div className="card-header">
                    <h1>Регистрация</h1>
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
                        <div className="mb-3">
                            <label htmlFor="exampleInputName" className="form-label">Фамилия</label>
                            <input
                                type="text"
                                className="form-control"
                                id="surname"
                                placeholder="Введите фамилию"
                                name="surname"
                                value={form.surname}
                                onChange={changeHandler}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputName1" className="form-label">Имя</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Введите имя"
                                name="name"
                                value={form.name}
                                onChange={changeHandler}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputFather" className="form-label">Отчество</label>
                            <input
                                type="text"
                                className="form-control"
                                id="fatherName"
                                placeholder="Введите отчество"
                                name="fatherName"
                                value={form.fatherName}
                                onChange={changeHandler}
                            />
                        </div>
                        {newTeam ?
                            <div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputName2" className="form-label">Название команды</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="teamName"
                                        placeholder="Введите имя команды"
                                        name="name"
                                        value={teamForm.name}
                                        onChange={changeHandler1}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputDescription" className="form-label">Краткое описание команды</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="description"
                                        placeholder="Введите описание команды"
                                        name="description"
                                        value={teamForm.description}
                                        onChange={changeHandler1}
                                    />
                                </div>
                            </div>
                             :
                            <div className="mb-3">
                            <label htmlFor="exampleInputFather" className="form-label">Команда</label>
                            <div className="input-field">
                                <select defaultValue="" name="team" onChange={changeHandler}>
                                    <option value="" disabled>Выберите команду</option>
                                    {teams.map((team) => <option value={team.name}>{team.name}</option>
                                    )}
                                </select>
                            </div>
                        </div> }

                        <button
                            type="submit"
                            className="btn btn-success"
                            onClick={registerHandler}
                            disabled={loading}
                        >Зарегистрироваться
                        </button>
                        <button
                            className="btn teal darken-4"
                            onClick={changeTeamHandler}
                            disabled={loading}
                        >{!newTeam? "Добавить новую команду" : "Выбрать существующую команду"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}