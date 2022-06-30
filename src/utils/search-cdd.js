
const DOMAIN = 'https://lubrytics.com:8443';
const searchID = DOMAIN +'/nadh-api-crm/api/candidates?page=1&perPage=10&candidate_id='+ id;
const searchFullName = DOMAIN +'/nadh-api-crm/api/candidates?page=1&perPage=10&full_name=' + name_text;
const searchPrimaryStatus = DOMAIN +'/nadh-api-crm/api/candidates?page=1&perPage=10&priority_status='+ numberStatus;
const searchLanguague = DOMAIN +'/nadh-api-crm/api/candidates?page=1&perPage=10&language='+ idLanguague;
const searchHighestDegree = DOMAIN +'/nadh-api-crm/api/candidates?page=1&perPage=10&highest_education=' + highest-id; 
const searchCity = DOMAIN +'/nadh-api-crm/api/candidates?perPage=10&page=1&location={"country":{"key":"1097","label":"Costa+Rica"}}&country=1097';
const searchIndustry = DOMAIN +'/nadh-api-crm/api/candidates?page=1&perPage=10&industry_id=52&industry_type=3';
const searchYob = DOMAIN +'/nadh-api-crm/api/candidates?page=1&perPage=10&yob_from=12&yob_to=122';
const searchActivity = DOMAIN +'/nadh-api-crm/api/candidates?page=1&perPage=10&flow_status=1';
const searchCompany = DOMAIN +'/nadh-api-crm/api/candidates?page=1&perPage=10&current_company_text=a';
const searchCurrentPosition = DOMAIN +'/nadh-api-crm/api/candidates?page=1&perPage=10&current_position_text=A';
const searchYearofService = DOMAIN +'/nadh-api-crm/api/candidates?page=1&perPage=10&industry_years_from=0&industry_years_to=3';
const searchYearOfManegement = DOMAIN +'/nadh-api-crm/api/candidates?page=1&perPage=10&management_years_from=12&management_years_to=123'



'https://lubrytics.com:8443/nadh-api-crm/api/candidates?page=1&perPage=10&location={"country":{"key":"1280","label":"Viet+Nam"},"city":{"key":"2","label":"Ba+Ria+-+Vung+Tau"}}&country=1280&city=2'