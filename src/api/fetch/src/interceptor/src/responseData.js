export default {
  response (config) {
    if (config.data.result == 1 || config.data) {
        return config.data;
    }
  }
}