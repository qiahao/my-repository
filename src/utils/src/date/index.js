// /**
//  * fmt
//  */
// const fmtOptions = {
//     // 日期格式化
//     date: {
//         format: ''
//     },
//     // 货币格式化
//     currency: {
//         places: 2,
//         symbol: '￥',
//         thousand: ', ',
//         decimal: '.'
//     }
// }

const FORMAT = 'yyyy-MM-dd hh:mm:ss'

/**
 * 格式化日期
 * @param {any} value
 * @param {string} [format='yyyy-MM-dd hh:mm:ss']
 * @returns
 */
const date = (value, format = FORMAT) => {
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
const dateFormat = (value, format = FORMAT) => {
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
    // /**
    //  * 货币格式化
    //  * @param {any} money
    //  * @param {string} [opt={
    //  *             olaces: 2,
    //  *             symbol: '￥',
    //  *             thousand: ', ',
    //  *             decimal: '.'
    //  *         }]
    //  * @returns
    //  */
    // currency(money, opt) {
    //     opt = Object.assign({}, fmtOptions.currency, opt)
    //     let number = money
    //     let negative = number < 0 ? '-' : ''
    //     let i = parseInt(number = Math.abs(+number || 0).toFixed(opt.places), 10) + ''
    //     let l = i.length
    //     let j = l > 3 ? l % 3 : 0
    //     return opt.symbol + negative +
    //         (j ? i.substr(0, j) + opt.thousand : '') +
    //         i.substr(j)
    //         .replace(/(\d{3})(?=\d)/g, '$1' + opt.thousand) + (
    //             opt.places ?
    //             opt.decimal + Math.abs(number - i).toFixed(opt.places).slice(2) :
    //             '')
    // },
    // /**
    //  * 取对象的值
    //  * @param {any} obj
    //  * @param {any} key
    //  * @param {any} defaultValue
    //  * @returns
    //  */
    // value(key, obj, defaultValue) {
    //     if (defaultValue == null) {
    //         defaultValue = ''
    //     }
    //     if (typeof key === 'object') {
    //         key = arguments[1]
    //         obj = arguments[0]
    //     }
    //     obj = obj || {}
    //     var value = obj[key]
    //     return value == null ? defaultValue : value
    // },
    // /**
    //  * 返回图片URL的绝对路径
    //  * @param {any} url
    //  * @returns
    //  */
    // url(url) {
    //     return /^[http|/]/.test(url) ? url : profile.imgDomain + url
    // },
    // /**
    //  * 取对象深层属性的值
    //  * @param {any} propStr
    //  * @param {any} obj
    //  * @param {string} [defaultValue='']
    //  * @returns
    //  */
    // prop(propStr, obj, defaultValue = '') {
    //     if (typeof propStr !== 'string') {
    //         propStr = arguments[1]
    //         obj = arguments[0]
    //     }
    //     let props = propStr.split('.')
    //     let target = obj || {}
    //     for (let i = 0, l = props.length; i < l; i++) {
    //         if ((target = target[props[i]]) == null) {
    //             return defaultValue
    //         }
    //     }
    //     return target
    // }

export default {
    date,
    dateFormat
}

export {
    date,
    dateFormat
}