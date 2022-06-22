
// const token = localStorage.getItem('auth'); 
const token  = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM0Y2YxMzk5LWMyMGMtNGEwYy05NWU4LTdmODEyNjE5NzEwOCIsInVzZXJfaWQiOjEyLCJpYXQiOjE2NTU4NjM2OTYsImV4cCI6MTY1NjQ2ODQ5Nn0.VPm_b3uMW5tJjvlSh7gsZxH_S4nNloRHvp044RNVgvH0G5IIiYZFHaAe4tMU3g9v8WtOhkz6dlFWVLu71azyxw';
export const HeaderFetch = {
  Authorization:
    "Bearer " + token,
  "Content-Type": "application/json",
  Accept: "application/json",
};
