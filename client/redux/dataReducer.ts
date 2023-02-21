import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {dataState, featureType, payloadForData, taskType, userType} from "./types";
import {storageName} from "../helpers/helper";

const initialState: dataState = {
    team: null,
    users: [],
    role: false,
    features: [],
    tasks: [],
    loading: true,
};

export const fetchData = createAsyncThunk(
    'data/fetchData',
    async () => {
        const fetchedFeatures = await fetch('/api/feature');
        const fetchedTasks = await fetch('/api/task');
        const fetchedUsers = await fetch('/api/auth');
        const data1 = await fetchedFeatures.json();
        const data2 = await fetchedTasks.json();
        const data3 = await fetchedUsers.json();
        return {features: data1, tasks: data2, users: data3};
    }
);

export const {actions, reducer} = createSlice({
    name: "data",
    initialState,
    reducers: {
        featureChanged: (state: dataState, {payload}: PayloadAction<featureType>): void => {
            state.features = state.features.map((item) => {
                if (item._id === payload._id) return payload;
                return item;
            })
        },
        featureAdd: (state: dataState, {payload}: PayloadAction<featureType>): void => {
            state.features.push(payload);
        },
        taskChanged: (state: dataState, {payload}: PayloadAction<taskType>): void => {
            state.tasks = state.tasks.map((item) => {
                if (item._id === payload._id) return payload;
                return item;
            })
        },
        taskAdd: (state: dataState, {payload}: PayloadAction<taskType>): void => {
            state.tasks.push(payload);
        },
    }, extraReducers: ((builder: any) => {
        builder
            .addCase(fetchData.fulfilled, (state: dataState, {payload}: PayloadAction<payloadForData>): void => {
                const {features, tasks, users} = payload;
                const storage = localStorage.getItem(storageName);
                if (!storage) return;
                const team = JSON.parse(storage)?.team;
                state.team = team;
                state.role = JSON.parse(storage)?.role;
                state.features = features.filter((item: featureType) => item.team === team);
                state.users = users.filter((item: userType) => item.team === team);
                state.tasks = tasks;
                state.loading = false;
            })
    })
});


export const {featureChanged, featureAdd, taskChanged, taskAdd} = actions;