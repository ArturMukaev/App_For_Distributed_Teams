import {configureStore} from "@reduxjs/toolkit";
import {reducer as authReducer} from "./authReducer"
import {reducer as dataReducer} from "./dataReducer"

export const store = configureStore({
    reducer: { authReducer, dataReducer }
})