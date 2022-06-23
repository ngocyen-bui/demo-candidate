
//export const token = localStorage.getItem('auth'); 
export const token='eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM0Y2YxMzk5LWMyMGMtNGEwYy05NWU4LTdmODEyNjE5NzEwOCIsInVzZXJfaWQiOjEyLCJpYXQiOjE2NTU5NzYxMTcsImV4cCI6MTY1NjU4MDkxN30.XmS6phUS5fj0jF-HJ9ldoQl7nyS1Ut878WHjPMvnko7ytC5rqzm-50P0RroufJKOcJvz1xTgvMnrE4lr8nia2w';
export const HeaderFetch = {
  Authorization:
    "Bearer " + token,
  "Content-Type": "application/json",
  Accept: "application/json",
};
