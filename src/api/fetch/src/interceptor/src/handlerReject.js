export default {
    response(config) {
        if (config.status == 200 && config.data) {
            if (config.data.result == 1) {
                return config;
            } else {
                return Promise.reject(config);
            }
        } else {
            return Promise.reject(config);
        }
        return config;
    }
}