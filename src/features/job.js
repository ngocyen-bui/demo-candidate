import axios from "axios"; 
import { HeaderFetch } from "../utils/header"; 

const DOMAIN = 'https://lubrytics.com:8443';
 
export const getListJob = (stringFilter,header) => {    
    return axios.get(DOMAIN+'/nadh-api-crm/api/jobs'+(stringFilter||''), 
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
 export const updateJob =(id,obj,header) =>  axios.put( DOMAIN +'/nadh-api-crm/api/jobs/'+ id, obj,{
    headers:  HeaderFetch(header), 
})
.then((res) => res).catch((err) => err.response)
 
//get department 
export const getDepartment = (key,header) => {return axios.get( DOMAIN+`/nadh-api-crm/api/property_values?property_name=department&value=${key}`, 
{
    headers:  HeaderFetch(header), 
}).then((res) => res.data)} 


//create job
export const createJob = (obj,header) => {return axios.post( DOMAIN+`/nadh-api-crm/api/jobs`,obj,
{
    headers:  HeaderFetch(header), 
}).then((res) => res.data)} 


//update job  

export const updateJobs = (id,obj,header) => {return axios.put( DOMAIN+`/nadh-api-crm/api/jobs/${id}`,obj,
{
    headers:  HeaderFetch(header), 
}).then((res) => res.data)} 


//get contact persion  
export const getContactPerson = (id,header) => {return axios.get( DOMAIN+`/nadh-api-crm/api/contact_persons?client=${id}`, 
{
    headers:  HeaderFetch(header), 
}).then((res) => res.data)} 
 

//get category 

export const getCategoryType = (header) => {return axios.get( DOMAIN+`/nadh-api-crm/api/categories?type=1`, 
{
    headers:  HeaderFetch(header), 
}).then((res) => res.data)} 

export const getAllCategory = (header) => {return axios.get( DOMAIN+`/nadh-api-crm/api/categories?getAll=true`, 
{
    headers:  HeaderFetch(header), 
}).then((res) => res.data)} 

//get image 
 

export const getImage = (obj_id,obj_table,header) => {return axios.get( DOMAIN+`/nadh-mediafile/files?obj_id=${obj_id}&obj_table=${obj_table}&page=1&perPage=10`, 
{
    headers:  HeaderFetch(header), 
}).then((res) => res.data)} 


//delete image 

export const deteteImage = (id,header) => {return axios.delete( DOMAIN+`/nadh-mediafile/file/${id}`, 
{
    headers:  HeaderFetch(header), 
}).then((res) => res.data)} 
 

//search job 
//https://lubrytics.com:8443/nadh-api-crm/api/jobs?advance_search=2

export const getJob = (creator_id,header) => {return axios.get( DOMAIN+`/nadh-api-crm/api/jobs?status=1&related_to=${creator_id}`, 
{
    headers:  HeaderFetch(header), 
}).then((res) => res.data)} 


export const getJobAdvance = (value,header) => {return axios.get( DOMAIN+`/nadh-api-crm/api/jobs?advance_search=${value}`, 
{
    headers:  HeaderFetch(header), 
}).then((res) => res.data)} 