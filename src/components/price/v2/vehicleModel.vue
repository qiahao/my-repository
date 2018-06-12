<template lang="html">
<Modal v-model="modelValue" width="520" title="车辆管理">
    <div>
        <label class="ml20 mr5">车长</label><i-select style="width:120px" v-model="truck.truck_length">
            <i-option v-for="item in truckLength" :value="item.dict_value" :key="item">{{item.dict_text}}</i-option>
        </i-select>
        <label class="ml20 mr5">车型</label><i-select style="width:130px" v-model="truck.truck_type">
            <i-option v-for="item in truckType" :value="item.dict_value" :key="item">{{item.dict_text}}</i-option>
        </i-select>
        <i-button type="primary"  class="ml20" @click="addSection">增加</i-button>
    </div>   
    <div class="mt20 ml20">
        <ul  class="clearfix section-list">
            <li v-for="(item,index) in truckList"><span>{{item.key}}</span><span  @click="removeSection(index)"><Icon class="ml5" type="close-circled"></Icon></span></li>
        </ul>
    </div>
    <div slot="footer">
        <i-button type="primary" size="large"  @click="submit">确定</i-button>
    </div>
</Modal>
</template>
<script>
    import *  as DICTS from '@/api/src/dictApi'
    export default{
        props: {
            list: '', 
            value: '',
        },
        data:function(){
             return {
                truck: {
                    truck_length: '',
                    truck_type: '',
                },
                truckList: [],
                modelValue: false,
                truckLength: [],
                truckType: [],
             }
        },
        created (){
            this.loadDicts();
        },
        watch: {
            value (){
                this.modelValue = this.value;
            },
            modelValue (){
                this.$emit('input',this.modelValue)
            },
            list: {
                handler: function(curVal,oldVal){
                    this.truckList=this.list
    　　　　　　　},
                deep:true
            },
        },
        methods :{
            //载入详情数据和配载运单列表
            loadDicts (){
                let _vm = this
                DICTS.dictTruckLengthApi().then(json=>{
                    if(json.result==1){
                        _vm.truckLength = json.resultObj;
    
                    }else{
                        _vm.$Message.error(json.resultInfo)
                    }
                   
                });
                DICTS.dictTruckTypeApi().then(json=>{
                    if(json.result==1){
                        _vm.truckType = json.resultObj;
                    }else{
                        _vm.$Message.error(json.resultInfo)
                    }
                });
            },
            submit (){
                this.$emit('getList',this.truckList)
                this.modelValue=false;
            },
            addSection (){
                if(this.truck.truck_length==''){
                    return this.$Message.error("请选择车长")
                }
                if(this.truck.truck_type==''){
                    return this.$Message.error("请选择长型")
                }
                let key=this.truck.truck_length +'_'+ this.truck.truck_type
                let name=this.truck.truck_length +'米 '+ this.truck.truck_type
                this.truckList.push({key,name,val:'',val:''})
            },
            removeSection (e){
                this.truckList=this.truckList.slice(0,e).concat(this.truckList.slice(e+1,this.truckList.length));
            }
        }
    }
        
</script>
<style>

.section-list li{
    border:1px solid #eee;
    padding:0 10px;
    border-radius:5px;
    display:inline-block;
    margin-right:10px;
    height:32px;
    line-height:28px;
    margin-bottom:10px;
    font-size:14px

}
</style>