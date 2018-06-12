/**
 * localStorage 工具方法
 */


let warn = console.warn;
let catchHandle = (error) => {warn('localStorage:' + error.message) }

let localCache = {}

localCache.getItem = (name) => {
    try {
        return localStorage.getItem(name)
    } catch(e) {
        catchHandle(e)
    }
}

localCache.setItem = (name, data) => {
    try {
        return localStorage.setItem(name, data)
    } catch(e) {
        catchHandle(e)
    }
}

localCache.removeItem = (name) => {
    try {
        return localStorage.removeItem(name)
    } catch(e) {
        catchHandle(e)
    }
}

export default localCache