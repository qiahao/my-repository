<template>
    <!-- 查看回单照片 -->
    <div>
        <Modal id="picModal" v-model="modal" width="900">
            <div slot="header" class="pic-modal-header" v-if="order.order_no">
                <div>运单号：{{order.order_no}}</div>
                <div>
                    <span class="mr20">货物：{{order.c_amounts + '件 /'}} {{order.c_weights + '吨 /'}} {{order.c_volumes + 'm3'}} </span>
                    <span class="mr20">托运方： {{order.send_company + '/'}} {{order.begin_link_man + '/'}} {{order.begin_link_mobile}}</span>
                    <span>收货方： {{order.end_link_man + '/'}} {{order.end_link_mobile}}</span>
                </div> 
                <!-- todo -->
                <div v-if="order.driver_name">
                    <span class="mr10">司机：{{order.driver_name}},{{order.driver_tel}},{{order.truck_plate}}</span>
                    <span class="mr10">车型：{{order.truck_type}}</span>
                    <span class="mr10">车长：{{order.truck_length}}米</span> 
                    <span class="mr10">装载：{{order.trip_load}}</span> 
                    <span>运费：{{order.driver_order_fee || 0}}元</span>
                </div>
                
                <!-- <div v-if="order.driver_name">
                    <span class="mr10">司机：{{order.driver_name}},{{order.driver_tel}},{{order.truck_plate}}</span>
                    <span class="mr10">车型：{{order.truck_type}}</span>
                    <span class="mr10">车长：{{order.truck_length}}米</span> 
                    <span class="mr10">装载：{{order.trip_load}}</span> 
                    <span>运费：{{order.driver_order_fee || 0}}元</span>
                </div> -->

            </div>
            <div slot="header" class="pic-modal-header" v-else>
                <h2>回单照片</h2>
            </div>
            <Row class="pic-modal-row">
                <Col span="18">
                    <img :src="activePhoto" alt="">
                </Col>
                <Col span="5" offset="1">
                    <img :src="p" alt="" v-for="(p,i) in photos" :key="i" @click="setActivePhoto(p)">
                </Col>
            </Row>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    import config from '@/config'
    import bus from '@/utils/bus'
    const IMG_PREFIX = config.imgHost

    export default {
        name: 'photoDetailModal',
        data (){
            return {
                modal: false,
                activePhoto: '',
                order: {},
                photos: [],
			}
		},
		methods: {
            setActivePhoto (p){
                this.activePhoto = p
            }
        },
        watch: {
            photos (n,o) {
                if (n) {
                    this.activePhoto = n[0]
                }
            },
        },
        mounted (){
            let vm = this;
            bus.$on('open-photo-modal',(o)=>{
                vm.order = o
                let childOpPics
                let OpPics
                OpPics = o.op_pics ? o.op_pics.split(',') : []
                
                childOpPics = o.child_op_pics ? o.child_op_pics.split(',') : []
                vm.photos =[...OpPics ,...childOpPics]
                vm.photos.length ? vm.modal = true : vm.$Message.info('该回单没有回单照片!');
            });
        }
	}
</script>
<style scoped lang="scss">
#picModal{
    img{
        width: 100%;
    }
}
.pic-modal-row{
    height: 400px;
    .ivu-col{
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        &.ivu-col-offset-1{
            img{
                margin-bottom: 5px;
            }
        }
    }
} 
.pic-modal-header{
    line-height: 1.6;
    font-size: 13px;
}
</style>
