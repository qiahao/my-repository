<template>
    <div class="page-main">
        <Row class="page-content">
            <div class="home-count-tit">运单统计</div>
            <Col span="11" class="pt5 chart-content e1">
                <p>最近30天的运单总数：<span class="home-yd-num">{{total}}单</span></p>
                <chart :options="orderStateScale" ref="orderStateScale"></chart>
            </Col>
            <Col span="13"  class="chart-content">
                <chart :options="orderCountsWeights" ref="orderCountsWeights"></chart>
            </Col>
        </Row>
        <Row class="page-content mt10">
            <div class="home-count-tit">车次统计</div>
            <Col span="12" class="chart-content">
                <chart :options="tripCarrierScale" ref="tripCarrierScale"></chart>
            </Col>
            <Col span="12"  class="chart-content">
                <chart :options="tripSends" ref="tripSends"></chart>
            </Col>
        </Row>
    </div>
</template>
<script>
    import * as home from '@/api/src/homeApi'
    import { mapState } from 'vuex'

    import { initOrderStateScale } from './data/initOrderStateScale'
    import { initOrderCountsWeights } from './data/initOrderCountsWeights'
    import { initTripCarrierScale } from './data/initTripCarrierScale'
    import { initTripSends } from './data/initTripSends'

    export default {
        name: 'home',
        data () {
            return {
                total:0,
                orderStateScale: initOrderStateScale,
                orderCountsWeights: initOrderCountsWeights, 
                tripCarrierScale: initTripCarrierScale,
                tripSends: initTripSends,
            }
        },
        computed: {
            ...mapState(['userInfo'])
        },
        mounted() {
            let _vm = this;
            let params = { company_id: this.userInfo.company_id }

            this.renderChart(this.$refs.orderStateScale, 
                    params, 
                    home.reportOrderStateScale, 
                    (chart, obj) => {
                        _vm.total=obj.total;
                        initOrderStateScale.title.text = ''
                        initOrderStateScale.series[0].data[0].value = obj.signeds
                        initOrderStateScale.series[0].data[1].value = obj.runnings
                        initOrderStateScale.series[0].data[2].value = obj.unsends
                        setTimeout(() => {
                            chart.mergeOptions(initOrderStateScale);
                        }, 300)
                    })

            this.renderChart(this.$refs.orderCountsWeights,
                    params,
                    home.reportOrderCountsWeights,
                    (chart, obj) => {
                        let days = [],
                            cnts = [],
                            weights = [],
                            dataobj = obj.slice(0,7)
                        dataobj.reverse().forEach((x) => {
                            days.push(x.days.substring(5,10));
                            cnts.push(x.order_cnts);
                            weights.push(x.order_weights);
                        })
                        initOrderCountsWeights.xAxis.data=days;
                        initOrderCountsWeights.series[0].data=cnts;
                        initOrderCountsWeights.series[1].data=weights;
                        chart.mergeOptions(initOrderCountsWeights);
                    })

            this.renderChart(this.$refs.tripCarrierScale,
                    params,
                    home.reportTripCarrierScale,
                    (chart, obj) => {
                        initTripCarrierScale.series[0].data[0].value=obj.wx;
                        initTripCarrierScale.series[0].data[1].value=obj.zy;
                        chart.mergeOptions(initTripCarrierScale);
                    })

            this.renderChart(this.$refs.tripSends,
                    params,
                    home.reportTripSends,
                    (chart, obj) => {
                        let days=[],
                            cnts=[]
                        obj.reverse().forEach((x) => {
                            days.push(x.days.substring(5,10))
                            cnts.push(x.send_cnts)
                        });
                        initTripSends.xAxis[0].data=days;
                        initTripSends.series[0].data=cnts;
                        chart.mergeOptions(initTripCarrierScale);
                    })

        },
        created() {

        },
        methods: {
            renderChart(chart, params, axios, callback) {
                chart.showLoading({
                    text: '数据加载中...'
                })
                axios.call(this, params).then((data) => {
                    chart.hideLoading();
                    if (data && data.result == 1) {
                        let obj = data.resultObj
                        callback.call(this, chart, obj);
                    } else {
                        this.$Message.warning(data.resultInfo)
                    }
                })
            },
            // 30日内各状态下的运单的占比
            reportOrderStateScale() {
                var _vm = this;
                /*let chart = this.$refs.orderStateScale
                chart.showLoading({
                    text: '数据加载中...'
                })
                let params = { company_id: this.userInfo.company_id }
                home.reportOrderStateScale(params).then((data) => {
                    chart.hideLoading()
                    if (data && data.result == 1) {
                        let obj = data.resultObj
                        _vm.totalobj.total;
                        initOrderStateScale.title.text = ''
                        initOrderStateScale.series[0].data[0].value=obj.signeds
                        initOrderStateScale.series[0].data[1].value=obj.runnings
                        initOrderStateScale.series[0].data[2].value=obj.unsends
                        setTimeout(() => {
                            chart.mergeOptions(initOrderStateScale);
                        }, 300)
                    } else {
                        this.$Message.warning(data.resultInfo)
                    }
                })*/
            },
            reportOrderCountsWeights() { },
            reportTripCarrierScale() { },
            reportTripSends() { }
        },

    }
</script>
<style scoped>
    .page-main{
        padding:10px;
        background:rgb(235, 235, 235)
    }
    .chart-content{
        padding:20px
    }
    .page-content{
        border-left:1px solid #e8e8e8;
        background:#fff
    }
    .home-count-tit{
        height: 62px;
        line-height: 62px;
        background: #fff;
        color:#2f353b;
        font-size: 20px;
        border-bottom:1px solid #ebebeb;
        padding-left:20px;

    }
    .home-yd-num{
        color:#0071c0;
        font-size:20px
    }
    .e1 .echarts{
        height: 360px;
    }
    .echarts {
        width:95%;
        height: 400px;
    }
</style>