// //type
const FULL_TIME = { id: 1, key: '1', label: 'Full-time' }
const CONTRACT = { id: 2, key: '2', label: 'Contract' }
const PART_TIME = { id: 3, key: '3', label: 'Part-time' }
const INTERNSHIP = { id: 4, key: '4', label: 'Internship' }
const TEMPORARY = { id: 5, key: '5', label: 'Temporary' }
const OTHER = { id: 6, key: '6', label: 'Other' }

//experience level
const INTERNSHIP_LV = { id: 1, key: '1', label: 'Internship Level' }
const ENTRY_LV = { id: 2, key: '2', label: 'Entry Level' }
const ASSOCIATE_LV = { id: 3, key: '3', label: 'Associate Level' }
const MID_LV = { id: 4, key: '4', label: 'Mid-senior Level' }
const DIRECTOR = { id: 5, key: '5', label: 'Director' }
const EXECUTIVE = { id: 6, key: '6', label: 'Executive' }

//status
const OPENING = { id: 1, key: '1', label: 'Opening', color: 'blue' }
const DONE = { id: 2, key: '2', label: 'Done', color: 'green' }
const PROCESS = { id: 3, key: '3', label: 'Processing', color: 'geekblue' }
const PENDING = { id: 4, key: '4', label: 'Pending', color: 'volcano' }
const REPLACEMENT = { id: 5, key: '5', label: 'Replacement', color: 'purple' }
const CLOSED = { id: -1, key: '-1', label: 'Closed', color: '' }
const CANCEL = { id: -2, key: '-2', label: 'Cancel', color: 'red' }
const LOST = { id: -3, key: '-3', label: 'Lost', color: 'magenta' }
const EXPIRED = { id: -4, key: '-4', label: 'Expired', color: 'lime' }
const REOPENING = { id: 6, key: '6', label: 'Reopening', color: 'cyan' }
  
//money 
const USD = { id: 1, key: '1', label: 'USD', color: 'magenta'}
const VND = { id: 2,key: '2', label: 'VND', color: 'cyan'}
const JPY = { id: 3,key: '3', label: 'JPY', color: 'volcano'}
const EUR = { id: 4,key: '4', label: 'EUR', color: 'purple'}
const listMoney = [
    USD, VND, EUR, JPY
]
export const listLevel =[
    INTERNSHIP_LV,ENTRY_LV, ASSOCIATE_LV, MID_LV, DIRECTOR,EXECUTIVE
]
export const listType = [
    FULL_TIME,CONTRACT,PART_TIME,INTERNSHIP,TEMPORARY,OTHER
]
export const listStatus = [
    OPENING,DONE,PROCESS,PENDING,REPLACEMENT,CLOSED,CANCEL,LOST,EXPIRED,REOPENING
]
export const getLevelJob = (key)=> listLevel.filter(status => Number(status.key) === key);
export const getTypeJob = (key)=> listType.filter(status => Number(status.key) === key);
export const getStatusJob = (key)=> listStatus.filter(status => Number(status.key) === key);
export const getMoneyStatus = (id)=> listMoney.filter(status => Number(status.id) === id);



// business_line: [{industry_id: 54, sector_id: 92, category_id: 94}]
// client_id: "f6d98895-0b30-4d07-bfa4-2c6280615fec"
// department: {key: "2117", label: "Department"}
// experience_level: 2
// location: {country: {key: "1280", label: "Viet Nam"}, city: {key: "2", label: "Ba Ria - Vung Tau"}}
// quantity: 1
// recruiters: ["5fba98d9-2f74-418d-9a3d-f6d287a82ab7"]
// related_users: ["e570c105-a96a-4694-8db3-65f2ba0e9847", "0203666a-11fe-4639-bb51-4d03126906c8"]
// target_date: "1963-02-03"
// title: {key: "1071", label: "Accounting Assistant"}
// type: 4