import {AppState} from "./store";
import {authState} from "../types/state/auth";
import {projectRow, userModel, workItemType, featureType} from "../types/api/models";
import {featureWithTask} from "../types/state/items";

export const selectors = {
    isAuthenticated: (state: AppState): boolean => !!state.authReducer.token,
    userName: (state: AppState): string | null => state.authReducer.name,
    user: (state: AppState): authState => state.authReducer,
    userProjects: (state: AppState): projectRow[] => state.projectReducer.userProjects,
    usersOfProject: (state: AppState): userModel[] => state.projectReducer.usersOfProject,
    selectedProject: (state: AppState): projectRow | null => state.projectReducer.selectedProject,
    epics: (state: AppState): workItemType[] => state.itemsReducer.epics,
    features: (state: AppState): featureType[] => state.itemsReducer.allFeatures,
    tasks: (state: AppState): featureWithTask[] => state.itemsReducer.tasks,
}