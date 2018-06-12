<template lang="html">
    <div>
        <div class="mb30 mt20" v-for="(exception,i) in exceptions">
            <Row>
                <i-col span="4">登记人：{{exception.ex_user_name}}</i-col>
                <i-col span="6">{{exception.ex_time}}</i-col>
                <i-col span="7" offset="7">当前状态：
                    <Radio-group v-model="exception.ex_state" @on-change="changeExceptionState(exception)">
                        <Radio label="0">未处理</Radio>
                        <Radio label="1">已处理</Radio>
                    </Radio-group>
                </i-col>
            </Row>
            
            <Collapse v-model="collapse[i]">
                <Panel>
                    <span>{{exception.ex_content}}</span>
                    <div slot="content">
                        <ul class="mb20">
                            <li class="row-box row-box-auto" v-for="item in exception.result_list">
                                <Row>
                                    <i-col span="6">{{item.result_time}}</i-col>
                                    <i-col span="4">{{item.result_user_name}}</i-col>
                                    <i-col span="14">{{item.result_content}}</i-col>
                                </Row>
                            </li>
                        </ul>
                        <Row>
                            <i-col span="20">
                                <i-input 
                                    type="textarea" 
                                    placeholder="输入最新处理情况"
                                    v-model="exception.newResult" :key="i"></i-input>
                            </i-col>
                            <i-col span="3" offset="1">
                                <i-button type="primary" @click="addExceptionResult(exception,i)">确定</i-button>
                            </i-col>
                        </Row>
                    </div>
                </Panel>
            </Collapse>
        </div>
        <div class="tc">
            <i-button 
                type="primary" 
                size="large" 
                class="mtb30" 
                style="width: 120px;" 
                @click="addException">登记异常</i-button>
        </div>

        <!-- 添加异常弹框 -->
        <modal-exception></modal-exception>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import moment from 'moment'
import modalException from './modalException'
import { getExceptionList, addException, addExceptionResult, editExceptionState } from '@/api/src/exception'
export default {
    name: 'orderStoreDetailException',
    props: {order_id: ''},
    data() {
        return {
            // 异常列表
            exceptions: [],
            // 打开手风琴面板数组
            collapse: [],
            // 新登记的异常
            // 数组对应的 
            exceptionsResults: [],
        }
    },
    computed: {
        ...mapState(['userInfo']),
        id() {
            return this.$route.query.id
        }
    },
    components: {
        modalException
    },
    watch: {
        order_id(value) {
            if(value!=""){
                this.loadException();
            }
        }
    },
    methods: {
        // 获取异常
        loadException(ii = 0) {
            getExceptionList({ order_id: this.order_id }).then((data) => {
                this.exceptions = data.resultObj
                // 特殊处理 手风琴打开关闭
                // 使用多组手风琴 一组只有一个item 值都为索引 0
                this.collapse = []
                this.exceptions.forEach((item, i) => {
                    this.$set(item,'newResult', '')
                    this.collapse.push(i == ii ? [0] : [])
                })
            })
        },
        // 修改异常状态
        changeExceptionState(except) {
            editExceptionState({ ex_id: except.ex_id, ex_state: except.ex_state, order_id: this.order_id }).then((data) => {
                this.$Message.info({ content: data.resultInfo, duration: 1 })
            })
        },
        // 新增异常处理
        addExceptionResult(except,i) {
            if (!except.newResult) return this.$Message.error({ content: '请输入异常情况', duration: 1 })
            let params = { exception_id: except.ex_id, result_content: except.newResult, result_time: moment().format('YYYY-MM-DD HH:mm:ss') }
            addExceptionResult(params).then((data) => {
                this.$Message.success({ content: data.resultInfo, duration: 1 })
                this.loadException(i)
                bus.$emit('operation-reload')
            })

        },
        
        // 打开异常登记
        addException() {
            bus.$emit('add-exception',this.order_id)
        },
      
    },
    created() { },
    mounted() {
        // 添加异常完成 刷新
        bus.$on('order-expeption-reload', () => {this.loadException() })
    },
}

</script>