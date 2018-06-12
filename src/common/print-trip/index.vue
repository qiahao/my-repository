<template>
    <div class="print-trip">
        <div class="print-trip-contain">
            <header>
                <div class="cf">
                    <h1 class="fl">运吧智慧物流平台</h1>
                    <div class="fr">
                        <div class="tag fl bd mr5">
                            <div class="bb fw-b">车次号</div>
                            <div>{{trip.trip_no}}</div>
                        </div>
                        <div class="tag fl bd">
                            <div class="bb fw-b">发车时间</div>
                            <div>{{trip.send_time}}</div>
                        </div>
                    </div>
                </div>

                <div class="p-row mtb10">
                    <div class="p-col-8">{{trip.send_area}} => {{trip.arrive_area}}</div>
                    <div class="p-col-8">司机：{{trip.driver_name}} {{trip.driver_mobile}}</div>
                    <div class="p-col-8">车辆：{{trip.truck_plate}}/{{trip.truck_length}}米/{{trip.truck_type}}</div>
                </div>

            </header>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th class="w110">运单号</th>
                            <th class="w80">目的地</th>
                            <th class="w60">收货人</th>
                            <th class="w60">件数(件)</th>
                            <th class="w90">货物</th>
                            <th class="w60">重量(吨)</th>
                            <th class="w60">体积(方)</th>
                            <th class="w60">代收货款</th>
                            <th class="w60">到付(元)</th>
                            <th class="w60">回单</th>
                            <th class="w60">交接方式</th>
                            <th class="">备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(order,i) in orderList" :key="i" v-if="!!trip.orders && !!trip.orders.length">
                            <td>{{order.order_no}}</td>
                            <td>{{order.end_area | areaFilter}}</td>
                            <td>{{order.end_link_man}}</td>
                            <td>{{order.cargo_total_amounts}}</td>
                            <td>{{order.cargo_names}}</td>
                            <td>{{order.cargo_total_weights}}</td>
                            <td>{{order.cargo_total_volumes}}</td>
                            <td>{{order.fee_dshk}}</td>
                            <td>{{order.pay_df}}</td>
                            <td>
                                <span v-if="backTypes[`${order.back_type}`]">{{backTypes[`${order.back_type}`]}} {{order.back_nums || 0}}份</span>
                                <span v-else>没有回单</span>
                            </td>
                            <!-- 回单 -->
                            <td>{{order.is_delivery == 'Y' ? '送货' : '自提'}}</td>
                            <td>{{order.shipper_remark}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="bd mt40">
                <div class="p-row ptb5 pl5 bb">
                    <div class="p-col-4">总件数: {{orderAmounts}}</div>
                    <div class="p-col-4">总重量: {{orderWeights}} 吨</div>
                    <div class="p-col-4">总体积: {{orderVolumes}} 方</div>
                    <div class="p-col-6">代收货款: {{orderDshks}} 元</div>
                    <div class="p-col-6">到付合计: {{orderDfs}} 元</div>
                </div>
                <div class="p-row ptb5 pl5 bb">
                    <div class="p-col-8">司机运费: {{trip.fee}} 元</div>
                    <div class="p-col-16">
                        {{payMethods[`${trip.pay_method}`]}}:
                        <span v-for="(v,k) in trip.pay_detail" :key="k">{{payTypes[`${k}`]}} {{v || 0}} 元</span>
                    </div>
                </div>
                <div class="p-row sign-row">
                    <div class="p-col-6">
                        <span class="label no-bl">司机签字</span>
                    </div>
                    <div class="p-col-6">
                        <span class="label">发站签字</span>
                    </div>
                    <div class="p-col-6">
                        <span class="label">到站签字</span>
                    </div>
                    <div class="p-col-6">
                        <span class="label">备注</span>
                    </div>
                </div>
            </div>
        </div>
        <link rel="stylesheet" media="print" href="/static/css/css-print/print-trip.css">
    </div>
</template>

<script>
const backTypes = {
  "0": "回执",
  "1": "原单",
  "2": "收条",
  "3": "电子回单",
  "4": "其它"
  // 'NO': '没有回单'
};

const payMethods = {
  "0": "现付",
  "1": "到付",
  "2": "回单付",
  "3": "月结",
  "4": "多笔付"
};

const payTypes = {
  pay_cash: "现付现金",
  pay_oil: "现付油卡",
  pay_arrive: "到付",
  pay_back: "回单付",
  pay_month: "月结"
};
export default {
  props: {
    value: false,
    trip: {
      default() {
        return {};
      }
    },
    orderList: {
        type: Array,
        default() {
        return [];
      }
    }
  },
  data() {
    return {
      backTypes,
      payMethods,
      payTypes
    };
  },
  computed: {
    orderAmounts () {

        return this.getOrderPropetyNums('cargo_total_amounts',1)
    },
    orderWeights () {
        return this.getOrderPropetyNums('cargo_total_weights',1000)
        
    },
    orderVolumes () {
        return this.getOrderPropetyNums('cargo_total_volumes',100)

    },
    orderDshks () {
        let numsArray = this.orderList.map(order => {
            if (Number(order.fee_dshk)) {
                return Number(order.fee_dshk)
            }
        }).filter(num => num)
        return getTotalNum (numsArray)
    },
    orderDfs () {
        let numsArray = this.orderList.map(order => {
            if (Number(order.pay_df)) {
                return Number(order.pay_df)
            }
        }).filter(num => num)
        return getTotalNum (numsArray)
    },
  },
  filters: {
    areaFilter (input) {
        let a1 = input.split('-'),l1 = a1.length,a2 = input.split(' '), l2 = a2.length
        if (l1 == l2 == 1) {
            return a1[0]
        }else if (l1 == 1) {
            return a2[l2-1]
        }else if (l2 == 1) {
            return a1[l1-1]
        }
        
        return input
        
    },
  },
  watch: {
    value(n) {
      if (n) {
        this.doPrint();
        setTimeout(() => {
          this.$emit("input", false);
        }, 500);
      }
    }
  },
  methods: {
    doPrint() {
      $(this.$el).jqprint();
      setTimeout(() => {
        this.$emit("input", false);
      }, 500);
    },
    getOrderPropetyNums(propety,times) {
        let numsArray = this.orderList.map(order => {
            if (Number(order[`${propety}`])) {
                return Number(order[`${propety}`])
            }
        }).filter(num => num)
        return getTotalNum(numsArray,times)
    }
  },
  created() {},
  mounted() {}
  
};

function getTotalNum (nums,times = 100) {

    let timesTotal = 0
    let deviceNum = Math.pow(times,nums.length)
    nums.forEach(n => {
        let t = n * times
        timesTotal += t
    });

    return timesTotal / times
}
</script>

<style src="../../../static/css/css-print/print-trip.css"></style>
