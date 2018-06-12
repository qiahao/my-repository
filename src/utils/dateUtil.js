/**
* 获取本周、本季度、本月、上月的开始日期、结束日期
*/
var now = new Date(); //当前日期 
var nowDayOfWeek = now.getDay(); //今天本周的第几天 
var nowDay = now.getDate(); //当前日 
var nowMonth = now.getMonth(); //当前月 
var nowYear = now.getYear(); //当前年 
nowYear += (nowYear < 2000) ? 1900 : 0; //

var lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
var lastYear = lastMonthDate.getYear();
var lastMonth = lastMonthDate.getMonth();
const format = 'yyyy-MM-dd hh:mm:ss'

//获取前n个月的开始时间
export function getPreMonthStartDay(dayCount) {
  var monthDate = new Date(); //上月日期
  monthDate.setDate(1);
  monthDate.setMonth(monthDate.getMonth() - dayCount);
  return formatDate(monthDate)
}


/**
 * 格式化日期
 * @param {any} value
 * @param {string} [format='yyyy-MM-dd hh:mm:ss']
 * @returns
 */
export const date = (value, format = format) => {
    if (!value) {
        return value
    } else if (/^\d+$/.test(value)) {
        // java格式的timestamp
        return dateFormat(new Date(value), format)
    } else if (typeof value === 'object' && value.getTime) {
        // java格式的日期object
        return dateFormat(new Date(value.getTime()), format)
    } else if ((/date/i).test(value)) {
        // .net格式的timestamp
        return dateFormat(new Date(value.match(/\d+/)[0]), format)
    } else if (value && typeof value === 'string' && /\.\d$/.test(value)) {
        // mysql字符串格式转化
        return dateFormat(new Date(value.replace(/\.\d$/, '').replace(/-/g, '/')), format)
    } 
    return value
}
/**
 * 格式化日期
 * @param {any} value
 * @param {any} format
 * @returns
 */
export function dateFormat(value, format = format) {
    let o = {
        'M+': value.getMonth() + 1, // month
        'd+': value.getDate(), // day
        'h+': value.getHours(), // hour
        'm+': value.getMinutes(), // minute
        's+': value.getSeconds(), // second
        'q+': Math.floor((value.getMonth() + 3) / 3), // quarter
        'S': value.getMilliseconds() // millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (value.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ?
                o[k] :
                ('00' + o[k]).substr(('' + o[k]).length))
        }
    }
    return format
}

//格式化日期
export function getDateFormat(e) {
  let date = e;
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
      month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
  }
  var hours = date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();
  var minutes = date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes();
  var seconds = date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds();
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + hours + seperator2 + minutes
      + seperator2 + seconds;
  return currentdate;
}

//格式化日期：yyyy-MM-dd 
export function formatDate (date) {
  var myyear = date.getFullYear();
  var mymonth = date.getMonth() + 1;
  var myweekday = date.getDate();

  if (mymonth < 10) {
    mymonth = "0" + mymonth;
  }
  if (myweekday < 10) {
    myweekday = "0" + myweekday;
  }
  return (myyear + "-" + mymonth + "-" + myweekday);
}

//获得某月的天数 
export function getMonthDays (myMonth) {
  var monthStartDate = new Date(nowYear, myMonth, 1);
  var monthEndDate = new Date(nowYear, myMonth + 1, 1);
  var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
  return days;
}

//获得本季度的开始月份 
export function getQuarterStartMonth () {
  var quarterStartMonth = 0;
  if (nowMonth < 3) {
    quarterStartMonth = 0;
  }
  if (2 < nowMonth && nowMonth < 6) {
    quarterStartMonth = 3;
  }
  if (5 < nowMonth && nowMonth < 9) {
    quarterStartMonth = 6;
  }
  if (nowMonth > 8) {
    quarterStartMonth = 9;
  }
  return quarterStartMonth;
}

//获得本周的开始日期 
export function getWeekStartDate () {
  var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
  return formatDate(weekStartDate);
}

//获得本周的结束日期 
export function getWeekEndDate () {
  var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
  return formatDate(weekEndDate);
}

//获得本月的开始日期 
export function getMonthStartDate () {
  var monthStartDate = new Date(nowYear, nowMonth, 1);
  return formatDate(monthStartDate);
}

//获得本月的结束日期 
export function getMonthEndDate () {
  var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
  return formatDate(monthEndDate);
}

//获得上月开始时间
export function getLastMonthStartDate () {
  var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
  return formatDate(lastMonthStartDate);
}

//获得上月结束时间
export function getLastMonthEndDate () {
  var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
  return formatDate(lastMonthEndDate);
}

//获得本季度的开始日期 
export function getQuarterStartDate () {

  var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
  return formatDate(quarterStartDate);
}

//或的本季度的结束日期 
export function getQuarterEndDate () {
  var quarterEndMonth = getQuarterStartMonth() + 2;
  var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
  return formatDate(quarterStartDate);
}