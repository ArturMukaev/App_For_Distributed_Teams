import {projectRow, userModel} from "../api/models";

export interface projectState {
    userProjects: projectRow[],
    selectedProject: projectRow | null,
    usersOfProject: userModel[],
}