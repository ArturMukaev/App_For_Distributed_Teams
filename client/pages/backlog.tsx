import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {withLayout} from "../layout/Layout";
import {useHttp} from "../hooks/useHTTP";
import {notify} from "./_app";
import {AppState} from "../redux/store";
import {Loader} from "../components/Loader/Loader";
import {CenterContainer} from "../helpers/containers";
import {featureAdd, featureChanged} from "../redux/dataReducer";
import {featureType} from "../redux/types";
import {priorityMap, stateMap, buttonType} from "../helpers/helper";
import {StyledBacklog} from "../layout/styled";
import {Button} from "../components/controls/Button/Button";

const Backlog = (): JSX.Element => {
    // ** Selectors **
    const features = useSelector(((state: AppState) => state.dataReducer.features));
    const isLoading = useSelector(((state: AppState) => state.dataReducer.loading));
    const currentTeam = useSelector(((state: AppState) => state.dataReducer.team));
    const role = useSelector(((state: AppState) => state.dataReducer.role));
    // **  **

    // ** Fabrics **
    const {loading, error, request, clearError} = useHttp();
    const dispatch = useDispatch();

    const initialState: featureType = {
        _id: '',
        team: currentTeam,
        name: '',
        description: '',
        state: null,
        priority: null,
        sprintNumber: null,
    };
    // **  **

    // ** State **
    const [modal, setModal] = useState(false);
    const [modalData, setModalData] = useState(initialState);
    // **  **

    // ** Effects **
    useEffect(() => {
        error && notify(error)
        clearError()
    }, [error, notify, clearError]);

    useEffect(() => {
        setModalData({...modalData, team: currentTeam});
    }, [currentTeam]);
    // **  **

    // ** Handlers **
    const addHandler = () => {
        setModalData(initialState);
        setModal(true);
    }
    const changeHandler = (item: featureType) => {
        setModalData(item);
        setModal(true);
    }
    const saveHandler = async (data: featureType) => {
        try {
            const receivedData = await request('/api/feature/add', 'POST', {...data});
            setModal(false);
            if (receivedData?.feature) {
                dispatch(featureAdd(receivedData.feature));
            } else {
                dispatch(featureChanged(data));
            }
            notify(receivedData?.message);
        } catch (e) {

        }
    }
    // **  **

    if (isLoading || loading) {
        return (
            <CenterContainer>
                <Loader/>
            </CenterContainer>
        );
    }

    return (
        <>
            {/*{modal && <ModalWindow*/}
            {/*    isOpen={modal}*/}
            {/*    closeModal={() => {setModal(false)}}*/}
            {/*    isFeature={true}*/}
            {/*    featureProps={modalData}*/}
            {/*    taskProps={null}*/}
            {/*    save={saveHandler}*/}
            {/*    users={null}*/}
            {/*    features={null}*/}
            {/*/>}*/}
            <StyledBacklog>
                <thead>
                <tr>
                    <th>Требование</th>
                    <th>Описание</th>
                    <th>Статус</th>
                    <th>Приоритет</th>
                    <th>Спринт</th>
                    <th></th>
                </tr>
                </thead>

                <tbody>
                {features.map((item: featureType) => {

                    return (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{stateMap().get(Number(item.state))}</td>
                            <td>{priorityMap().get(Number(item.priority))}</td>
                            <td>{item.sprintNumber}</td>
                            <td>
                                <Button
                                    appearance='warning'
                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                        event.preventDefault();
                                        changeHandler(item);
                                    }}
                                    disabled={isLoading || !role}
                                >Редактировать
                                </Button>
                            </td>
                        </tr>
                    );
                })}
                <tr>
                    <td>
                        <Button
                            appearance='success'
                            onClick={addHandler}
                            disabled={isLoading || !role}
                        >
                            Добавить требование
                        </Button>
                    </td>
                </tr>
                </tbody>
            </StyledBacklog>
        </>
    )
}

export default withLayout(Backlog);
