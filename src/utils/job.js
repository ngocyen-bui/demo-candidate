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