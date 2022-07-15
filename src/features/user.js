import axios from "axios";
import { HeaderFetch } from "../utils/header";
const DOMAIN = 'https://lubrytics.com:8443';
 
export const getListUser = (header) => {   
    return axios.get(DOMAIN+'/nadh-api-crm/api/users', 
 {
     headers: HeaderFetch(header), 
 }).then((res) => res.data).catch((err) => err.response)}  

 //get all users 
 //https://lubrytics.com:8443/nadh-api-crm/api/users?page=1&getAll=true 
 
 export const getAllUsers = (header) => {   
    return axios.get(DOMAIN+'/nadh-api-crm/api/users?page=1&getAll=true', 
 {
     headers: HeaderFetch(header), 
 }).then((res) => res.data).catch((err) => err.response)}  


 // trim socal link 
 // save khi change k luu
  