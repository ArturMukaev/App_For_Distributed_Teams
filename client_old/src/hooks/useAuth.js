import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {login, logout, setLoading} from "../redux/authReducer";
import {fetchData} from "../redux/dataReducer";

const storageName = 'userData'

export const useAuth = () =>{
    // Selectors
    const isAuthenticated = !!useSelector((state => state.authReducer.token));
    const loading = useSelector((state => state.authReducer.loading));

    // Fabrics
    const dispatch = useDispatch();

    const logoutFrom = () =>{
        dispatch(logout());
    }

    // Effects
    React.useEffect(() =>{
        if (isAuthenticated) {
            dispatch(fetchData());
            console.log('data fetched');
        }
    },[isAuthenticated]);

    React.useEffect(()=>{
        const data = JSON.parse(localStorage.getItem(storageName))

        if(data && data.token){
            dispatch(login(data));
        }
        dispatch(setLoading(false));
    },[ dispatch ]);


    return { loading, isAuthenticated, logoutFrom }
}