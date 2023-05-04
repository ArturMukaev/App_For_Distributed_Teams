import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {projectState} from "../../types/state/project";
import {projectRow, RoleInProject, userModel} from "../../types/api/models";
import {storageProjectInfo} from "../../helpers/helper";

const initialState : projectState = {
    userProjects: [],
    selectedProject: null,
    usersOfProject: [],
};

export const {actions, reducer} = createSlice({
    name: "project",
    initialState,
    reducers: {
        setUserProjects: (state : projectState, { payload } : PayloadAction<projectRow[]>) => {
            return {...state, userProjects: payload};
        },
        setProjectUsers: (state : projectState, { payload } : PayloadAction<userModel[]>) => {
            return {...state, usersOfProject: payload};
        },
        updateUsers: (state : projectState, { payload } : PayloadAction<userModel>) => {
            const indexOfUser = state.usersOfProject.findIndex((el) => el.id === payload.id);
            if (payload.role === RoleInProject.Leader) {
                if (state.selectedProject) {
                    state.selectedProject.leader = payload.name;
                    state.selectedProject.leaderId = payload.id;
                    state.selectedProject.role = RoleInProject.Worker;
                    localStorage.setItem(storageProjectInfo,JSON.stringify(state.selectedProject));
                }
            }
            state.usersOfProject[indexOfUser] = payload;
        },
        addUserToProject: (state : projectState, { payload } : PayloadAction<userModel>) => {
            if (payload.role === RoleInProject.Leader) {
                if (state.selectedProject) {
                    state.selectedProject.leader = payload.name;
                    state.selectedProject.leaderId = payload.id;
                    state.selectedProject.role = RoleInProject.Worker;
                    localStorage.setItem(storageProjectInfo,JSON.stringify(state.selectedProject));
                }
            }
            state.usersOfProject.push(payload);
        },
        addProject: (state : projectState, { payload } : PayloadAction<projectRow>) => {
            state.userProjects.push(payload);
        },
        setSelectedProject: (state : projectState, { payload } : PayloadAction<projectRow>) => {
            localStorage.setItem(storageProjectInfo,JSON.stringify(payload));
            return {...state, selectedProject: payload};
        },
    }
});

export const { setUserProjects, addProject, setSelectedProject, setProjectUsers, updateUsers, addUserToProject } = actions;