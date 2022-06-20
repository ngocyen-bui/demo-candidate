
const token = localStorage.getItem('auth'); 
// const token  = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM0Y2YxMzk5LWMyMGMtNGEwYy05NWU4LTdmODEyNjE5NzEwOCIsInVzZXJfaWQiOjEyLCJpYXQiOjE2NTU2MDM2MjQsImV4cCI6MTY1NjIwODQyNH0.yBTSeMTC5wd08iA5GfdDJ9xB6nmeenHoftF6QLZzw6lZB6huaJIlBxbKFzQim6YTW3J3tXGXocqZsXeAGetbZQ';
export const HeaderFetch = {
  Authorization:
    "Bearer " + token,
  "Content-Type": "application/json",
  Accept: "application/json",
};
