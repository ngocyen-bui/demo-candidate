import axios from "axios"; 
import { HeaderFetch } from "../utils/header"; 

const DOMAIN = 'https://lubrytics.com:8443';

export const getListCandidate = (number,listFilter) => { 
    let ft = ''; 
    for (const filter in listFilter) {
        if(listFilter[filter]) ft+=('&'+filter+"="+listFilter[filter])
    }  
    return axios.get(DOMAIN+'/nadh-api-crm/api/candidates?page='+number+'&perPage=10'+ft, 
 {
     headers: HeaderFetch, 
 }).then((res) => res.data)}

 export const getValueFlag = () => {return axios.get(DOMAIN+'/nadh-api-crm/api/locations?type=4', 
 {
     headers: HeaderFetch, 
 }).then((res) => res.data)}


 export const getLocationFromCountry = (number) => {return axios.get(DOMAIN+'/nadh-api-crm/api/locations?type=1&parent_id='+number+'&limit=500', 
 {
     headers: HeaderFetch, 
 }).then((res) => res.data)}

 export const getLocationFromCity = (number) => {return axios.get(DOMAIN+'/nadh-api-crm/api/locations?type=2&parent_id='+number+'&limit=500', 
 {
     headers: HeaderFetch, 
 }).then((res) => res.data)} 
 export const getPosition = () => {return axios.get( DOMAIN+`/nadh-api-crm/api/property_values?property_name=position`, 
 {
     headers: HeaderFetch, 
 }).then((res) => res.data)} 
 export const getCandidate = (id) => {return axios.get( DOMAIN+`/nadh-api-crm/api/candidates/`+ id, 
 {
     headers: HeaderFetch, 
 }).then((res) => res.data)} 
 
 export const getCandidateByPriorityStatus = (id) => {return axios.get( DOMAIN+`/nadh-api-crm/api/candidates?page=1&perPage=10&priority_status=`+ id, 
 {
     headers: HeaderFetch, 
 }).then((res) => res.data)} 
 
 export const getKeyPageCDD = () => {return axios.get( DOMAIN+`/nadh-api-crm/api/user_pages?key_page=candidates`, 
 {
     headers: HeaderFetch, 
 }).then((res) => res.data)} 

 export const getDefaultProp = () => {return axios.get( DOMAIN+`/nadh-api-crm/api/properties/default`, 
 {
     headers: HeaderFetch, 
 }).then((res) => res.data)} 

//get degree 

export const getDegree = () => {return axios.get( DOMAIN+`/nadh-api-crm/api/property_values?property_name=degree`, 
{    headers: HeaderFetch, 
}).then((res) => res.data)} 


 //post request 
 export const createCandidate =(obj) =>  axios.post( DOMAIN +'/nadh-api-crm/api/candidates', obj,{
    headers: HeaderFetch, 
})
  .then((res) => res.data)


export const updateCandidate =(id,obj) =>  axios.put( DOMAIN +'/nadh-api-crm/api/candidates/'+ id, obj,{
    headers: HeaderFetch, 
})
.then((res) => res).catch((err) => err)



  ///get nationality
  export const getNationality = (value) => {
    if (value) {
      return axios.get(
        DOMAIN + `/nadh-api-crm/api/property_values?property_name=nationality&value=${value}`,
        {
          headers: HeaderFetch,
        }
      ).then((res) => res.data);
    }
    return axios.get(
      DOMAIN + `/nadh-api-crm/api/property_values?property_name=nationality`,
      {
        headers: HeaderFetch,
      }
    ).then((res) => res.data);
  };

  // logout  

  export const logout = () => {return axios.get( DOMAIN+`/nadh-api-crm/logout`, 
  {    headers: HeaderFetch, 
  }).then((res) => res.data)} 
