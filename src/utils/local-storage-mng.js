// 所有localStorage 常量前缀： LS
/**
 * 用户信息等 存储在浏览器的数据统一使用 localStorage 
 * 放弃使用cookie cookie 留做后端使用
 */

const LS = window.localStorage

export const hasLocalStorage = () => LS !== undefined;

// 用户信息 
export const userInfo = 'LS_USER_INFO'
export const getUserInfo = () => JSON.parse(LS.getItem(userInfo) || "{}");
export const setUserInfo = (user = "{}") => { LS.setItem(userInfo, JSON.stringify(user)) };
export const clearUserInfo = () => { LS.removeItem(userInfo) };
export const hasLogin = () => {
    let _user = getUserInfo()
    return !!(_user && _user.user_id)
};