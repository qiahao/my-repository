const env = process.env.NODE_ENV

const common = {
    
    imgHost: 'http://static01.yunba.com/', // 阿里云图片服务器
}

// 开发环境：npm run dev
const development = {
    host: 'http://wangyubing.56913.com',
    // host: 'https://api-testing.yunba.com',
    imgUploadUrl: 'https://tms-dev.yunba.com/api/utils/upload/img/file', // 图片上传地址
    ...common
}

// 以下为打包环境配置： webpack.prod.conf.js
// 测试环境打包：npm run build test
const test = {
    host: 'https://tms-dev.yunba.com',
    imgUploadUrl: 'https://tms-dev.yunba.com/api/utils/upload/img/file', // 图片上传地址
    ...common
}

// 正式环境打包：npm run build
const production = {
    host: '/',
    imgUploadUrl: 'https://tms.yunba.com/api/utils/upload/img/file', // 图片上传地址
    ...common
}


const config = {
    development,
    test,
    production
}

export default config[env]