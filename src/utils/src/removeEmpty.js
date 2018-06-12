import eachOwn from './eachOwn'

/**
 * 移除data中的空数据，如：null/undefined/''
 * @param data
 */
export default (data) => {
  eachOwn(data, (value, key, data) => {
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
      delete data[key]
    }
  })
  return data
}
