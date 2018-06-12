import applicationPost from "./src/applicationPost.js";
export default {
  options: {
    applicationPost: {}
  },
  install (transformRequest,opts) {
    let option = Object.assign({}, this.options, opts)
    if (option.applicationPost) {
      transformRequest.push(applicationPost)
    }
  }
}