export const formatDate = (date,type = 'datetime')=>{
    if(!date) return; 
    let m = new Date(date);
    let options = { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',     }

    if(type === 'date'){
        options = { 
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',  
        }
    }

    let time = m.toLocaleString('it-IT',options);
    return `${time }`  
     
}
    // return  m.getUTCFullYear() + "/" +
    // ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
    // ("0" + m.getUTCDate()).slice(-2) + " " +
    // ("0" + m.getUTCHours()).slice(-2) + ":" +
    // ("0" + m.getUTCMinutes()).slice(-2) + ":" +
    // ("0" + m.getUTCSeconds()).slice(-2);