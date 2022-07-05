import { configureStore } from "@reduxjs/toolkit";  
import candidatesReducer from "./reducer" 
import jobsReducer from "./reducer" 

const store = configureStore({
    reducer: { 
        candidate: candidatesReducer,
        job: jobsReducer
    }, 
})


export default store ; 