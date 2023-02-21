import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {login, logout, setLoading} from "../redux/authReducer";
import {fetchData} from "../redux/dataReducer";
import {AppState} from "../redux/store";
import {storageName} from "../helpers/helper";

export interface authType {
    loading: boolean;
    isAuthenticated: boolean;
    logoutFrom: () => void;
}

export const useAuth = (): authType => {
    // Selectors
    const isAuthenticated = !!useSelector(((state: AppState) => state.authReducer.token));
    const loading = useSelector(((state: AppState) => state.authReducer.loading));

    // Fabrics
    const dispatch = useDispatch();

    const logoutFrom = (): void => {
        dispatch(logout());
    }

    // Effects
    React.useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchData());
            console.log('data fetched');
        }
    }, [isAuthenticated]);

    React.useEffect(() => {
        const data = localStorage.getItem(storageName);

        if (data && JSON.parse(data).token) {
            dispatch(login(JSON.parse(data)));
        }
        dispatch(setLoading(false));
    }, [dispatch]);


    return {loading, isAuthenticated, logoutFrom}
}