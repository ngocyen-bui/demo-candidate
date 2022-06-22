import { configureStore } from "@reduxjs/toolkit";
import { filtersSlice, listCandidateSlice } from "./reducer";


const store = configureStore({
    reducer: {
        filter: filtersSlice.reducer ,
        listCandidate: listCandidateSlice.reducer
    }
})


export default store ;

