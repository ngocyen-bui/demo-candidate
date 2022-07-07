 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'  
import { createCandidate, updateCandidate } from '../features/candidate'
import { updateJobs } from '../features/job'

export const HTTP_STATUS = Object.freeze({
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
})

const namespace = 'candidates'

export const fetchCreateCandidate = createAsyncThunk(
  `${namespace}/fetchCreateCandidate`,
  async ({data,token}) => {  
    const { results } = await createCandidate(data,token); 
    return results
  }
    
)
export const fetchUpdateCandidate = createAsyncThunk(
  `${namespace}/fetchUpdateCandidate`,
  async ({id,data,token}) => {  
    let {status} = await updateCandidate(id,data,token).then(x => x);  
    return status
  }
    
)
const candidatesSlice = createSlice({
  name: namespace,
  initialState: {
    loading: null,
    data: null,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: {
    [fetchUpdateCandidate.pending](state) { 
      state.loading = HTTP_STATUS.PENDING;
    },
    [fetchUpdateCandidate.fulfilled](state, { payload }) { 
      state.loading = HTTP_STATUS.FULFILLED;
      state.data = payload;
    },
    [fetchUpdateCandidate.rejected](state, { error }) {
      state.loading = HTTP_STATUS.REJECTED;
      state.errorMessage = error.message;
    },
    [fetchCreateCandidate.pending](state) {
      state.loading = HTTP_STATUS.PENDING;
    },
    [fetchCreateCandidate.fulfilled](state, { payload }) {
      state.loading = HTTP_STATUS.FULFILLED;
      state.data = payload;
    },
    [fetchCreateCandidate.rejected](state, { error }) {
      state.loading = HTTP_STATUS.REJECTED;
      state.errorMessage = error.message;
    },
  },
}) 


export const fetchUpdateJob = createAsyncThunk(
  `jobs/fetchUpdateJob`,
  async ({id,data,token}) => {  
    let {status} = await updateJobs(id,data,token).then(x => x).catch(x => x.response);  
    return status
  }
    
)
const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    loading: null,
    data: null,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: {
    [fetchUpdateJob.pending](state) { 
      state.loading = HTTP_STATUS.PENDING;
    },
    [fetchUpdateJob.fulfilled](state, { payload }) { 
      state.loading = HTTP_STATUS.FULFILLED;
      state.data = payload;
    },
    [fetchUpdateJob.rejected](state, { error }) {
      state.loading = HTTP_STATUS.REJECTED;
      state.errorMessage = error.message;
    }, 
  },
})
export default (candidatesSlice.reducer, jobsSlice.reducer)