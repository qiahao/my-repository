// import 'babel-polyfill'
// css
import '@/less/iview-theme.less'; //iview style
import '@/scss/base.scss'; //布局body html 修改
import '@/wm-components/style.scss'; //wm-组件 样式


// base
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'iview' // iview
import { mapMutations } from 'vuex'
import { setUserInfo } from '@/store/mutation-types.js'
import WM from '@/wm-components' // 自定义组件
import store from '@/store'
import router from '@/router'
import api from '@/api';
// import '@/api/fetch';
import fetch from '@/api/fetch';
Vue.use(fetch)
import '@/filter'
import App from '@/common/App'
import { browserCheck, browserCheckNotice } from '@/utils/util'
import * as localStorageMng from '@/utils/local-storage-mng'
// vue-echarts组件 git地址： https://github.com/Justineo/vue-echarts
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import VueAMap from 'vue-amap';
import '@/lib/jqprint/jqprint.js';
import '@/lib/jqbarcode/jquery-barcode.js';

// 浏览器报错处理
if (!browserCheck()) { browserCheckNotice() }

Vue.use(iView)
Vue.use(WM)
Vue.use(VueAMap);
Vue.component('chart', ECharts)

// vue-AMap vue高德地图组件
//https://github.com/ElemeFE/vue-amap

VueAMap.initAMapApiLoader({
    key: '08a5f5ad200e8743d05eeaf24990cfc9',
    plugin: ['AMap.Autocomplete', 'AMap.GeoCode', 'AMap.Geocoder', 'AMap.PlaceSearch',
        'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor',
        'AMap.CircleEditor', 'AMap.Driving', 'AMap.Geolocation', 'AMap.CitySearch', ' AMap.Autocomplete', 'AMap.PlaceSearch'
    ],
});

Vue.prototype.$api = api
/* eslint-disable no-new */
const appVue = new Vue({
    el: '#app',
    store,
    router,
    template: '<App></App>',
    components: { App },
    methods: {
        ...mapMutations({ setUserInfo: setUserInfo }),
    },
    created() {
        // 刷新浏览器时重新 设置用户信息
        // 登陆时 设置cookie
        // 退出和登陆失效 清除cookie
        this.setUserInfo(localStorageMng.getUserInfo())
        this.$Message.config({ duration: 3 })

        if (!browserCheck()) { browserCheckNotice() }
    },
    mounted() {},
})



export default appVue;