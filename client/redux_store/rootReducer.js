import { combineReducers } from "@reduxjs/toolkit";
import stateReducer from "./slices/stateSlice";

const rootReducer = combineReducers({
    state: stateReducer,
})

export default rootReducer;