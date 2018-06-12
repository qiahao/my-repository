<template>
    <div>
        <i-form 
            ref="cargosForm" 
            :label-width="0" 
            :model="order" 
            :rules="orderRules"
            >
            <!-- 货物名称 -->
            <div class="row-box mb10">
                <Row 
                    class="tc" 
                    v-for="(cargo,index) in order.cargos" 
                    :key="index">
                    <i-col span="4">
                        <Form-item >
                            <editable-drop v-model.trim="cargo.c_name" placeholder="品号/货物名称">
                                <editable-drop-option 
                                    v-for="(item,i) in historyCargos" 
                                    :value="item.c_name" 
                                    :key="i">
                                    {{item.c_name}}
                                </editable-drop-option>
                            </editable-drop>
                        </Form-item>
                    </i-col>
                    <i-col span="4">
                        <Form-item 
                            :prop="'cargos.' + index + '.c_pack'" 
                            :rules="orderRules.cargos[index].c_pack">
                            <editable-drop v-model="cargo.c_pack" placeholder="包装">
                                <editable-drop-option 
                                    v-for="(item,i) in historyPacks" 
                                    :value="item.dict_value" 
                                    :key="i">
                                    {{item.dict_value}}
                                </editable-drop-option>
                            </editable-drop>
                        </Form-item>
                    </i-col>
                    <i-col span="4">
                        <Form-item 
                            :prop="'cargos.' + index + '.c_amount'" 
                            :rules="orderRules.cargos[index].c_amount">
                            <Input placeholder="件数（必填）" v-model.trim='cargo.c_amount'></Input>
                        </Form-item>
                    </i-col>
                    <i-col span="4">
                        <Form-item 
                            :prop="'cargos.' + index + '.c_weight'" 
                            :rules="orderRules.cargos[index].c_weight"> 
                            <Input placeholder="重量（吨）" v-model='cargo.c_weight'></Input>
                        </Form-item>
                    </i-col>
                    <i-col span="4">
                        <Form-item 
                            :prop="'cargos.' + index + '.c_volume'" 
                            :rules="orderRules.cargos[index].c_volume"> 
                            <Input @on-blur="volumeCacl(cargo)" placeholder="长*宽*高（m³）" v-model='cargo.c_volume'></Input>
                        </Form-item>
                    </i-col>

                    <i-col span="4">
                        <Form-item 
                            class="price-num" 
                            :prop="'cargos.' + index + '.c_price'" 
                            :rules="orderRules.cargos[index].c_price">
                            <Input placeholder="单价" v-model='cargo.c_price'></Input>
                        </Form-item>
                        <Select class="price-unit" v-model='cargo.c_price_unit'>
                            <Option value="元/吨">元/吨</Option>
                            <Option value="元/件">元/件</Option>
                            <Option value="元/方">元/方</Option>
                        </Select>
                    </i-col>
                </Row>
            </div>
        </i-form>
    </div>
</template>
<script>
    import { dictCargoPackApi } from '@/api/src/dictApi'
    import { getCargosList } from '@/api/src/common'
    import * as constants from './constant.js'



    function copyArray (obj,l){
        let rst = []
        for (let i = 0; i < l; i++) {
            rst[i] = {...obj}
        }
        return rst
    };


    const phoneRge = /^\d{11,12}$/
    export default {
        name: 'orderStoreDetailBaseInfoCargos',
        props: {
            order: {
                type: Object,
                default: () => {return {}}
            }
        },
        data:function(){
            
            const validPack = (i) => {
                let vm = this
                return function (rule, value, callback) {
                    if (vm.order.cargos[i].c_name && !value) callback(new Error('这是必填项'))
                    else callback()
                }
            }
            /**
             * 根据货物名称 和单位判断是否必填
             * Tue Sep 26 15:32:26 2017
             * 修改验证规则
             */
            const validAmount = (i) => {
                let vm = this
                return function (rule, value, callback) {
                    if (vm.order.cargos[i].c_name) {
                        if (vm.order.cargos[i].c_price_unit == '元/件') {
                            if (!value) callback(new Error('请输入件数'))
                            else if ( !constants.intRge.test(value)) callback(new Error('请输入正整数'))
                            else callback()
                        }else if(!!value){
                            if (!constants.intRge.test(value)) callback(new Error('请输入正整数'))
                            else callback()
                        }else{
                            callback()
                        }
                    } else {
                        callback()
                    }
                }
            }
            const validWeight = (i) => {
                let vm = this
                return function (rule, value, callback) {
                    if (vm.order.cargos[i].c_name) {
                        if (vm.order.cargos[i].c_price_unit == '元/吨') {
                            if (!value) callback(new Error('请输入重量'))
                            else if (!constants.numRge.test(value)) callback(new Error('请输入数字'))
                            else if (!constants.num3Rge.test(value) || value <= 0 || value >= 100) callback(new Error('重量需小于100，且小数不能超过3位'))
                            else callback()
                        }else if (!!value) {
                            if (!constants.numRge.test(value)) callback(new Error('请输入数字'))
                            else if (!constants.num3Rge.test(value) || value <= 0 || value >= 100) callback(new Error('重量需小于100，且小数不能超过3位'))
                            else callback()
                        }else {
                            callback()
                        }
                    } else {
                        callback()
                    }
                }
            }
            const validVolume = (i) => {
                let vm = this
                return function (rule, value, callback) {
                    if (vm.order.cargos[i].c_name) {
                        if (vm.order.cargos[i].c_price_unit == '元/方') {
                            if (!value) callback(new Error('体积不能为空'))
                            else if (!constants.numRge.test(value)) callback(new Error('请输入数字'))
                            else if (!constants.num2Rge.test(value) || value <= 0 || value >= 1000) callback(new Error('体积需小于1000，且小数不能超过2位'))
                            else callback()
                        } else if(!!value){
                            if (!constants.numRge.test(value)) callback(new Error('请输入数字'))
                            else if (!constants.num2Rge.test(value) || value <= 0 || value >= 1000) callback(new Error('体积需小于1000，且小数不能超过2位'))
                            else callback()
                        }else{
                            callback()
                        }
                    } else {
                        callback()
                    }
                }
            }
            const validPrice = (i) => {
                let vm = this
                return function (rule, value, callback) {
                    if (vm.order.cargos[i].c_name) {
                        if (!value) callback(new Error('请输入单价'))
                        else if (!constants.numRge.test(value) || !constants.num2Rge.test(value)) callback(new Error('请输入数字，且小数不能超过2位'))
                        else if (value <= 0 || value >= 10000) callback(new Error('价格需小于10000'))
                        else callback()
                    } else callback()
                }
            }

            return {
                cargosForm: null,
                historyCargos: [], // 历史货物名称记录
                historyPacks: [], // 历史包装记录
                // // todo:  验证未完善
                orderRules: {
                    cargos: (function (){
                        let _orderRules = []
                        for (let i = 0; i < 3; i++) {
                            let _cargoRuleObj = {
                                c_pack: {validator: validPack(i),  trigger: 'blur change'},
                                c_amount: {validator: validAmount(i),  trigger: 'blur'},
                                c_weight: {validator: validWeight(i),  trigger: 'blur'},
                                c_volume: {validator: validVolume(i),  trigger: 'blur'},
                                c_price: {validator: validPrice(i),  trigger: 'blur'},
                            }
                            _orderRules.push(_cargoRuleObj)
                        }
                        return _orderRules
                    })()
                }
            }
        },
        mixins: [],
        components: {},
        computed: {
        },
        watch: {
        },
        methods :{
            initHandle (){
                getCargosList({page: 1,page_size: 10}).then((data) => {this.historyCargos = data.resultObj })
                dictCargoPackApi().then((data) => {this.historyPacks = data.resultObj })
            },
            // 当体积输入为 l*w*h 时计算总和
            volumeCacl (cargo){
                let volume = cargo.c_volume || '' 
                let valArr = volume.split('*') 
                if (valArr.length == 3 && !valArr.some((item) => isNaN(Number(item)) )) {
                    cargo.c_volume = Math.round(valArr.reduce((fn,an) => fn * an ) * 100) / 100 + ''
                }
            }
            
        },
        created(){
            this.initHandle()
        },
        mounted (){
            this.cargosForm = this.$refs.cargosForm
            bus.$on('save-base-info',()=>{
                this.cargosForm.validate((valid)=>{
                    let _hasCargo = this.order.cargos.some((item) => {return item.c_name})
                    this.$emit('child-complete', valid && _hasCargo)
                })
            })
        }
    }
        
</script>
<style lang="scss" scoped>

</style>