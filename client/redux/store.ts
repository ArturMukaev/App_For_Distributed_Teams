import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import {reducer as authReducer} from "./reducers/authReducer";
import {reducer as projectReducer} from "./reducers/projectReducer";
import {reducer as itemsReducer} from "./reducers/itemsReducer";

const makeStore = () =>
    configureStore({
        reducer: {authReducer, projectReducer, itemsReducer}
    });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;

export const wrapper = createWrapper<AppStore>(makeStore);