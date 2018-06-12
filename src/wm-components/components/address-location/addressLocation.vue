<template>
    <div>
        <editable-drop v-model="query" :disabled="disabled"  :placeholder="placeholder" @on-change="changeHandle">
            <editable-drop-option  @click.native="clickHandle(item)" v-for="(item,i) in addrList" :data="item" :value="item.address" :key="i">{{item.name +' - ' + item.address}}</editable-drop-option>
        </editable-drop>
    </div>

</template>
<script>
import Amap  from 'vue-amap';
import { editableDrop , editableDropOption }  from '../editable-drop/index';
export default {
    name: 'addr',
    props: {
        value: '',
        placeholder: {
            default: '请选择地址'
        },
        disabled: {
            default: false
        },
        cityCode: {
            default: '010'
        },
    },
    data() {
        return {
            query: '',
            addrData: '',
            addrList: [],
            timer: '',
            lng: '',
            lat: '',
            addrcode: '',
        }
    },
    components: {
        editableDrop:editableDrop,
        editableDropOption:editableDropOption,
    },
    watch: {
        value(n){
            if(n === undefined || n==''){
                this.query = ''
                this.addrList = []
                return 
            }
            let array = n.split('$');
            if(array.length==1 && n){
                this.query = array[0]
                this.getAddrMap(array[0])
            }
        },
        cityCode(n){
            this.addrcode = n
            if(n && this.query!=''){
                this.getAddrMap(this.query)
            }
        }

    },
    methods: {
        changeHandle(e){
            let vm = this
            if(e == ''){
                this.addrData = ''
                return this.$emit('input', '')
            }
            clearTimeout(vm.timer);
            vm.timer = setTimeout(function(){
                vm.getAddrMap(e)
            },500);

        },
        getAddrMap(e){
            let vm = this
            let addr = e
            if(!e){
                vm.addrList =  []
                return
            }

            vm.addrcode = vm.addrcode?vm.addrcode:'010'
            AMap.service(["AMap.PlaceSearch"], function() {

                var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                    pageSize: 20,
                    pageIndex: 1,
                    city: vm.addrcode, //城市
                });
                //关键字查询
                placeSearch.search(addr, function(status, result) {
                    if(result.info == 'OK'){
                        vm.addrList =  result.poiList.pois
                        vm.lng = result.poiList.pois[0].location.lng
                        vm.lat = result.poiList.pois[0].location.lat
                        vm.$emit('input', vm.query +"$"+vm.lng+"$"+vm.lat)
                    }  
                    else{
                        vm.addrList =  []
                        vm.$Message.error('请输入正确详细地址信息！')
                    }
                });
            });
        },
        clickHandle(e) {
            let vm = this
            vm.addrData = e.address+"$"+e.location.lng+"$"+e.location.lat
            vm.$emit('input', vm.addrData)
        },
    },
    mounted() {
    },
}
</script>