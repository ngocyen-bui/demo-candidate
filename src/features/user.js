import axios from "axios";
import { HeaderFetch } from "../utils/header";
const DOMAIN = 'https://lubrytics.com:8443';

export const getUserInfo =(id) =>  axios.get( DOMAIN +'/nadh-api-crm/api/users/'+ id,{
    headers: HeaderFetch, 
})
 