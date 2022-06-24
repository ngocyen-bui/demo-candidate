import { createSlice } from "@reduxjs/toolkit";
import { createCandidate, updateCandidate } from "../features/candidate";
const cv = (x) => {
    if (x.toString().length < 2) {
      return "0" + x;
    }
    return x;
  }; 
const result = (obj) => {
    let listPhone = obj?.phones?.map((e) => {
      let key = e?.countryCode || "+84";
      return {
        number: Number(e?.phone),
        current: -1,
        phone_code: {
          key: Number(key.slice(1)),
        },
      };
    });
    let listEmail = obj?.emails?.map((e) => {
      return e.email;
    });    
    let nation = obj?.nationality?.map((n) => {
      if(typeof(n) === 'object') {
        return n
      }
      return {key: n}
    }) 
    let highest_education = {key: obj?.highest_education}
  
    if(typeof(obj?.highest_education) === 'object'){
      highest_education = obj?.highest_education
    }
    let result =  {
      nationality: [...nation],
      middle_name: obj?.middleName,
      highest_education: highest_education,
      dob:
        (obj?.year ? obj?.year + "-" : "") +
        (obj?.month ? cv(obj?.month) + "-" : "") +
        (obj?.date ? cv(obj?.date) : ""),
      full_name:
        (obj?.firstName ? obj?.firstName + " " : "") +
        (obj?.month ? obj?.month + " " : "") +
        (obj?.lastName ? obj?.lastName : ""),
      relocating_willingness: obj?.readyToMove,
      first_name: obj?.firstName,
      last_name: obj?.lastName,
      phones: listPhone,
      emails: listEmail,
      current_emails: [],
      addresses:  obj?.addresses,
      gender: obj?.gender,
      martial_status: obj?.martialStatus,
      source: obj?.source,
      priority_status: obj?.primaryStatus,
      management_years: obj?.yearOfManagement,
      industry_years: obj?.yearOfServices,
      type: 3,
    };
    if(result.dob === ""){
      delete result.dob;
    }
    return result;
  };
  // unWrapper 
// const addCandidate = (values)=>{
//     let result = result(values); 
//     createCandidate(result(values)).then(res =>res);  
// }
// const modifyCandidate = (value,id)=>{
//     let result = result(value);
//     updateCandidate(id, result(value)).then(res =>res); 
// }

// Create Slice combine the actions, initialState, and reducer into 1 function
const candidatesSlice = createSlice({
  name: "Candidates",
  initialState: {
    id:0,
    data: []
  },
  reducers: {
    // Action increment
    increment: (state, action) => {  
        state.data.push(action.payload);
        // addCandidate(action.payload)
    },
    // Action decrement
    decrement: (state,action) => {        
        state.id = action.payload.id;
        state.data.push(action.payload);
    }, 
  }
});

// Export actions
export const { increment, decrement, incrementByAmount } = candidatesSlice.actions;

// Export reducer
export default candidatesSlice.reducer;
