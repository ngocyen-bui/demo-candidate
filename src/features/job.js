import axios from "axios"; 
import { HeaderFetch } from "../utils/header"; 

const DOMAIN = 'https://lubrytics.com:8443';
 
export const getListJob = (stringFilter,header) => {   
    return axios.get(DOMAIN+'/nadh-api-crm/api/jobs'+stringFilter, 
 {
     headers: HeaderFetch(header), 
}).then((res) => res.data).catch((err) => err.response)} 
 

 export const getKeyJobs = (header) => {   
    return axios.get(DOMAIN+'/nadh-api-crm/api/user_pages?key_page=jobs', 
 {
     headers: HeaderFetch(header), 
 }).then((res) => res.data).catch((err) => err.response)}   

 export const getExchangeCurrencies = (header) => {   
    return axios.get(DOMAIN+'/nadh-api-crm/api/exchange_currencies', 
 {
     headers: HeaderFetch(header), 
 }).then((res) => res.data).catch((err) => err.response)}  



 //get jobbyid  
 export const getJobById = (id,header) => {   
    return axios.get(DOMAIN+'/nadh-api-crm/api/jobs/'+id, 
 {
     headers: HeaderFetch(header), 
 }).then((res) => res.data).catch((err) => err.response)}  

 //update job 
 export const updateJob =(id,obj,header) =>  axios.put( DOMAIN +'/nadh-api-crm/api/candidates/'+ id, obj,{
    headers:  HeaderFetch(header), 
})
.then((res) => res).catch((err) => err.response)
