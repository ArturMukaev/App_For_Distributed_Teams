import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState = {
    team: null,
    users: [],
    role: false,
    features: [],
    tasks: [],
    loading: true,
};

const storageName = 'userData'

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
        featureChanged: (state, { payload }) => {
            state.features = state.features.map((item)=>{
                if (item._id === payload._id) return payload;
                return item;
            })
        },
        featureAdd: (state, { payload }) => {
            state.features.push(payload);
        },
        taskChanged: (state, { payload }) => {
            state.tasks = state.tasks.map((item)=>{
                if (item._id === payload._id) return payload;
                return item;
            })
        },
        taskAdd: (state, { payload }) => {
            state.tasks.push(payload);
        },
    }, extraReducers: (builder => {
    builder
        .addCase(fetchData.fulfilled, (state, { payload }) => {
            const { features, tasks, users } = payload;
            const team = JSON.parse(localStorage.getItem(storageName))?.team;
            state.team = team;
            state.role = JSON.parse(localStorage.getItem(storageName))?.role;
            state.features = features.filter((item) => item.team === team );
            state.users = users.filter((item) => item.team === team );
            state.tasks = tasks;
            state.loading = false;
        })
    })
});


export const { featureChanged, featureAdd, taskChanged, taskAdd } = actions;
