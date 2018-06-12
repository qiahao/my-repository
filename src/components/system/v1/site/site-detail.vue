<template>
    <div>
        <slide-modal v-model="model.show" @slide-modal-close="directBack">
            <div slot="head">{{ model.title }}</div>
            <div style="width:85%">
                <Form ref="parterDetail" :model="parterDetail"  :rules="siteRule" :label-width="130">
                    <Form-item label="合作关系" prop="partener_type">
                        <Radio-group v-model="parterDetail.partener_type" >
                            <Radio label="0">自有网点</Radio>
                            <Radio label="1">合作网点</Radio>
                        </Radio-group>
                    </Form-item>
                    <Form-item label="网点／公司名称:" prop="partener_name">
                        <i-input v-model="parterDetail.partener_name"/>
                    </Form-item>
                    <Form-item label="联系人:" prop="partener_link_man">
                        <i-input v-model="parterDetail.partener_link_man"/>
                    </Form-item>
                    <Form-item label="手机号码:" prop="partener_link_tel">
                        <i-input v-model="parterDetail.partener_link_tel" />
                        <!-- @on-change="onBlurPartenerLinkTel" -->
                    </Form-item>
                    <Form-item label="所在城市:" prop="partener_area">
                        <province-cascader v-model="provinceTemp" ref="refProvince"></province-cascader>
                    </Form-item>
                    <Form-item label="详细地址" prop="partener_addr">
                        <i-input icon="location" @on-focus="mapSwitch" v-model="parterDetail.partener_addr"/>
                    </Form-item>
                    <div class="tc">

                        <Button type="primary" @click="submitPartnerDetail('parterDetail')"
                                size="large">保存</Button>

                    </div>
                
                </Form>
            </div>
        </slide-modal>
        <map-modal :mapModal="mapModal.show" :addrMap="addrMap" @returnPoint="procPixel"></map-modal>

    </div>
</template>
<script>
    import slideModalMixin from '@/mixins/slideModalMixin'
    import * as siteApi from '@/api/src/siteApi'
    import { amapManager,VueAMap } from 'vue-amap';
    import rule from '@/utils/validate-rule'

    const MOBILE_RGE = /^1[3|4|5|7|8|][\d]{9}$/;

    const SITE_RULE = {
        partener_type: [
            { required: true, message: '这是必填项', }
        ],
        partener_name: [
            { required: true, message: '这是必填项', }
        ],
        partener_link_man: [
            { required: true, message: '这是必填项', }
        ],
        partener_link_tel: [
            { required: true, message: '这是必填项', },
            { validator: rule.phone,  trigger: 'blur'},
        ],
        partener_area: [
            { required: true, message: '这是必填项', },
        ],
        partener_addr: [
            { required: true, message: '这是必填项', },
        ],
    }
    const EMPTY_SITE = {
        partener_type:       '0',         //合作网点类型
        partener_name:       "",         //合作网点名称
        partener_link_man:   "",         //联系人
        partener_link_tel:   "",         //联系人电话
        partener_area:       "",         //地区
        partener_area_code:  "",         //地区编码
        partener_addr:       "",         //地址
        partener_lng:        "",         //纬度
        partener_lat:        "",         //经度
        partener_shipper_id:"",
    }

    export default {
        name: 'site',
        data (){
            return {
                siteId: '',
                provinceTemp: "110100",
                siteRule: Object.freeze(SITE_RULE), 
                parterDetail: {},
                center_pixel : [],
                addrMap: null, // 地图信息对象
                model: {
                    show: false,
                    title: "合作网点详情"
                },
                mapModal:{                  //地图启用/禁用状态
                    show: false,
                },
                provinces: '110100',        //地区编码
            }
        },
        mixins: [slideModalMixin],
        watch: {
            '$route' : function(n,o) {
                let vm = this
                this.watchRouteIdHandler(n.query.id)
                
                setTimeout(()=>{vm.model.show = true},300)
            },
            'provinceTemp' : function (n){
                let areaString = n.split('$')
                this.parterDetail.partener_area_code = areaString[0]
                this.parterDetail.partener_area = areaString[1]
            },
            'parterDetail.partener_link_tel' : function (n){
                let vm = this
                if (!this.siteId && n && MOBILE_RGE.test(n)) {
                    siteApi.siteDetailByMobile({mobile: n}).then((data) => {
                        let obj = data.resultObj;
                        if (obj) {
                            vm.parterDetail.partener_name      = obj.company_name;
                            vm.parterDetail.partener_link_man  = obj.link_man;
                            //vm.parterDetail.partener_link_tel  = obj.link_mobile;
                            vm.parterDetail.partener_area      = obj.company_area;
                            vm.parterDetail.partener_area_code = obj.company_area_code;
                            vm.parterDetail.partener_addr      = obj.company_address;
                            vm.parterDetail.partener_lng       = obj.company_lng;
                            vm.parterDetail.partener_lat       = obj.company_lat;
                            vm.provinceTemp = vm.parterDetail.partener_area_code + "$" + vm.parterDetail.partener_area;
                        }
                    });
                }
            }
        },
        methods: {
            loadDetail (){
                let params = { partener_id: this.$route.query.id };
                siteApi.siteDetail(params).then((data) => {
                    this.parterDetail = Object.assign({},data.resultObj);
                    this.provinceTemp = this.parterDetail.partener_area_code + "$" + this.parterDetail.partener_area;
                });
            },
            directBack (){
                let vm = this
                this.model.show = false
                setTimeout(()=>{vm.$router.push({path: '/site/v1'})},200)
            },
            // 监听路由id
            watchRouteIdHandler (id){
                this.model.show = !this.model.show;
                this.$refs.parterDetail.resetFields()
                if (id) {
                    this.siteId = id
                    this.model.title = '合作网点详情'
                    this.loadDetail()
                }else{
                    this.parterDetail = Object.assign({},EMPTY_SITE)
                    this.provinceTemp = ''
                    this.model.title = '邀请网点'
                    
                }
            },
            mapSwitch(){
                this.mapModal.show = true;
                this.addrMap = {};
                this.addrMap.lng = '';
                this.addrMap.lat = '';
                this.addrMap.area = this.parterDetail.partener_area;
                this.addrMap.areaCode = this.parterDetail.partener_area_code;
                this.addrMap.address = this.parterDetail.partener_addr;
                if (this.parterDetail.partener_lng && this.parterDetail.partener_lat) {
                    this.addrMap.lng = this.parterDetail.partener_lng;
                    this.addrMap.lat = this.parterDetail.partener_lat;
                }
            },
            procPixel: function (p){
                if(p) {
                    this.parterDetail.partener_lng  = p.lng.toString();
                    this.parterDetail.partener_lat  = p.lat.toString();
                    this.parterDetail.partener_area_code = p.areaCode;
                    this.parterDetail.partener_addr = p.addr;
                    this.provinceTemp = this.parterDetail.partener_area_code;
                    this.$nextTick(()=>{
                        this.parterDetail.partener_area = this.$refs.refProvince.$children[0].displayRender;
                        
                    })
                }
                this.mapModal.show = false;
            },
            submitPartnerDetail(){              //保存合作网点    
                this.$refs['parterDetail'].validate((valid) => {
                    if (valid) {
                        let params = Object.assign({},this.parterDetail)
                        if (this.parterDetail.partener_shipper_id) {
                            siteApi.siteEdit(params).then((data) => {
                                this.$Message.success("保存成功");
                                bus.$emit('site-list-reload')
                                this.directBack()
                            });
                        }else{
                            siteApi.siteInvite(params).then((data) => {
                                this.$Message.success("邀请成功");
                                bus.$emit('site-list-reload')
                                this.directBack()
                            });
                        }
                    }
               })
                
            },
        },
        mounted() {
            this.watchRouteIdHandler(this.$route.query.id)
        },
    }
</script>
<style scoped lang="scss">
    .amap-demo {
        height: 300px;
    }
</style>