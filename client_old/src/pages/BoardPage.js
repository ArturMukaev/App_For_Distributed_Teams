import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "../hooks/UseHTTP";
import {useMessage} from "../hooks/useMessage";
import {taskAdd, taskChanged} from "../redux/dataReducer";
import {Loader} from "../components/Loader";
import {Card} from "../components/Card"
import {ModalWindow} from "../components/Modal";
import "../styles/board.css"

export const BoardPage = () => {
// ** Selectors **
    const features = useSelector((state => state.dataReducer.features));
    const tasks = useSelector((state => state.dataReducer.tasks));
    const loading1 = useSelector((state => state.dataReducer.loading));
    const users = useSelector((state => state.dataReducer.users));

    // **  **

    const {loading, error, request,clearError} = useHttp();
    const message = useMessage();
    const dispatch = useDispatch();
    const initialState = {
        _id: '',
        name: '',
        description: '',
        state: '',
        feature: '',
        responsible: '',
        time: 0
    };

    // ** State **
    const [modal, setModal] = useState(false);
    const [sprint, setSprint] = useState(0);
    const [modalData, setModalData] = useState(initialState);
    // **  **

    // ** Effects **
    useEffect(()=>{
        message(error)
        clearError()
    },[error,message,clearError]);


    // ** Handlers **
    const addHandler = (feature) => {
        setModalData({...initialState, feature: feature._id});
        setModal(true);
    }
    const changeHandler = (item) => {
        setModalData(item);
        setModal(true);
    }
    const filterFeaturesHandler = event => {
        if (event.target.value < 0) {
            message("Введите не отрицательное значение");
            return
        }
        setSprint(Number(event.target.value));
    }
    const saveHandler = async (data) => {
        try {
            const data1 = await request('/api/task/add', 'POST', {...data});
            setModal(false);
            if (data1?.task) {
                dispatch(taskAdd(data1.task));
            } else {
                dispatch(taskChanged(data));
            }
            message(data1.message);
        } catch (e) {

        }
    }

    // **  **


    if(loading1 || loading){
        return < Loader/>
    }
    return (
        <>
            {modal && <ModalWindow
                isOpen={modal}
                closeModal={() => {setModal(false)}}
                isFeature={false}
                featureProps={null}
                taskProps={modalData}
                save={saveHandler}
                users={users}
            />}
            <nav>
                <div className="nav-wrapper blue darken-1">
                    <ul id="nav-mobile" className="center hide-on-med-and-down">
                        <li className="sprint">Спринт : </li>
                        <li><input
                            type="number"
                            placeholder="Введите спринт"
                            name="sprintNumber"
                            value={sprint}
                            onChange={filterFeaturesHandler}
                        /></li>
                    </ul>
                </div>
            </nav>
        <table>
            <thead>
            <tr>
                <th className="first">Требование</th>
                <th>Предложено</th>
                <th>Активно</th>
                <th>Решено</th>
                <th>Закрыто</th>
            </tr>
            </thead>

            <tbody>
            {features.filter((item) => sprint === 0 || item.sprintNumber === sprint).map((feature) => {
                return (
                        <tr>
                            <td className="first"><Card
                                name={feature.name}
                                isFeature={true}
                                description={feature.description}
                                state={feature.state}
                                addTask={() => {addHandler(feature)}}
                            /></td>


                            <td className="other">{tasks.filter((task) => task.feature === feature._id && Number(task.state) === 1)
                                .map((task1) => {
                                    return (
                                        <Card
                                            name={task1.name}
                                            isFeature={false}
                                            state={task1.state}
                                            responsible={users.find((user) => user._id === task1.responsible)?.surname}
                                            time={task1.time}
                                            onEdit={() => {changeHandler(task1)}}
                                        />
                                    )
                                })}</td>
                            <td className="other">{tasks.filter((task) => task.feature === feature._id && Number(task.state) === 2)
                                .map((task1) => {
                                    return (
                                        <Card
                                            name={task1.name}
                                            isFeature={false}
                                            state={task1.state}
                                            responsible={users.find((user) => user._id === task1.responsible)?.surname}
                                            time={task1.time}
                                            onEdit={() => {changeHandler(task1)}}
                                        />
                                    )
                                })}</td>
                            <td className="other">{tasks.filter((task) => task.feature === feature._id && Number(task.state) === 3)
                                .map((task1) => {
                                    return (
                                        <Card
                                            name={task1.name}
                                            isFeature={false}
                                            state={task1.state}
                                            responsible={users.find((user) => user._id === task1.responsible)?.surname}
                                            time={task1.time}
                                            onEdit={() => {changeHandler(task1)}}
                                        />
                                    )
                                })}</td>
                            <td className="other">{tasks.filter((task) => task.feature === feature._id && Number(task.state) === 4)
                                .map((task1) => {
                                    return (
                                        <Card
                                            name={task1.name}
                                            isFeature={false}
                                            state={task1.state}
                                            responsible={users.find((user) => user._id === task1.responsible)?.surname}
                                            time={task1.time}
                                            onEdit={() => {changeHandler(task1)}}
                                        />
                                    )
                                })}</td>
                        </tr>
                    )
            })}
            </tbody>
        </table>
            </>
    )
}