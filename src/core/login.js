import axios from "axios"; 

const DOMAIN = "https://lubrytics.com:8443";

export const login = ({user_name, password}) => {
  return axios
    .post(
      DOMAIN + "/nadh-api-crm/login",
      {
        user_name,
        password
      } 
    )
    .then((res) => {
       return res;
    }).catch(err => err.response.status);
};
