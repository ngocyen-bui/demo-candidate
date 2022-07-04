import axios from "axios"; 
import { HeaderFetch } from "../utils/header"; 

const DOMAIN = 'https://lubrytics.com:8443';
 
export const getListJob = (listFilter,header) => { 
    let str = '';   
    // console.log(listFilter); 
    for (const f in listFilter) {  
        if(f === 'location'){
          let city = ''; 
          if(Boolean(listFilter[f].city.key)) {
            city = '&city='+listFilter[f]?.city?.key
          }
          str +=`&location=${JSON.stringify(listFilter[f])}&country=${listFilter[f].country.key}${city}`
        }
        else if(f === 'page'|| f=== 'perPage'){
            continue;
        }
        else if(Array.isArray(listFilter[f])){
            let arr = listFilter[f]?.map(e => e?.id);
            str +='&'+f+'='+arr.toString();
        } else{
            str +='&'+f+'='+listFilter[f];

        }
    }
    return axios.get(DOMAIN+'/nadh-api-crm/api/jobs?page='+(listFilter['page']|| 1)+'&perPage=10'+str, 
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