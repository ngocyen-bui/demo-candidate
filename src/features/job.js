import axios from "axios"; 
import { HeaderFetch } from "../utils/header"; 

const DOMAIN = 'https://lubrytics.com:8443';


export const getListJob = (listFilter,header) => { 
    let str = '';  
    // for (const f in listFilter) {    
    //     if(f === 'yob' || f === 'industry_years' || f === 'management_years'){ 
    //       let arr = Object.entries(listFilter[f]);  
    //       str+='&'+arr[0][0]+'='+arr[0][1]+'&'+arr[1][0]+'='+arr[1][1]
    //     }  
    //     if(f === 'addresses'){
    //       let city = ''; 
    //       if(Boolean(listFilter[f].city.key)) {
    //         city = '&city='+listFilter[f]?.city?.key
    //       }
    //       str +=`&location=${JSON.stringify(listFilter[f])}&country=${listFilter[f].country.key}${city}`
    //     }
    //     if(typeof(listFilter[f]) === 'object'){
    //       if(listFilter[f].key){ 
    //         str+= '&'+f+'='+listFilter[f].data.key;
    //       }else{
    //         // str += '&'+f
    //       }
    //     }
    //     if(Array.isArray(listFilter[f])){
    //       let t = ''
    //       let arr = listFilter[f].map((e)=>{
    //         return e.data.key
    //       })  
    //       t+= f + '='+ arr.toString()
    //       str += '&'+ t
    //     }
    //     if(typeof(listFilter[f]) === 'string')  str+= '&'+f+'='+listFilter[f];

    // }  
    // console.log(str);
    return axios.get(DOMAIN+'/nadh-api-crm/api/jobs?page='+listFilter['page']+'&perPage=10'+str, 
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