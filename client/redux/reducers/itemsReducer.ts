import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {featureWithTask, itemsState} from "../../types/state/items";
import {workItemType, featureType, taskType} from "../../types/api/models";

const initialState: itemsState = {
    epics: [],
    allFeatures: [],
    tasks: [],
};

export const {actions, reducer} = createSlice({
    name: "items",
    initialState,
    reducers: {
        setEpics: (state: itemsState, {payload}: PayloadAction<workItemType[]>) => {
            return {...state, epics: payload};
        },
        addEpic: (state: itemsState, {payload}: PayloadAction<workItemType>) => {
            state.epics.push(payload);
        },
        updateEpic: (state: itemsState, {payload}: PayloadAction<workItemType>) => {
            const indexToChange = state.epics.findIndex((element) => element.id === payload.id);
            state.epics[indexToChange] = payload;
        },
        setFeatures: (state: itemsState, {payload}: PayloadAction<featureType[]>) => {
            return {...state, allFeatures: payload};
        },
        addFeature: (state: itemsState, {payload}: PayloadAction<featureType>) => {
            const epicName = state.epics.find((epic) => epic.id === payload.epicId)?.name || '';
            state.allFeatures.push({...payload, epicName, tasksNumber: 0, finishedTasksNumber: 0});
        },
        updateFeature: (state: itemsState, {payload}: PayloadAction<featureType>) => {
            const indexToChange = state.allFeatures.findIndex((element) => element.id === payload.id);
            const epicName = state.epics.find((epic) => epic.id === payload.epicId)?.name || '';
            state.allFeatures[indexToChange] = {...payload, epicName};
        },
        setTasks: (state: itemsState, {payload}: PayloadAction<featureWithTask[]>) => {
            return {...state, tasks: payload};
        },
        addTask: (state: itemsState, {payload}: PayloadAction<taskType>) => {
            const indexOfFeature = state.tasks.findIndex(({id}) => id === payload.feature);
            state.tasks[indexOfFeature].tasks.push(payload);
        },
        updateTask: (state: itemsState, {payload}: PayloadAction<taskType>) => {
            const indexOfFeature = state.tasks.findIndex(({id}) => id === payload.feature);
            const indexOfTask = state.tasks[indexOfFeature].tasks.findIndex(({id}) => id === payload.id);
            state.tasks[indexOfFeature].tasks[indexOfTask] = payload;
        },
    }
});

export const {
    setEpics,
    addEpic,
    updateEpic,
    setFeatures,
    addFeature,
    updateFeature,
    setTasks,
    addTask,
    updateTask
} = actions;