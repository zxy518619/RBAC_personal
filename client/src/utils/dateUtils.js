export function formateDate(time) {
    if(!time) return ''
    let date = new Date(time)
    let year = date.getFullYear()
    let month = date.getMonth()+1
    let day = date.getDate()
    /* let hour = date.getHours()
    let minute = date.getMinutes()
    let seconds = date.getSeconds()
 */
    month = month<10?"0"+month:month
    day = day<10?"0"+day:day
   /*  hour = hour<10?"0"+hour:hour
    minute = minute<10?"0"+minute:minute
    seconds = seconds<10?"0"+seconds:seconds */
    return year + '-' + month + '-' + day /* + '  '+hour + ":" + minute + ":"+ seconds */
    
   
}
export function formateTime(time) {
    if(!time) return ''
    let date = new Date(time)
    let year = date.getFullYear()
    let month = date.getMonth()+1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let seconds = date.getSeconds()

    month = month<10?"0"+month:month
    day = day<10?"0"+day:day
    hour = hour<10?"0"+hour:hour
    minute = minute<10?"0"+minute:minute
    seconds = seconds<10?"0"+seconds:seconds
    return year + '-' + month + '-' + day + '  '+hour + ":" + minute + ":"+ seconds
    
   
}