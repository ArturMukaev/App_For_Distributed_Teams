import {FeatureType, featureType, StateOfWI, taskType, workItemType} from "../api/models";

export interface featureWithTask {
    id: string;
    name: string;
    state: StateOfWI;
    type: FeatureType;
    tasks: taskType[];
}

export interface itemsState {
    epics: workItemType[],
    allFeatures: featureType[],
    tasks: featureWithTask[],
}