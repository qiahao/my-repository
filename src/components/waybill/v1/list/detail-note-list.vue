<template lang="html">
    <div class="mt20">
        <div 
            class="row-box row-box-auto mb10" 
            v-for="item in remarks">
            <Row>
                <i-col span="10">
                    <span class="mr10">{{item.note_time}}</span>
                    <span>{{item.note_user}}</span>
                </i-col>
                <i-col span="14">{{item.note_content}}</i-col>
            </Row>
        </div>
        <i-input 
            type="textarea" 
            placeholder="输入备注信息" v-model.trim="remark.note_content"></i-input>

        <div class="cf mtb10">
            <div class="fr">
                <i-button type="primary" @click="doOk">添加备注</i-button>
            </div>
        </div>
    </div>
</template>
<script>
    import {addOrderNote, getOrderNoteList} from '@/api/src/order'
    const remark = {note_content: ''}
    export default{
		props: {order_id: ''},
        name: 'orderStoreDetailNote',
        data:function(){
            return {
                remarks: [],
                remark: {...remark}
            }
        },
        computed: {
        },
        created(){
			
        },
        mounted (){
            // 路由跟新
            //bus.$on('detail-before-route-update', () => {this.loadNoteList()})
        },
        activated (){
            if (!this.order_id) {return}
            this.loadNoteList()
        },
		watch: {
			order_id(value) {
				if(value){
					this.loadNoteList()
				}
			}
		},
        methods :{
            // 确定新增备注
            doOk (){
                if (!this.remark.note_content) {return this.$Message.info('请输入备注内容')}
                let params = Object.assign({order_id: this.order_id, note_type: 1}, this.remark)
                addOrderNote(params).then((data)=>{
                    this.$Message.info({content: data.resultInfo, duration: 1 })
                    this.remark = {...remark}
                    this.loadNoteList()
                })
            },
            // 获取备注列表
            loadNoteList (){
                getOrderNoteList({order_id: this.order_id}).then((data)=>{this.remarks = data.resultObj })
            },
        },
        
    }
        
</script>