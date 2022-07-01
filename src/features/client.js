import axios from "axios";
import { HeaderFetch } from "../utils/header";
const DOMAIN = 'https://lubrytics.com:8443';
 
export const getListClients = (header) => {   
    return axios.get(DOMAIN+'/nadh-api-crm/api/clients', 
 {
     headers: HeaderFetch(header), 
 }).then((res) => res.data).catch((err) => err.response)}  