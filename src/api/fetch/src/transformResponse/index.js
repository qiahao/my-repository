// import responseData from "./src/responseData.js";

export default {
  options: {
    // filter: {}
  },
  install (transformResponse,opts) {
    let option = Object.assign({}, this.options, opts)
    // if (option.filter) {
    //   transformResponse.push(responseData)
    // }
  }
}