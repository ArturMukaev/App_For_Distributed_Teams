import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {authState, payloadForLogin} from "./types";
import {storageName} from "../helpers/helper";

const initialState : authState = {
    loading: true,
    token: null,
    userId: null,
};

export const {actions, reducer} = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state : authState, { payload } : PayloadAction<payloadForLogin>) : void => {
            const { userId, token, team, role } = payload;
            state.token = token;
            state.userId = userId;
            localStorage.setItem(storageName,JSON.stringify({ userId, token, team, role }));
        },
        logout: (state : authState) : void => {
            state.token = null;
            state.userId = null;
            localStorage.removeItem(storageName)
        },
        setLoading: (state : authState, { payload } : PayloadAction<boolean>) : void => {
            state.loading = payload;
        }
    }
});

export const {login, logout, setLoading } = actions;