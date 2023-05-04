import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {storageName, storageProjectInfo} from "../../helpers/helper";
import {authState} from "../../types/state/auth";

const initialState : authState = {
    token: null,
    userId: null,
    name: null,
};

export const {actions, reducer} = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state : authState, { payload } : PayloadAction<authState>) => {
            localStorage.setItem(storageName,JSON.stringify(payload));
            return {...payload};
        },
        logout: (state : authState) => {
            localStorage.removeItem(storageName);
            localStorage.removeItem(storageProjectInfo);
            return {...initialState};
        },
    }
});

export const {login, logout } = actions;