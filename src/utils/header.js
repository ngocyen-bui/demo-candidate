
// const token = localStorage.getItem('auth'); 
const token  = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM0Y2YxMzk5LWMyMGMtNGEwYy05NWU4LTdmODEyNjE5NzEwOCIsInVzZXJfaWQiOjEyLCJpYXQiOjE2NTU3MTcyNjQsImV4cCI6MTY1NjMyMjA2NH0.pfm58g1CpAzG8WQH3jpI8qKxWZvPr_UwuxaPackt9dHgtyZ_dYLZNRgDJlaS1pyyY8bjhPAX7qTcG6ljoaOmqg';
export const HeaderFetch = {
  Authorization:
    "Bearer " + token,
  "Content-Type": "application/json",
  Accept: "application/json",
};
