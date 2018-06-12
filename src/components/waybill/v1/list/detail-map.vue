<template>
    <el-amap vid="amapDemo" :center="mapOpt.center" :map-manager="mapOpt.mapManager" :zoom="mapOpt.zoom" :events="mapOpt.events" :plugin="mapOpt.plugins" style="height:500px; width: 100%;">
    </el-amap>
</template>
<script>
import { utilCookie } from '@/utils/util'
import { mapState } from 'vuex'
import { getOrderTrace } from '@/api/src/order.js'
import { AMapManager } from 'vue-amap';
let aMapManager = new AMapManager();
export default {
    name: 'orderDetailMap',
    props: { order_id: '', freshMap: false},
    data() {
        let _vm = this;
        return {
            mapOpt: {
                zoom: 12,
                center: [119.527875, 25.959757],
                mapManager: aMapManager,
                events: {
                    init(o) {

                    }
                },
                plugins: [{
                    pName: 'AMap.Geolocation',
                    events: {
                        init(o) {
                            o.getCurrentPosition((status, result) => {
                                if (result && result.position) {
                                    _vm.mapOpt.center = [result.position.lng, result.position.lat]
                                    // _vm.mapOpt.center = [116.379028, 39.865042]
                                }
                            });
                        }
                    }
                }]
            },
            map: null,
            driving: null,
            // 用于监听画图
            trackingData: null,
        }
    },
    created() {

    },
    computed: {
        ...mapState(['userInfo']),
    },
    watch: {
        order_id(value) {
            if (value) {
                if (this.driving) { this.driving.clear() }
                if (!this.map || !this.driving) {
                    this.initHandler()
                    this.loadList()
                } else {
                    this.loadList()
                }
            }
        },
        freshMap (n,o){
            if (n) {
                 // 刷新地图：fixed 地图初始化太小。
                this.trackingData = null
                this.loadList()
            }
        },
        trackingData: {
            handler(n, o) {
                let points = []
                let wayPoints = []
                let mergeReverse = (arr1, arr2) => arr1.concat(arr2.reverse())

                if (n) {
                    if (n.previous && n.previous.gps && n.previous.gps.length) {
                        points = mergeReverse(points, [...n.previous.gps])
                    }
                    if (n.current && n.current.gps && n.current.gps.length) {
                        points = mergeReverse(points, [...n.current.gps])
                    }
                    if (n.next && n.next.length) {
                        let _next = [...n.next].reverse()
                        _next.forEach((item) => {
                            if (item.gps && item.gps.length) {
                                points = mergeReverse(points, [...item.gps])
                            }
                        })
                    }
                    // 画线
                    if (points.length >= 2) {
                        points = points.map(item => { return [item.lng_gd, item.lat_gd] })
                        this.drawLine(points)
                    }
                } else {
                    if (this.driving) { this.driving.clear() }
                }

            },
            deep: true
        }

    },
    methods: {
        initHandler() {
            try {
                this.map = aMapManager.getMap();
                // 构造路线导航类
                this.driving = new AMap.Driving({ map: this.map });    
            } catch(e) {
            }
        },
        loadList() {
            if (!this.order_id) {return}
            getOrderTrace({ order_id: this.order_id }).then(data => {
                this.trackingData = data.resultObj
            })
        },
       
        drawLine(points) {
            let first = points[0]
            let last = points[points.length - 1]
            let wayPoints = points.slice(1, -1)
            let params = [first, last]
            if (wayPoints.length) { params.push({ waypoints: wayPoints }) }
            if (this.driving) { this.driving.clear() }

            if ((!this.driving || !this.map) && points.length ) { 
                this.initHandler()
                this.drawLine(points)
             }
            this.driving.search(...params)
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.initHandler()
            this.loadList()
        })
    }
}
</script>
<style scoped="">
</style>