/**
 * 遍历对象的自有属性
 * @param obj 对象
 * @param fn 回调函数，fn(obj[key], key, obj)
 */
export default (obj, fn) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      fn(obj[key], key, obj)
    }
  }
}
