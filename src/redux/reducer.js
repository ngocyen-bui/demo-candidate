 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'  
import { createCandidate, updateCandidate } from '../features/candidate'

export const HTTP_STATUS = Object.freeze({
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
})

const namespace = 'candidates'

export const fetchCreateCandidate = createAsyncThunk(
  `${namespace}/fetchUpdateCandidate`,
  async ({data}) => {  
    const { results } = await createCandidate(data); 
    return results
  }
    
)
export const fetchUpdateCandidate = createAsyncThunk(
  `${namespace}/fetchUpdateCandidate`,
  async ({id,data}) => {  
    const { results } = await updateCandidate(id,data); 
    return results
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
      state.loading = HTTP_STATUS.PENDING
    },
    [fetchUpdateCandidate.fulfilled](state, { payload }) {
      state.loading = HTTP_STATUS.FULFILLED
      state.data = payload
    },
    [fetchUpdateCandidate.rejected](state, { error }) {
      state.loading = HTTP_STATUS.REJECTED
      state.errorMessage = error.message
    },
    [fetchCreateCandidate.pending](state) {
      state.loading = HTTP_STATUS.PENDING
    },
    [fetchCreateCandidate.fulfilled](state, { payload }) {
      state.loading = HTTP_STATUS.FULFILLED
      state.data = payload
    },
    [fetchCreateCandidate.rejected](state, { error }) {
      state.loading = HTTP_STATUS.REJECTED
      state.errorMessage = error.message
    },
  },
})

export default candidatesSlice.reducer