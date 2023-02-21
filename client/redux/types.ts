export interface authState {
    loading: boolean;
    token: string | null;
    userId: string | null;
}

export interface payloadForLogin {
    userId: string;
    token: string;
    team: string;
    role: string;
}

export interface dataState {
    team: string | null,
    users: userType[],
    role: boolean,
    features: featureType[],
    tasks: taskType[],
    loading: boolean,
}

interface workItemType {
    _id: string;
    name: string;
    state: 1 | 2 | 3 | 4 | undefined;
    description?: string;
}

export interface featureType extends  workItemType{
    team: string;
    priority: 1 | 2 | 3 | undefined;
    sprintNumber: number | undefined;
}

export interface taskType extends workItemType{
    feature: string;
    responsible: string;
    time?: number;
}

export interface teamType {
    _id: string;
    team: string;
    name: string;
    description: string;
    state: 1 | 2 | 3 | 4;
    priority: 1 | 2 | 3;
    sprintNumber: number;
}

export interface userType {
    _id: string;
    team: string;
    email: string;
    password: string;
    name: string;
    surname: string;
    fathername: string;
    role: boolean;
}

export interface payloadForData {
    features: featureType[];
    tasks: taskType[];
    users: userType[];
}