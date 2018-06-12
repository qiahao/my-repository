<template>
    <div>
        <div class="contain-head">
            <div>
                <search-filter :list='conditionList' v-model="filterType"  @on-change="onSearch">
                </search-filter>
                <search-filter class="ml10" :list='conditionList2' v-model="filterType"  @on-change="onSearch">
                </search-filter>
                <Button-group>
                    <i-button type="primary" :disabled="buttonStatus.invite" @click="doInvite">邀请</i-button>
                    <i-button type="primary" :disabled="buttonStatus.cancel" @click="doCancel">取消合作</i-button>
                    <i-button type="primary" :disabled="buttonStatus.modify" @click="doModify">修改</i-button>
                    <i-button type="primary" :disabled="buttonStatus.agree"  @click="doAgree">同意</i-button>
                    <i-button type="primary" :disabled="buttonStatus.refuse" @click="doRefuse">拒绝</i-button>
                </Button-group>
            </div>
        </div>
        <div class="contain-main">
            <i-table ref="listTable" :data="tableParams.list" stripe :columns="columns"
                @on-selection-change="onSelectionChange" 
                >
            </i-table>
            <div class="page-wrapper">
                <Page :total="tableParams.total" show-sizer show-elevator
                    :current="currentPage" 
                    @on-change="onPageChange"
                    @on-page-size-change="onPageSizeChange">
                </Page>
            </div>
        </div>
       
        <!--确认是否取消合作关系-->
        <Modal  v-model="cancelModal.show" title="是否取消合作关系" @on-ok="confirmCancel">
            <div v-if="tableParams.selectList.length == 1">
                <p>名称：{{tableParams.selectList[0].company_name}}</p>
                <p>所在地：{{tableParams.selectList[0].area}}</p>
                <p>联系人：{{tableParams.selectList[0].link_man}}</p>
                <p>联系方式：{{tableParams.selectList[0].link_tel}}</p>
            </div>
            <div v-else="tableParams.selectList.length > 1">
                <p>确认解除{{tableParams.selectList.length}}个合作站点的合作关系？</p>
            </div>
        </Modal>
        <!--确认是否同意邀请-->
        <Modal  v-model="agreeModal.show" title="确认接受邀请？" @on-ok="confirmAgree">
            <div v-if="tableParams.selectList.length == 1">
                <p>名称：{{tableParams.selectList[0].company_name}}</p>
                <p>所在地：{{tableParams.selectList[0].area}}</p>
                <p>联系人：{{tableParams.selectList[0].link_man}}</p>
                <p>联系方式：{{tableParams.selectList[0].link_tel}}</p>
            </div>
            <div v-else="tableParams.selectList.length > 1">
                <p>确认接受{{tableParams.selectList.length}}个合作站点的邀请？</p>
            </div>
        </Modal>
        <!--确认是否拒绝邀请-->
        <Modal  v-model="refuseModal.show" title="确认拒绝邀请？" @on-ok="confirmRefuse">
            <div v-if="tableParams.selectList.length == 1">
                <p>名称：{{tableParams.selectList[0].company_name}}</p>
                <p>所在地：{{tableParams.selectList[0].area}}</p>
                <p>联系人：{{tableParams.selectList[0].link_man}}</p>
                <p>联系方式：{{tableParams.selectList[0].link_tel}}</p>
            </div>
            <div v-else="tableParams.selectList.length > 1">
                <p>确认拒绝{{tableParams.selectList.length}}个合作站点的邀请？</p>
            </div>
        </Modal>

        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>
<script>
    import tableMixin   from '@/mixins/tableMixin'
    import * as siteApi from '@/api/src/siteApi'

    export default {
        name: 'siteList',
        data (){
            return {
                conditionList:[
                    {
                        text:'全部',
                        key:''
                    },
                    {
                        text:'自有网点',
                        key:'0'
                    },
                    {
                        text:'合作网点',
                        key:'1'
                    },
                ],
                conditionList2:[
                    {
                        text:'发出邀请',
                        key:'3'
                    },
                    {
                        text:'收到邀请',
                        key:'4'
                    },
                    {
                        text:'已拒绝邀请',
                        key:'5'
                    },
                    {
                        text:'已取消合作',
                        key:'6'
                    },
                ],
                columns: [
                    {type: 'selection', width: 60, align: 'center'},
                    {title: '名称',key: 'company_name', width:289, render: (h,params)=>{
                        return (<span class="text-link" onClick={()=>{this.handler2Detail(params.row.id)}}>{params.row.company_name}</span>)
                    }}, 
                    {width: 160,title: '来源', key:'partener_type', render: (h,params)=>{
                        let siteType = ["自有网点","合作网点","合作公司"];
                        return (<span>{siteType[params.row.partener_type]}</span>)
                    }},
                    {title: '所在地', key: 'area'},
                    {width: 120,title: '联系人', key: 'link_man'},
                    {width: 150,title: '联系方式', key: 'link_tel'},
                    {width: 150,title: '承运次数', key: 'accept_count'},
                ],

                filterType:      '',
                search: {
                    company_name:   '',
                    partener_type:  '',
                    partener_status:'Y',
                    invite_type:    '',
                    area_code:      '',
                    area_addr:      '',
                    link_man:       '',
                    link_tel:       '',
                },

                cancelModal:{                //取消合作确认对话框
                    show: false,
                },
                agreeModal:{                //同意邀请确认对话框
                    show: false,
                },
                refuseModal:{               //拒绝邀请确认对话框
                    show: false,
                },
                buttonStatus:{              //按钮启用/禁用状态
                    invite: false,
                    cancel: true,
                    modify: true,
                    agree:  true,
                    refuse: true,
                },
            }
        },
        mixins: [tableMixin],
        watch: {
            //勾选或取消勾选合作网点
            'tableParams.selectList': function (n,o){
                if (this.tableSelectLength) {
                    let btnStu = {
                        modify : false,
                        cancel : false,
                        agree  : false,
                        refuse : false,
                    }
                    n.forEach((item)=>{
                        // 不是等待状态 和不是被邀请方 不做同意和拒绝操作
                        if (item.partener_status != 'D' || item.invite_type != '1') {
                            btnStu.agree = true
                            btnStu.refuse = true
                        }
                        if (item.partener_status != 'Y') {btnStu.cancel = true }
                    })
                    if(this.tableSelectLength > 1 || n[0].invite_type != '0') {btnStu.modify = true }
                    this.buttonStatus = {...btnStu}
                } else {
                    this.buttonStatus = {
                        modify : true,
                        cancel : true,
                        agree  : true,
                        refuse : true,
                    }
                }
            },
            filterType: function (n,o){
                if (n === '' || n === '0' || n === '1' || n === '2') {
                    this.search.partener_type = n
                    this.search.partener_status = 'Y'
                    this.search.invite_type = ''
                }else if (n === '3' || n === '4') {
                    this.search.partener_type = ''
                    this.search.partener_status = 'D'
                    this.search.invite_type = n === '3' ? '0' : '1'
                }else if (n === '5' || n === '6') {
                    this.search.partener_type = ''
                    this.search.invite_type = ''
                    this.search.partener_status = n === '5' ? 'N' : 'CN'
                }
                this.onSearch()
            }
        },
        methods: {
            //三级地址详情有变化时
            area_change(value){
                let areas = value.split("$")
                this.parterDetail.partener_area_code = areas[0];
                this.parterDetail.partener_area = areas[1]
            },

            //加载合作网点列表
            loadList (){
                let params = this.assignQuery(this.search);
                siteApi.siteList(params).then((data) => {
                    this.tableParams.total = data.resultObj.total;
                    this.tableParams.list = data.resultObj.list;
                    this.tableParams.selectList=[];

                });
            },
            handler2Detail (id){
                this.$router.push({
                    name: 'siteV1Detail', 
                    params: {id: id}
                })
            },

            doModify (){
                this.directDetail(this.tableParams.selectList[0].id)
            },

            //邀请合作网点
            doInvite(){
                this.$router.push({name: 'siteV1New'})
            },
            directDetail(){
                this.$router.push({name: 'siteV1Detail'})
            },

            //取消合作网点
            doCancel(){
                if (!this.tableSelectLength ) {
                    return this.$Message.error('请勾选合作网点');
                }
                this.cancelModal.show = true;
            },

            //确认取消合作网点
            confirmCancel() {
                let id_str = "";
                this.tableParams.selectList.forEach(function (v, k) {
                    id_str += v.id + ',';
                });
                let params = {partener_ids:id_str.replace(/^(.*?),$/g, "$1")};
                siteApi.siteCancel(params).then((data) => {
                    this.loadList();
                    this.$Message.success(data.resultInfo);
                });
            },

            //拒绝邀请
            doRefuse(){
                this.refuseModal.show = true;
            },
            //确认拒绝邀请
            confirmRefuse(){
                let id_str = "";
                this.tableParams.selectList.forEach(function (v, k) {
                    id_str += v.id + ',';
                });
                let params = {partener_ids:id_str.replace(/^(.*?),$/g, "$1")};
                siteApi.siteRefuse(params).then((data) => {
                    this.$Message.success(data.resultInfo);
                    this.loadList();
                    this.refuseModal.show = false;
                });
            },

            //同意邀请
            doAgree(){
                this.agreeModal.show = true;
            },
            //确认同意邀请
            confirmAgree(){
                let id_str = "";
                this.tableParams.selectList.forEach(function (v, k) {
                    id_str += v.id + ',';
                });
                let params = {partener_ids:id_str.replace(/^(.*?),$/g, "$1")};
                siteApi.siteAgree(params).then((data) => {
                    this.$Message.success(data.resultInfo);
                    this.loadList();
                    this.agreeModal.show = false;

                });
            },
        },


        created() {
            this.loadList();
        },
        mounted () {
            let vm = this
            bus.$on('site-list-reload', () => {
                vm.onSearch()
            })
        }
    }
</script>
<style scoped lang="scss">

</style>