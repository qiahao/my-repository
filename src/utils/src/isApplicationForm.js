const applicationFormRegs = [
  /^application\/x-www-form-urlencoded/i,
  /^application\/form/i,
  /^form/i
]

/**
 * 是否为application/x-www-form-urlencoded格式
 * @param contentType
 */
export default contentType => {
  return contentType && applicationFormRegs.some(applicationFormReg => {
    return applicationFormReg.test(contentType)
  })
}
