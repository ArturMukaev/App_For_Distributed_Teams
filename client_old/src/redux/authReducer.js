import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    loading: true,
    token: null,
    userId: null,
};

const storageName = 'userData'

export const {actions, reducer} = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, { payload }) => {
            const { userId, token, team, role } = payload;
            state.token = token;
            state.userId = userId;
            localStorage.setItem(storageName,JSON.stringify({ userId, token, team, role }));
        },
        logout: (state) => {
            state.token = null;
            state.userId = null;
            localStorage.removeItem(storageName)
        },
        setLoading: (state, { payload }) => {
            state.loading = payload;
        }
    }
});

export const {login, logout, setLoading } = actions;
