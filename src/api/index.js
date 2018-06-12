// api 文件以统一格式 export function xxx 输出
import * as utils from '@/utils/util'

let contents = utils.webpackRequire2obj(require.context('./src',false, /^\.\/[\s\S]+\/*\.js$/), ['./index.js'])

export default contents