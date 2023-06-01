export interface projectModel {
    id: string,
    name: string,
    description: string,
    imageSrc: string,
    position: number,
}

export interface projectRow extends projectModel {
    leader: string,
    leaderId: string,
    role?: RoleInProject,
    sprint?: number,
}

export interface userModel {
    id: string;
    email: string;
    name: string;
    role: RoleInProject;
}

export enum RoleInProject {
    Customer = "Заказчик",
    Worker = "Исполнитель",
    Leader = "Руководитель",
}

export enum StateOfWI {
    Proposed = "Предложено",
    Active = "Активно",
    Resolved = "Решено",
    Closed = "Закрыто",
}

export enum Priority {
    Low = "Низкий",
    Medium = "Средний",
    High = "Высокий",
    Critical = "Критичный",
}

export enum FeatureType {
    Bug = "Баг",
    Feature = "Требование",
}

export enum LikelyHood {
    Rare = "Мизерная",
    Unlikely = "Маленькая",
    Moderate = "Средняя",
    Likely = "Высокая",
    Certain = "Несомненная",
}

export const LikelyHoodMap = {
    1: LikelyHood.Rare,
    2: LikelyHood.Unlikely,
    3: LikelyHood.Moderate,
    4: LikelyHood.Likely,
    5: LikelyHood.Certain,
} as const;

export enum Consequence {
    Insignificant = "Незначительный",
    Minor = "Небольшой",
    Moderate = "Средний",
    Major = "Высокий",
    Catastrophic = "Катастрофический",
}

export const ConsequenceMap = {
    1: Consequence.Insignificant,
    2: Consequence.Minor,
    3: Consequence.Moderate,
    4: Consequence.Major,
    5: Consequence.Catastrophic,
} as const;

export const PriorityMap = {
    [Priority.Low]: 0,
    [Priority.Medium]: 1,
    [Priority.High]: 2,
    [Priority.Critical]: 3,
} as const;

export const StateMap = {
    [StateOfWI.Proposed]: 0,
    [StateOfWI.Active]: 1,
    [StateOfWI.Resolved]: 2,
    [StateOfWI.Closed]: 3,
} as const;

export interface workItemType {
    id: string,
    name: string,
    description: string,
    state: StateOfWI,
}

export interface featureType extends workItemType {
    priority: Priority;
    sprintNumber: number;
    type: FeatureType;
    mark: number;
    minMark: number;
    maxMark: number;
    epicId: string;
    epicName: string,
    tasksNumber?: number,
    finishedTasksNumber?: number
}

export interface taskType extends workItemType {
    responsible: string;
    time: number;
    feature?: string;
}

export interface projectInfo {
    bugsMarks?: {
        total: number,
        finished: number,
    };
    featuresMarks?: {
        total: number,
        finished: number,
    };
    finishedBugs?: number;
    finishedFeatures?: number;
    finishedEpics?: number;
    lastSprint?: number;
    totalBugs?: number;
    totalEpics?: number;
    totalFeatures?: number
    usersCount?: number;
}

export interface riskType {
    id: string;
    name: string;
    description: string;
    epic: string;
    likelyHood: number;
    consequence: number
    solution: string;
    responsible: string;
}