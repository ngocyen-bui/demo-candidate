import { createSlice } from "@reduxjs/toolkit";



export const filtersSlice = createSlice({
    name: 'filters',
    initialState:{
        searchID: '',
        searchName:'',
        searPrioriry: '',
    },
    reducers:{
        searchFilterChange: (state,action) =>{
            state.searchID = action.payload;
        }
    }
}) 

export const listCandidateSlice = createSlice({
    name: 'listCandidate',
    initialState: [],
    reducers: { 
        addListCandidate: (state,action) =>{
            state.push(action.payload) 
        },
        addCandidate: (state,action) =>{
            state.push(action.payload);
        },
        editCandidate: (state,action) =>{
            
        }
    }
})


export const {addCandidate, editCandidate,addListCandidate} = listCandidateSlice.render;