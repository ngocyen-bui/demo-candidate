
export const token = localStorage.getItem('auth'); 
//export const token='eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM0Y2YxMzk5LWMyMGMtNGEwYy05NWU4LTdmODEyNjE5NzEwOCIsInVzZXJfaWQiOjEyLCJpYXQiOjE2NTYwNjM1MjUsImV4cCI6MTY1NjY2ODMyNX0.11ELdYAO5doawCcrK5CpiNyjvRXqsgL5_KxjFwaunxE_6wo8rt6Udh_SqCN2akbnyo7kotcSbqzSrY_jR405vg';
export const HeaderFetch = {
  Authorization:
    "Bearer " + token,
  "Content-Type": "application/json",
  Accept: "application/json",
};
