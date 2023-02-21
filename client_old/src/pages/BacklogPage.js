import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import {Loader} from "../components/Loader";
import {ModalWindow} from "../components/Modal";
import {useHttp} from "../hooks/UseHTTP";
import {useMessage} from "../hooks/useMessage";
import {featureChanged, featureAdd} from "../redux/dataReducer";
import "../styles/backlog.css"


export const stateMap = () => {
    const mapa = new Map();
    mapa.set(1, 'Предложено');
    mapa.set(2, 'Активно');
    mapa.set(3, 'Решено');
    mapa.set(4, 'Закрыто');
    return mapa;
}

export const priorityMap = () => {
    const mapa = new Map();
    mapa.set(1, 'Низкий');
    mapa.set(2, 'Средний');
    mapa.set(3, 'Высокий');
    return mapa;
}

export const BacklogPage = () => {
    // ** Selectors **
    const features = useSelector((state => state.dataReducer.features));
    const loading1 = useSelector((state => state.dataReducer.loading));
    const team1 = useSelector((state => state.dataReducer.team));
    const role = useSelector((state => state.dataReducer.role));

    // **  **

    const {loading, error, request,clearError} = useHttp();
    const message = useMessage();
    const dispatch = useDispatch();

    const initialState = {
        _id: '',
        team: team1,
        name: '',
        description: '',
        state: '',
        priority: '',
        sprintNumber: ''
    };

    // ** State **
    const [modal, setModal] = useState(false);
    const [modalData, setModalData] = useState(initialState);
    // **  **

    // ** Effects **
    useEffect(()=>{
        message(error)
        clearError()
    },[error,message,clearError]);

    useEffect(()=>{
        setModalData({...modalData, team: team1});
    },[team1]);
    // **  **

    // ** Handlers **
    const addHandler = () => {
        setModalData(initialState);
        setModal(true);
    }
    const changeHandler = (item) => {
        setModalData(item);
        setModal(true);
    }
    const saveHandler = async (data) => {
        try {
            const data1 = await request('/api/feature/add', 'POST', {...data});
            setModal(false);
            if (data1?.feature) {
                dispatch(featureAdd(data1.feature));
            } else {
                dispatch(featureChanged(data));
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
                isFeature={true}
                featureProps={modalData}
                taskProps={null}
                save={saveHandler}
                users={null}
                features={null}
            />}
        <table>
            <thead>
            <tr>
                <th className="first">Требование</th>
                <th>Описание</th>
                <th>Статус</th>
                <th>Приоритет</th>
                <th>Спринт</th>
                <th> </th>
            </tr>
            </thead>

            <tbody>
            {features.map((item) => {

                return (
                    <tr key={item._id}>
                        <td className="first">{item.name}</td>
                        <td>{item.description}</td>
                        <td>{stateMap().get(Number(item.state))}</td>
                        <td>{priorityMap().get(Number(item.priority))}</td>
                        <td>{item.sprintNumber}</td>
                        <th><button
                            className="btn amber darken-1"
                            disabled={loading1 || !role}
                            onClick={(event) => {
                                event.preventDefault();
                                changeHandler(item);
                            }}
                        >Редактировать
                        </button></th>
                    </tr>
                );
            })}
            <tr>
                <td className="first">
                    <button
                    className="btn btn-enter light-green accent-4"
                    disabled={loading1 || !role}
                    onClick={addHandler}
                    >
                        Добавить требование
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
            </>
    )
}