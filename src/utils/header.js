
const token = localStorage.getItem('auth');
export const HeaderFetch = {
  Authorization:
    "Bearer " + token,
  "Content-Type": "application/json",
  Accept: "application/json",
};
