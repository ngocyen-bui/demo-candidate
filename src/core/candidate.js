import axios from "axios"; 
import { HeaderFetch } from "../utils/header";


export const getListCandidate = (number) => {return axios.get('https://lubrytics.com:8443/nadh-api-crm/api/candidates?page='+number+'&perPage=10', 
 {
     headers: HeaderFetch, 
 }).then((res) => res.data)}