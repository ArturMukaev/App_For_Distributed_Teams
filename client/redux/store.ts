import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import {reducer as authReducer} from "./authReducer"
import {reducer as dataReducer} from "./dataReducer"

const makeStore = () =>
    configureStore({
        reducer: {authReducer, dataReducer}
    });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;

export const wrapper = createWrapper<AppStore>(makeStore);