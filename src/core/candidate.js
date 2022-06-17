import axios from "axios"; 
import { HeaderFetch } from "../utils/header";


const DOMAIN = 'https://lubrytics.com:8443';

export const getListCandidate = (number) => {return axios.get(DOMAIN+'/nadh-api-crm/api/candidates?page='+number+'&perPage=10', 
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

 export const getNationality = () => {return axios.get( DOMAIN+`/nadh-api-crm/api/property_values?property_name=nationality`, 
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
 