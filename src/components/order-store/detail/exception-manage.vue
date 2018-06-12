<template lang="html">
    <div>
        <div class="mb30" v-for="(exception,i) in exceptions">
            <Row>
                <i-col span="4">登记人：{{exception.ex_user_name}}</i-col>
                <i-col span="4">{{exception.ex_time}}</i-col>
                <i-col span="6" offset="10">当前状态：
                    <Radio-group v-model="exception.ex_state" @on-change="changeExceptionState(exception)">
                        <Radio label="0">未处理</Radio>
                        <Radio label="1">已处理</Radio>
                    </Radio-group>
                </i-col>
            </Row>
            
            <Collapse v-model="collapse[i]">
                <Panel>
                    <span class="ml20">异常描述：{{exception.ex_content}}</span>
                    <div slot="content">
                        <ul class="mb20">
                            <li class="row-box row-box-auto" v-for="item in exception.result_list">
                                <Row>
                                    
                                    <i-col span="17">{{item.result_content}}</i-col>
                                    <i-col span="3">{{item.result_user_name}}</i-col>
                                    <i-col span="4">{{item.result_time}}</i-col>
                                    
                                </Row>
                            </li>
                        </ul>
                        <Row v-if="isEditable">
                            <i-col span="20">
                                <i-input 
                                    type="textarea" 
                                    placeholder="输入最新处理情况"
                                    v-model="exception.newResult" :key="i"></i-input>
                            </i-col>
                            <i-col span="3" offset="1">
                                <i-button type="primary" @click="addExceptionResult(exception,i)">回复</i-button>
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
                v-show="isEditable"
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
import detailChildMixin from '@/mixins/detail-child-mixin.js'

export default {
    name: 'orderStoreDetailException',
    props: {
        isEditable: {
            default: false
        }
    },
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
    mixins: [detailChildMixin],
    computed: {
        ...mapState(['userInfo']),
    },
    components: {modalException},
    methods: {
        init (){
            this.loadException()
        },
        // 获取异常
        loadException(ii = 0) {
            getExceptionList({ order_id: this.id }).then((data) => {
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
            editExceptionState({ ex_id: except.ex_id, ex_state: except.ex_state, order_id: this.id }).then((data) => {
                this.$Message.info({ content: data.resultInfo, duration: 1 })
                bus.$emit('order-list-reload')
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
                bus.$emit('order-list-reload')
            })

        },
        
        // 打开异常登记
        addException() {
            bus.$emit('add-exception',this.id)
        },
      
    },
    created() { },
    mounted() {
        // 路由跟新
        // 添加异常完成 刷新
        bus.$on('expeption-reload', () => {this.loadException() })
    },
}

</script>