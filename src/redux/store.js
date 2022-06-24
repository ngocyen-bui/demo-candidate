import { configureStore } from "@reduxjs/toolkit";  
import candidatesReducer from "./reducer"

const store = configureStore({
    reducer: { 
        candidate: candidatesReducer
    }, 
})


export default store ; 