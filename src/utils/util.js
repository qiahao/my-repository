import { Message } from 'iview'
import config from '@/config'
import store from '@/store'
import router from '@/router'


export const utilCookie = {
    set: function (name, value, days) {
        var d = new Date;
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
        window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
    },
    get: function (name) {
        var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    },
    delete: function (name) {
        this.set(name, '', -1);
    }
};

// 一维数组转树形结构
export const array2tree = (array, pflag = 'pid', sflag = 'id', root = 0) => {
    function cascader (pid) {
        const target = []
        array.forEach(a => {
            const _clone = Object.assign({}, a)
            if (_clone[pflag] == pid) {
                target.push(_clone)
                const _child = cascader(_clone[sflag])
                if (_child.length)
                    _clone.children = _child
            }
        });
        return target
    }
    return cascader(root)
};

export const getParentsIds = (list, leafId, key = 'id', f_key = 'fid') => {
    const ids = [], maps = {}
    list.forEach(n => {
        maps[n[key]] = n
    })
    while (maps[leafId]) {
        ids.push(leafId.toString())
        leafId = maps[leafId][f_key]
    }
    return ids
}
export const getArrayIds = (list, key) => {
    let arry = [];
    list.forEach(n => {
        arry.push(n[key])
    })
    return arry.join(",")
}

export const copySameNamePropety = (to, from) => {
    for (let key in to) { to[key] = from[key] }
    return to;
}

export const getCurDate = () => {
    var date = new Date();
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

export const getDateFormat = (e) => {
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

export const print = (obj) => {
    var newWindow = window.open("打印窗口", "_blank");
    newWindow.document.write(window.document.head.innerHTML)
    newWindow.document.write(obj.innerHTML)
    //关闭文档
    // newWindow.document.close();
    //调用打印机
    setTimeout(function () {
        newWindow.print();
        newWindow.document.close();
        newWindow.close();
    }, 500)
}

// webpack require.context 转为数组包装函数 
// export 使用 default
export const webpackRequire2array = (r, exinclude) => {
    let contents = []
    const paths = r.keys().filter((p, i) => {
        return exinclude.indexOf(p) == -1
    });
    for (let p of paths) {
        let fn = r(p).default ? r(p).default : r(p)
        if (fn instanceof Array) {
            contents = [...contents, ...fn]
        } else if (fn instanceof Object) {
            contents.push(fn)
        }
    }
    return contents
}


// webpack require.context 转为对象包装函数 
export const webpackRequire2obj = (r, exinclude) => {
    let contents = {}
    const paths = r.keys().filter((p, i) => {
        return exinclude.indexOf(p) == -1
    });
    for (let p of paths) {
        let fn = r(p).default ? r(p).default : r(p)
        let k = p.match(/(\w+-?\w+).js$/)[1]
        contents[k] = fn
    }
    return contents
}


// 转成数字
export const getNumber = (val) => {
    return isNaN(parseFloat(val)) ? 0 : parseFloat(val)
}
// 转成整数
export const getFalsyInteger = (val,times = 100) => {
    let rst = 0
    if (!isNaN(parseFloat(val))) {
        rst = parseInt(parseFloat(val) * times)
    }
    return rst
}
// 两位小数
export const get2Fixed = (v) => {
    let n = 0
    if (!isNaN(v)) {
        n = Math.round(Number(v) * 100) / 100  // 取小数两位
    }
    return n
}
// 小数相加

export const addFloat = function () {
    let nums, result = 0
    nums = Array.prototype.slice.call(arguments)
    if (!nums.length) {return 0}
    result = nums.reduce((v1,v2) => {
        return get2Fixed(get2Fixed(v1) + get2Fixed(v2)) 
    })    
    return result
}


// 转成整数
export const getInteger = (val) => {
    return isNaN(parseFloat(val)) ? 0 : parseInt(val)
}
//参数格式化
export function parseParam (params) {
    let str = "";
    for (var o in params) {
        // if (params[o] != -1) {
        str += o + "=" + params[o] + "&";
        // }
    }
    let _str = str.substring(0, str.length - 1);
    return _str;
}
//导出数据
export function exportExcel (params, url) {
    // let iframe = $('<iframe></iframe>')
    let tempUrl
    if (process.env.NODE_ENV == 'development') {
        tempUrl = config.host + url + "?" + parseParam(params)
    } else {
        tempUrl = window.location.origin + url + "?" + parseParam(params)
    }
    // iframe.on('load', () => {
    //     iframe[0].contentWindow.location.href = tempUrl
    // })
    window.open(tempUrl)
    // $('body').append(iframe)
}

/**
 * 浏览器验证
 * 是否存在localStorage
 * todo: 是否低于 ie9
 */
const hasLocalStorage = localStorage !== undefined
export const browserCheck = () => {
    let _flag = hasLocalStorage
    return _flag
}
// 低版本浏览器处理
export const browserCheckNotice = () => {
    document.body.innerHTML = "浏览器版本太低，请升级！"
}
// 字符串截取
export const subStringLimit = (str, num) => {
    if (str.length <= num)
        return str

    return str.substring(0, num) + '...'
}





// src
import numberToWords from "./src/numberToWords";
import fmt from "./src/date/index"; // 时间格式化
export { 
    numberToWords , 
    fmt
}

