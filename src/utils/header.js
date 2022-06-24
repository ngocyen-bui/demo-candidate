
export const token = localStorage.getItem('auth'); 
// export const token='eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM0Y2YxMzk5LWMyMGMtNGEwYy05NWU4LTdmODEyNjE5NzEwOCIsInVzZXJfaWQiOjEyLCJpYXQiOjE2NTYwMzgzNTksImV4cCI6MTY1NjY0MzE1OX0.pjz2968zUoM11q6b0nnE-rDKvx2l1Dzs60t3FyOHD8jw5cBF6fPMI82raS0el6XOgEoxC_CjBNk6V1JJpkuk1g';
export const HeaderFetch = {
  Authorization:
    "Bearer " + token,
  "Content-Type": "application/json",
  Accept: "application/json",
};
