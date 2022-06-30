import axios from "axios"; 
import { HeaderFetch } from "../utils/header"; 

const DOMAIN = 'https://lubrytics.com:8443';
 

export const getListCandidate = (number,listFilter,header) => { 
    let str = '';  
    for (const f in listFilter) {    
        if(f === 'yob' || f === 'industry_years' || f === 'management_years'){ 
          let arr = Object.entries(listFilter[f]);  
          str+='&'+arr[0][0]+'='+arr[0][1]+'&'+arr[1][0]+'='+arr[1][1]
        }  
        if(f === 'addresses'){
          let city = ''; 
          if(Boolean(listFilter[f].city.key)) {
            city = '&city='+listFilter[f]?.city?.key
          }
          str +=`&location=${JSON.stringify(listFilter[f])}&country=${listFilter[f].country.key}${city}`
        }
        if(typeof(listFilter[f]) === 'object'){
          if(listFilter[f].key){ 
            str+= '&'+f+'='+listFilter[f].data.key;
          }else{
            // str += '&'+f
          }
        }
        if(Array.isArray(listFilter[f])){
          let t = ''
          let arr = listFilter[f].map((e)=>{
            return e.data.key
          })  
          t+= f + '='+ arr.toString()
          str += '&'+ t
        }
        if(typeof(listFilter[f]) === 'string')  str+= '&'+f+'='+listFilter[f];

    }  
    // console.log(str);
    return axios.get(DOMAIN+'/nadh-api-crm/api/candidates?page='+number+'&perPage=10'+str, 
 {
     headers: HeaderFetch(header), 
 }).then((res) => res.data).catch((err) => err.response)}

 export const getValueFlag = (header) => {return axios.get(DOMAIN+'/nadh-api-crm/api/locations?type=4', 
 {
     headers:  HeaderFetch(header), 
 }).then((res) => res.data)}


 export const getLocationFromCountry = (number,header) => {return axios.get(DOMAIN+'/nadh-api-crm/api/locations?type=1&parent_id='+number+'&limit=500', 
 {
     headers:  HeaderFetch(header), 
 }).then((res) => res.data)}

 export const getLocationFromCity = (number,header) => {return axios.get(DOMAIN+'/nadh-api-crm/api/locations?type=2&parent_id='+number+'&limit=500', 
 {
     headers:  HeaderFetch(header), 
 }).then((res) => res.data)} 
 export const getPosition = (header) => {return axios.get( DOMAIN+`/nadh-api-crm/api/property_values?property_name=position`, 
 {
     headers:  HeaderFetch(header), 
 }).then((res) => res.data)} 
 export const getCandidate = (id,header) => {return axios.get( DOMAIN+`/nadh-api-crm/api/candidates/`+ id, 
 {
     headers:  HeaderFetch(header), 
 }).then((res) => res.data)} 
 
 export const getCandidateByPriorityStatus = (id,header) => {return axios.get( DOMAIN+`/nadh-api-crm/api/candidates?page=1&perPage=10&priority_status=`+ id, 
 {
     headers:  HeaderFetch(header), 
 }).then((res) => res.data)} 
 
 export const getKeyPageCDD = (header) => {return axios.get( DOMAIN+`/nadh-api-crm/api/user_pages?key_page=candidates`, 
 {
     headers:  HeaderFetch(header), 
 }).then((res) => res.data)} 

 export const getDefaultProp = (header) => {return axios.get( DOMAIN+`/nadh-api-crm/api/properties/default`, 
 {
     headers:  HeaderFetch(header), 
 }).then((res) => res.data)} 

//get property  

export const getDegree = (header) => {return axios.get( DOMAIN+`/nadh-api-crm/api/property_values?property_name=degree`, 
{    headers:  HeaderFetch(header), 
}).then((res) => res.data)} 
export const getLanguage = (value,header) => {
  if(value)  {
    return axios.get( DOMAIN+`/nadh-api-crm/api/property_values?property_name=language&value=${value}`, 
    {    headers:  HeaderFetch(header), 
    }).then((res) => res.data)
  }else{
    return axios.get( DOMAIN+`/nadh-api-crm/api/property_values?property_name=language`, 
    {    headers:  HeaderFetch(header), 
    }).then((res) => res.data)
  }
} 


 //post request 
 export const createCandidate =(obj,header) =>  axios.post( DOMAIN +'/nadh-api-crm/api/candidates', obj,{
    headers:  HeaderFetch(header), 
})
  .then((res) => res.data)


export const updateCandidate =(id,obj,header) =>  axios.put( DOMAIN +'/nadh-api-crm/api/candidates/'+ id, obj,{
    headers:  HeaderFetch(header), 
})
.then((res) => res).catch((err) => err.response)



  ///get nationality
  export const getNationality = (value,header) => {
    if (value) {
      return axios.get(
        DOMAIN + `/nadh-api-crm/api/property_values?property_name=nationality&value=${value}`,
        {
          headers:  HeaderFetch(header),
        }
      ).then((res) => res.data);
    }
    return axios.get(
      DOMAIN + `/nadh-api-crm/api/property_values?property_name=nationality`,
      {
        headers:  HeaderFetch(header),
      }
    ).then((res) => res.data);
  };

  // logout  

  // export const logout = () => {return axios.get( DOMAIN+`/nadh-api-crm/logout`, 
  // {    headers: HeaderFetch, 
  // }).then((res) => res.data)} 
