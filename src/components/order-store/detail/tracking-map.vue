<template>
    <div>
        <Modal v-model="modal" width="960">
            <p slot="header" style="color:#f60;text-align:center">
            </p>
            <div>
                <el-amap vid="amapDemo" :center="mapOpt.center" :map-manager="mapOpt.mapManager" :zoom="mapOpt.zoom" :events="mapOpt.events" :plugin="mapOpt.plugins" style="height:500px; width: 100%;"></el-amap>
            </div>
        </Modal>
    </div>
</template>
<script>
// import { getOrderTrace } from '@/api/src/order.js'
import { AMapManager } from 'vue-amap';
// import map from 'vue-amap';
let aMapManager = new AMapManager()
export default {
    props: {
        value: {
            // type: Boolean,
            default: false
        },
        orderId: {
            default: null
        }
    },
    data() {
        let _vm = this
        return {
            modal: this.value,

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
            trackingData: {},
            mapRoadPoint: [],
            mapSoptPoint: [],

        }
    },
    computed: {
        id: function() {
            return this.$route.params.id
        },

    },
    watch: {
        value: function(n, o) {
            this.modal = n
        },
        modal: function(n, o) {
            if (n) {
            	if (this.driving) {this.driving.clear()}

                if (!this.map || !this.driving) {
                    this.initHandler()
                    this.getOrderTrace()
                } else {
                    this.getOrderTrace()
                }
            }
            this.$emit('input', n)
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
                    // points = [[116.379028, 39.865042],[116.379028, 39.965042],[116.379028, 39.165042]]
                    // return this.drawLine(points)
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
        getOrderTrace() {
            this.$api.order.getOrderTrace({ order_id: this.id }).then(data => {
                this.trackingData = data.resultObj
            })

        },
        initHandler() {
            this.map = aMapManager.getMap();
            // 构造路线导航类
            this.driving = new AMap.Driving({ map: this.map });
            // this.getOrderTrace()
        },
        drawLine(points) {
            let first = points[0]
            let last = points[points.length - 1]
            let wayPoints = points.slice(1, -1)
            let params = [first, last]
            if (wayPoints.length) { params.push({ waypoints: wayPoints }) }

            if (this.driving) { this.driving.clear() }

            this.driving.search(...params)
        }
    },
    created() {},
    mounted() {
        this.initHandler()
    }
}
</script>