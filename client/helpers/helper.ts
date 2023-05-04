import {toast} from "react-toastify";
import {StateOfWI, taskType} from "../types/api/models";

export const storageName = 'userData';
export const storageProjectInfo = 'selectedProject';
export const serverUrl = "http://77.223.98.128/:5000";

export const notify = (text: string, error: boolean) => {
    const options = {
        position: "bottom-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
    };
    if (!error) {
        // @ts-ignore
        toast.success(text, options);
    } else {
        // @ts-ignore
        toast.error(text, options);
    }
}

export const sortTasks = (tasks: taskType[]) => {
    return tasks.reduce((acc, value) => {
        // @ts-ignore
        acc[value.state].push(value);
        return acc;
    }, {
        [StateOfWI.Proposed]: [] as taskType[],
        [StateOfWI.Active]: [] as taskType[],
        [StateOfWI.Resolved]: [] as taskType[],
        [StateOfWI.Closed]: [] as taskType[],
    });
}