<template lang="html">
    <div>
        <div class="">
            <Form  :label-width="85"  ref="buildData" :model="buildData" :rules="build_rule" >
                <!-- 运单信息 -->
                <div class="form-table cf-all">
                    <div class="form-item"> 
                        <Form-item label="托运单号：" >
                            <i-input  placeholder="请输入运单号" readonly  v-model="buildData.order_no"></i-input>
                        </Form-item>
                    </div>
                    <div class="form-item"> 
                        <Form-item label="委托单号：" >
                            <i-input  placeholder="请输入委托单号"  v-model="buildData.shipper_order_no"></i-input>
                        </Form-item>
                    </div>
                    <div class="form-item"> 
                        <Form-item label="运输方式：">
                            <Radio-group class="ml5"  v-model="buildData.bulk_type">
                                <Radio label="0" >
                                    <span>零担</span>
                                </Radio>
                                <Radio label="1">
                                    <span>整车</span>
                                </Radio>
                            </Radio-group>
                        </Form-item>
                    </div>
                    <div class="form-item"> 
                        <Form-item label="开单时间：" prop="order_create_time">
                            <Date-picker  :options='timeOption' type="datetime" v-model="buildData.order_create_time"  placeholder="选择日期和时间" style="width: 180px;display:inline-block"></Date-picker>
                        </Form-item>
                    </div>
                    
                    <div class="form-item"> 
                        <Form-item label="起始地：" prop="begin_ad">
                            <province-cascader   placeholder="请选择起始地" v-model="buildData.begin_ad"></province-cascader>
                        </Form-item>
                    </div>
                    <div class="form-item"> 
                        <Form-item label="目的地：" prop="end_ad">
                            <province-cascader   placeholder="请选择起始地" v-model="buildData.end_ad"></province-cascader>
                        </Form-item>
                    </div>
                    <div class="form-item"> 
                        <Form-item label="服务时效：">
                            <Select   style=""  v-model='buildData.expect_arrive_days'>
                                <Option value="1">1天</Option>
                                <Option value="2">2天</Option>
                                <Option value="3">3天</Option>
                                <Option value="4">4天</Option>
                                <Option value="5">5天</Option>
                                <Option value="6">6天</Option>
                                <Option value="7">7天</Option>
                                <Option value="8">8天</Option>
                                <Option value="9">9天</Option>
                            </Select>
                        </Form-item>
                    </div>
                    <div class="form-item"> 
                        <Form-item label="客户名称：" prop="send_company">
                            <editable-drop v-model.trim="buildData.send_company"  placeholder="请输入客户名称">
                                <editable-drop-option  @click.native="companyBlur(item)" v-for="(item,index) in filterCompanyList" :data="item" :value="item.cs_company" :key="item">{{item.cs_company}}</editable-drop-option>
                            </editable-drop>
                        </Form-item>
                    </div>
                </div>
                <!-- 收发货人信息 -->
                <div class="form-table cf-all">
                    <div class="form-table-row">
                        <div class="form-item"> 
                            <Form-item label="托运人："  prop="begin_link_man">
                                <editable-drop v-model="buildData.begin_link_man"  placeholder="请输入托运人">
                                    <editable-drop-option @click.native="sendManBlur(item)" v-for="item in sendList" :data="item" :value="item.link_name" :key="item">{{item.link_name}}</editable-drop-option>
                                </editable-drop>
                            </Form-item>
                        </div>
                        <div class="form-item"> 
                            <Form-item label="联系电话："  prop="begin_link_mobile">
                                <editable-drop v-model="buildData.begin_link_mobile"  placeholder="请输入联系电话">
                                    <editable-drop-option @click.native="sendPhoneBlur(item)" v-for="item in sendList" :data="item" :value="item.link_mobile" :key="item">{{item.link_mobile}}</editable-drop-option>
                                </editable-drop>
                            </Form-item>
                        </div>
                        <div class="form-item w500"> 
                            <Form-item label="详细地址："   prop="begin_address">
                                <address-location v-model="buildData.begin_address" :cityCode="buildData.begin_code" placeholder="请输入详细地址">    
                                </address-location>
                            </Form-item>
                        </div>
                        <div class="form-item w106">
                            <Checkbox class="checkbox"  v-model="is_pickup"  @on-change="pickup">提货</Checkbox>  
                        </div>
                    </div>
                    <div  class="form-table-row">
                        <div class="form-item"> 
                            <Form-item label="收货人："   prop="end_link_man">
                                <editable-drop v-model="buildData.end_link_man"  placeholder="请输入收货人">
                                    <editable-drop-option  @click.native="reciveManBlur(item)" v-for="item in reciveList" :data="item" :value="item.receipt_username" :key="item">{{item.receipt_username}}</editable-drop-option>
                                </editable-drop>
                            </Form-item>
                        </div>
                        <div class="form-item"> 
                            <Form-item label="联系电话："   prop="end_link_mobile">
                                <editable-drop v-model="buildData.end_link_mobile"  placeholder="请输入联系电话">
                                    <editable-drop-option  @click.native="recivePhoneBlur(item)" v-for="item in reciveList" :data="item" :value="item.receipt_mobile" :key="item">{{item.receipt_mobile}}</editable-drop-option>
                                </editable-drop>
                            </Form-item>
                        </div>
                        <div class="form-item w500" > 
                            <Form-item label="详细地址：" prop="end_address">
                                <address-location v-model="buildData.end_address" :cityCode="buildData.end_code" placeholder="请输入详细地址">    
                                </address-location>
                            </Form-item>
                        </div>
                        <div class="form-item w106">
                            <Checkbox  class="checkbox" v-model="is_delivery" @on-change="delivery">送货</Checkbox> 
                        </div>
                    </div>
                </div>
                <!-- 货物信息 -->
                <div class="form-table cf-all">
                    <div class="form-table-row cragos-list  cf-all text-center">
                        <Form-item  class="form-item" style='text-align:center' >
                            货物名称
                        </Form-item>
                        <Form-item  class="form-item"  style='text-align:center' >
                            包装
                        </Form-item>
                        <Form-item  class="form-item" style='text-align:center'  >
                            件数
                        </Form-item>
                        <Form-item  class="form-item" style='text-align:center' >
                            重量(吨)
                        </Form-item>
                        <Form-item  class="form-item" style='text-align:center' >
                            体积
                        </Form-item>
                        <Form-item  class="form-item" style='text-align:center' >
                            单价
                        </Form-item>
                    </div>
                    <div class="form-table-row cragos-list  cf-all text-center">
                        <Form-item  :label-width="0" class="form-item"   prop="cargo1.c_name">
                            <editable-drop v-model.trim="buildData.cargo1.c_name"  placeholder="品号/货物名称">
                                <editable-drop-option v-for="item in cargosSource0" :value="item.c_name" :key="item">{{item.c_name}}</editable-drop-option>
                            </editable-drop>
                        </Form-item>
                        <Form-item class="form-item"   prop="cargo1.c_pack"  :rules="buildData.cargo1.c_name!=''?[{required: true, message: '不能为空'}]:{}"> 
                            <editable-drop v-model="buildData.cargo1.c_pack"  placeholder="包装">
                                <editable-drop-option v-for="item in cargosPack" :value="item.dict_value" :key="item">{{item.dict_value}}</editable-drop-option>
                            </editable-drop>
                        </Form-item>
                        <Form-item class="form-item"   prop="cargo1.c_amount" :rules="buildData.cargo1.c_name!=''?[{required: true, message: '不能为空'},{ pattern:/^\d{1,4}$/, message: '件数须4位以内的正整数' }]:{}">
                            <i-input  placeholder="件数（必填）" v-model.trim='buildData.cargo1.c_amount'></i-input>
                        </Form-item>
                        <Form-item  class="form-item"  prop="cargo1.c_weight" :rules="buildData.cargo1.c_name!=''?[{required: true, message: '不能为空'},{ pattern:/^\d{1,2}(\.\d{1,3})?$/, message: '重量须小于100,小数不能超过3位' }]:{}"> 
                            <i-input  placeholder="重量（吨）" v-model='buildData.cargo1.c_weight'></i-input>
                        </Form-item>
                        <Form-item  class="form-item"  prop="cargo1.c_volume" :rules="buildData.cargo1.c_name!=''?[{required: true, message: '不能为空'},{ pattern:/^\d{1,3}(\.\d{1,2})?$/, message: '体积须小于1000,小数不能超过2位' }]:{}"> 
                            <i-input @on-blur="volumeCacl(1)"  placeholder="长*宽*高（m³）" v-model='buildData.cargo1.c_volume'></i-input>
                        </Form-item>
                        <div class="form-item"> 
                            <Form-item  prop="cargo1.c_price"  style="width:55px; display:inline-block"  :rules="buildData.cargo1.c_name!=''?[{required: true, message: '不能为空'},{ pattern:/^\d{1,4}(\.\d{1,2})?$/, message: '单价须小于10000,小数不能超过2位' }]:{}">
                                <i-input  placeholder="单价" v-model='buildData.cargo1.c_price'></i-input>
                            </Form-item>
                            <Select   style="width:70px"  v-model='buildData.cargo1.c_price_unit'>
                                <Option value="元/吨">元/吨</Option>
                                <Option value="元/件">元/件</Option>
                                <Option value="元/方">元/方</Option>
                            </Select>
                        </div>
                    </div>
                    <div class="form-table-row cragos-list  cf-all text-center">
                        
                        <Form-item  :label-width="0" class="form-item">
                            <editable-drop v-model.trim="buildData.cargo2.c_name"  placeholder="品号/货物名称">
                                <editable-drop-option v-for="item in cargosSource1" :value="item.c_name" :key="item">{{item.c_name}}</editable-drop-option>
                            </editable-drop>
                        </Form-item>
                        <Form-item class="form-item" prop="cargo2.c_pack"  :rules="buildData.cargo2.c_name!=''?[{required: true, message: '不能为空'}]:{}"> 
                            <editable-drop v-model="buildData.cargo2.c_pack"  placeholder="包装">
                                <editable-drop-option v-for="item in cargosPack" :value="item.dict_value" :key="item">{{item.dict_value}}</editable-drop-option>
                            </editable-drop>
                        </Form-item>
                        <Form-item class="form-item"   prop="cargo2.c_amount" :rules="buildData.cargo2.c_name!=''?[{required: true, message: '不能为空'},{ pattern:/^\d{1,4}$/, message: '件数须4位以内的正整数'}]:{}">
                            <i-input  placeholder="件数（必填）" v-model='buildData.cargo2.c_amount'></i-input>
                        </Form-item>
                        <Form-item  class="form-item"  prop="cargo2.c_weight" :rules="buildData.cargo2.c_name!=''?[{required: true, message: '不能为空'},{ pattern:/^\d{1,2}(\.\d{1,3})?$/, message: '重量须小于100,小数不能超过3位'}]:{}"> 
                            <i-input  placeholder="重量（吨）" v-model='buildData.cargo2.c_weight'></i-input>
                        </Form-item>
                        <Form-item  class="form-item"  prop="cargo2.c_volume" :rules="buildData.cargo2.c_name!=''?[{required: true, message: '不能为空'},{ pattern:/^\d{1,3}(\.\d{1,2})?$/, message: '体积须小于1000,小数不能超过2位' }]:{}"> 
                            <i-input @on-blur="volumeCacl(2)"  placeholder="长*宽*高（m³）" v-model='buildData.cargo2.c_volume'></i-input>
                        </Form-item>
                        <div class="form-item"> 
                            <Form-item  prop="cargo2.c_price"  style="width:55px; display:inline-block"  :rules="buildData.cargo2.c_name!=''?[{required: true, message: '不能为空'},{ pattern:/^\d{1,4}(\.\d{1,2})?$/, message: '单价须小于10000,小数不能超过2位' }]:{}">
                                <i-input  placeholder="单价" v-model='buildData.cargo2.c_price'></i-input>
                            </Form-item>
                            <Select   style="width:70px"  v-model='buildData.cargo2.c_price_unit'>
                                <Option value="元/吨">元/吨</Option>
                                <Option value="元/件">元/件</Option>
                                <Option value="元/方">元/方</Option>
                            </Select>
                        </div>
                    </div>
                    <div class="form-table-row cragos-list  cf-all text-center">
                        
                        <Form-item  :label-width="0" class="form-item"  prop="cargo3.c_name">
                            <editable-drop v-model.trim="buildData.cargo3.c_name"  placeholder="品号/货物名称">
                                <editable-drop-option v-for="item in cargosSource2" :value="item.c_name" :key="item">{{item.c_name}}</editable-drop-option>
                            </editable-drop>
                        </Form-item>
                        <Form-item class="form-item" prop="cargo3.c_pack"  :rules="buildData.cargo3.c_name!=''?[{required: true, message: '不能为空'}]:{}"> 
                            <editable-drop v-model="buildData.cargo3.c_pack"  placeholder="包装" >
                                <editable-drop-option v-for="item in cargosPack" :value="item.dict_value" :key="item">{{item.dict_value}}</editable-drop-option>
                            </editable-drop>
                        </Form-item>
                        <Form-item class="form-item"   prop="cargo3.c_amount" :rules="buildData.cargo3.c_name!=''?[{required: true, message: '不能为空'},{ pattern:/^\d{1,4}$/, message: '件数须4位以内的正整数' }]:{}">
                            <i-input  placeholder="件数（必填）" v-model='buildData.cargo3.c_amount'></i-input>
                        </Form-item>
                        <Form-item  class="form-item"  prop="cargo3.c_weight" :rules="buildData.cargo3.c_name!=''?[{required: true, message: '不能为空'},{ pattern:/^\d{1,2}(\.\d{1,3})?$/, message: '重量须小于100,小数不能超过3位' }]:{}"> 
                            <i-input  placeholder="重量（吨）" v-model='buildData.cargo3.c_weight'></i-input>
                        </Form-item>
                        <Form-item  class="form-item"  prop="cargo3.c_volume" :rules="buildData.cargo3.c_name!=''?[{required: true, message: '不能为空'},{ pattern:/^\d{1,3}(\.\d{1,2})?$/, message: '体积须小于1000,小数不能超过2位' }]:{}"> 
                            <i-input @on-blur="volumeCacl(3)"  placeholder="长*宽*高（m³）" v-model='buildData.cargo3.c_volume'></i-input>
                        </Form-item>
                        <div class="form-item"> 
                            <Form-item  prop="cargo3.c_price"  style="width:55px; display:inline-block"  :rules="buildData.cargo3.c_name!=''?[{required: true, message: '不能为空'},{ pattern:/^\d{1,4}(\.\d{1,2})?$/, message: '单价须小于10000,小数不能超过2位'}]:{}">
                                <i-input  placeholder="单价" v-model='buildData.cargo3.c_price'></i-input>
                            </Form-item>
                            <Select   style="width:70px"  v-model='buildData.cargo3.c_price_unit'>
                                <Option value="元/吨">元/吨</Option>
                                <Option value="元/件">元/件</Option>
                                <Option value="元/方">元/方</Option>
                            </Select>
                        </div>
                    </div>
                    <!--
                    <div class="form-table-row  cf-all">
                        <div class="form-item ml5" style="width:100%"> 
                            <Form-item label="货物补充说明" >
                                <i-input  placeholder="" v-model="buildData.cargos_remark" ></i-input>
                            </Form-item>
                        </div>                     
                    </div> 
                    --> 
                </div>                
                <!-- 费用信息 -->
                <div class="form-table cf-all">
                    <div class="form-item  ">
                        <Form-item label="运费：" prop="fee_transport" :rules="build_rule.fee_detail.fees">
                            <i-input  placeholder="请输入运费"  v-model="buildData.fee_transport"></i-input>
                        </Form-item>
                    </div> 
                    <div class="form-item "  v-show="fee_show_control.fee_th">
                        <Form-item label="提货费"  prop="fee_detail.fee_th"  :rules="build_rule.fee_detail.fees">
                            <i-input v-model="buildData.fee_detail.fee_th"  placeholder="请输入提货费"></i-input>
                        </Form-item>
                    </div> 
                    <div class="form-item "  v-show="fee_show_control.fee_sh">
                        <Form-item label="送货费"  prop="fee_detail.fee_s"  :rules="build_rule.fee_detail.fees">
                            <i-input v-model="buildData.fee_detail.fee_sh"  placeholder="请输入送货费"></i-input>
                        </Form-item>
                    </div> 
                    <div class="form-item  ">
                        <Form-item label="其它费"  prop="fee_detail.fee_qt"  :rules="build_rule.fee_detail.fees">
                            <i-input v-model="buildData.fee_detail.fee_qt"  placeholder="请输入其它费"></i-input>
                        </Form-item>
                    </div>
                    <div class="form-item  "  v-show="fee_show_control.fee_smjz">
                        <Form-item label="声明价值"  prop="fee_detail.fee_smjz">
                            <i-input v-model="buildData.fee_detail.fee_smjz"  placeholder="请输入声明价值" icon="close-circled" @on-click="removeFee('fee_smjz')"></i-input>
                        </Form-item>
                    </div>
                    <div class="form-item  "  v-show="fee_show_control.fee_bj">
                        <Form-item label="保价费"  prop="fee_detail.fee_bj">
                            <i-input v-model="buildData.fee_detail.fee_bj"  placeholder="请输入保价费" icon="close-circled" @on-click="removeFee('fee_bj')"></i-input>
                        </Form-item>
                    </div> 
                    <div class="form-item  " v-show="fee_show_control.fee_bx">
                        <Form-item label="保险费"  prop="fee_detail.fee_bx">
                            <i-input v-model="buildData.fee_detail.fee_bx"  placeholder="请输入保险费" icon="close-circled" @on-click="removeFee('fee_bx')"></i-input>
                        </Form-item>
                    </div>
                    <div class="form-item  " v-show="fee_show_control.fee_zx">
                        <Form-item label="装卸费"  prop="fee_detail.fee_zx">
                            <i-input v-model="buildData.fee_detail.fee_zx"  placeholder="请输入装卸费" icon="close-circled" @on-click="removeFee('fee_zx')"></i-input>
                        </Form-item>
                    </div>
                    <div class="form-item  " v-show="fee_show_control.fee_sl">
                        <Form-item label="上楼费"  prop="fee_detail.fee_sl">
                            <i-input v-model="buildData.fee_detail.fee_sl"  placeholder="请输入上楼费" icon="close-circled" @on-click="removeFee('fee_sl')"></i-input>
                        </Form-item>
                    </div>
                    <div class="form-item  " v-show="fee_show_control.fee_bz">
                        <Form-item label="包装费"  prop="fee_detail.fee_bz">
                            <i-input v-model="buildData.fee_detail.fee_bz"  placeholder="请输入包装费" icon="close-circled" @on-click="removeFee('fee_bz')"></i-input>
                        </Form-item>
                    </div>
                    <div class="form-item  " v-show="fee_show_control.fee_az">
                        <Form-item label="安装费"  prop="fee_detail.fee_az">
                            <i-input v-model="buildData.fee_detail.fee_az"  placeholder="请输入安装费" icon="close-circled" @on-click="removeFee('fee_az')"></i-input>
                        </Form-item>
                    </div>
                    <div class="form-item  " v-show="fee_show_control.fee_bg">
                        <Form-item label="保管费"  prop="fee_detail.fee_bg">
                            <i-input v-model="buildData.fee_detail.fee_bg"  placeholder="请输入保管费" icon="close-circled" @on-click="removeFee('fee_bg')"></i-input>
                        </Form-item>
                    </div>
                    <div class="form-item  " v-show="fee_show_control.fee_jc">
                        <Form-item label="进仓费"  prop="fee_detail.fee_jc">
                            <i-input v-model="buildData.fee_detail.fee_jc"  placeholder="请输入进仓费" icon="close-circled" @on-click="removeFee('fee_jc')"></i-input>
                        </Form-item>
                    </div> 
                    <div class="form-item  " v-show="fee_show_control.fee_dshk">
                        <Form-item label="代收货款"  prop="fee_detail.fee_dshk">
                            <i-input v-model="buildData.fee_detail.fee_dshk"  placeholder="请输入代收货款" icon="close-circled" @on-click="removeFee('fee_dshk')"></i-input>
                        </Form-item>
                    </div> 
                    <div class="form-item  " v-show="fee_show_control.fee_dssx">
                        <Form-item label="代收手续费"  prop="fee_detail.fee_dssx">
                            <i-input v-model="buildData.fee_detail.fee_dssx"  placeholder="请输入代收手续费"  icon="close-circled" @on-click="removeFee('fee_dssx')"></i-input>
                        </Form-item>
                    </div> 
                    
                    <div class="form-item   fee-more-selector-text">
                        <Select @on-change="setMorefee" v-model="fee_show_value"  placement='top'>
                            <Option value="0">更多费用</Option>
                            <Option value="fee_th">提货费</Option>
                            <Option value="fee_sh">送货费</Option>
                            <Option value="fee_smjz">声明价值</Option>
                            <Option value="fee_bj">保价</Option>
                            <Option value="fee_bx">保险费</Option>
                            <Option value="fee_zx">装卸费</Option>
                            <Option value="fee_sl">上楼费</Option>
                            <Option value="fee_bz">包装费</Option>
                            <Option value="fee_az">安装费</Option>
                            <Option value="fee_bg">保管费</Option>
                            <Option value="fee_jc">进仓费</Option>
                            <Option value="fee_dshk">代收货款</Option>
                            <Option value="fee_dssx">代收手续费</Option>
                        </Select>
                    </div>                 
                </div> 
                <!-- 付款方式 -->
                <div class="form-table cf-all">
                    <div class="form-item  ">
                        <Form-item label="合计费用：">
                            <i-input  placeholder="请输入提货费"  v-model="buildData.pay_total" readonly  :value="payTotal"></i-input>
                        </Form-item>
                    </div> 
                    <div class="form-item  ">
                        <Form-item label="付款方式：">
                            <Select  v-model="buildData.pay_type" placement='top'>
                                <Option value="pay_xfu">现付</Option>
                                <Option value="pay_df">到付</Option>
                                <Option value="pay_yj">月结</Option>
                                <Option value="pay_hdf">回单付</Option>
                                <Option value="pay_hkk">货款扣</Option>
                                <Option value="pay_dbf">多笔付</Option>
                            </Select>
                        </Form-item>
                    </div>
                    <div class="form-item " v-show="buildData.pay_type=='pay_dbf'">
                        <Form-item label="现付"  prop="pay_detail">
                            <i-input v-model="buildData.pay_detail.pay_xfu"  placeholder="请输入现付"></i-input>
                        </Form-item>
                    </div> 
                    <div class="form-item " v-show="buildData.pay_type=='pay_dbf'">
                        <Form-item label="月结"  prop="pay_detail">
                            <i-input v-model="buildData.pay_detail.pay_yj"  placeholder="请输入月结"></i-input>
                        </Form-item>
                    </div>
                    <div class="form-item " v-show="buildData.pay_type=='pay_dbf'">
                        <Form-item label="到付"  prop="pay_detail">
                            <i-input v-model="buildData.pay_detail.pay_df"  placeholder="请输入到付"></i-input>
                        </Form-item>
                    </div> 
                    <div class="form-item " v-show="buildData.pay_type=='pay_dbf'">
                        <Form-item label="回单付"  prop="pay_detail">
                            <i-input v-model="buildData.pay_detail.pay_hdf"  placeholder="请输入回单付"></i-input>
                        </Form-item>
                    </div> 
                    
                    <div class="form-item " v-show="buildData.pay_type=='pay_dbf'">
                        <Form-item label="货款扣"  prop="pay_detail">
                            <i-input v-model="buildData.pay_detail.pay_hkk"  placeholder="请输入货款扣"></i-input>
                        </Form-item>
                    </div>
                    <div class="form-item " v-show="buildData.pay_type=='pay_dbf'">
                        <Form-item label="货到打款"  prop="pay_detail">
                            <i-input v-model="buildData.pay_detail.pay_hdfk"  placeholder="请输入货到打款"></i-input>
                        </Form-item>
                    </div>
                    <div class="form-item " v-show="buildData.pay_type=='pay_dbf'">
                        <Form-item label="现返"  prop="pay_detail">
                            <i-input v-model="buildData.pay_detail.pay_xfan"  placeholder="请输入现返"></i-input>
                        </Form-item>
                    </div>
                    <div class="form-item " v-show="buildData.pay_type=='pay_dbf'">
                        <Form-item label="欠返"  prop="pay_detail">
                            <i-input v-model="buildData.pay_detail.pay_qfan"  placeholder="请输入欠返"></i-input>
                        </Form-item>
                    </div>
                    <div class="form-item " v-show="buildData.pay_type=='pay_dbf'">
                        <Form-item label="欠付"  prop="pay_detail">
                            <i-input v-model="buildData.pay_detail.pay_qfu"  placeholder="请输入欠付"></i-input>
                        </Form-item>
                    </div>  
                </div>
                <!-- 回执信息 -->
                <div class="form-table cf-all">
                    <div class="form-table-row">
                        <div class="form-item clearfix" style="width:100%">
                            <Form-item label="回单：" class="fl">
                                <Radio-group  v-model="buildData.back_type">
                                    <Radio label="no">
                                        <span>无</span>
                                    </Radio>
                                    <Radio label="0">
                                        <span>回执</span>
                                    </Radio>
                                    <Radio label="1">
                                        <span>原单</span>
                                    </Radio>
                                    <Radio label="2">
                                      
                                        <span>收条</span>
                                    </Radio>
                                    <Radio label="3">
                                      
                                        <span>电子回单</span>
                                    </Radio>
                                    <Radio label="4">
                                        <span>其他</span>
                                    </Radio>
                                </Radio-group>
                            </Form-item>
                            <div class="fl back-type-qt">
                                <Form-item   prop="back_type_other" v-show="buildData.back_type=='4'" :rules="buildData.back_type=='4'?[{required: true, message: '不能为空', trigger: 'blur'}]:{}">
                                    <i-input  placeholder="请输入其他" v-model="buildData.back_type_other" style="width:100px; text-align:center；border-bottom:1px solid #ccc"></i-input>
                                </Form-item>
                            </div>
                            <Form-item label="共"  class="fl" prop="back_nums"  :rules="buildData.back_type!='no'?[{required: true, message: '不能为空', trigger: 'blur'},{ pattern:/^[1-9]{1}$/,  message: '请输1~9之间的整数', trigger: 'blur' }]:{}">
                                <i-input  placeholder="" v-model="buildData.back_nums" style="width:40px; text-align:center"></i-input>份
                            </Form-item>
                        </div> 
                    </div>
                    <div class="form-table-row ">
                        <div class='form-item w900'>
                            <Form-item label="备注：">
                                <i-input  placeholder="" v-model="buildData.shipper_remark"></i-input>
                            </Form-item>
                        </div> 
                        <div class='form-item'>
                            <Form-item label="制单员：">
                                <span>{{user.user_name}}</span>
                            </Form-item>
                        </div> 
                    </div>
                    
                </div>   
            </form>
            
        </div>
    </div>
</template>

<script>   
    import {queryCustoms,getCargosList,getLinklist,getrecivelist,orderDetail} from '@/api/src/buildApi'
	import { orderDetailModify } from '@/api/src/waybillApi'
	
    import * as getDict from '@/api/src/dictApi'
	import { utilCookie,getCurDate,getDateFormat} from '@/utils/util'
	import { mapState } from 'vuex'
    import rule from '@/utils/validate-rule'
    let vm={obj:{}};
    //订单列表个格设置
    export default{
        props: {
            order_id: '',
            detailData:'',
            lsearch:{
                type: Function,
		        default: null
            }
        },
        data:function(){
             return {
                timeOption: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                lazyload:false,
                user:'',//用户缓存
                is_pickup: false,
                is_delivery: false,
                build_rule: {
                    begin_ad: [
                        { required: true, message: '这是必填项', trigger: 'change' }
                    ],
                    end_ad: [
                        { required: true, message: '这是必填项', trigger: 'change' }
                    ],
                    send_company: [
                        { required: true, message: '这是必填项', trigger: 'change' }
                    ],
                    begin_link_man: [
                        { required: true, message: '这是必填项', trigger: 'blur' }
                    ],
                    end_link_man: [
                        { required: true, message: '这是必填项', trigger: 'blur' }
                    ],
                    begin_link_mobile: [
                        rule.required({ message: '联系人电话不能为空'}),
                        { validator: rule.phone, message: '请输入正确的手机号', trigger: 'blur' } 
                    ],
                    end_link_mobile: [
                        rule.required({ message: '联系人电话不能为空'}),
                        { validator: rule.phone, message: '请输入正确的手机号', trigger: 'blur' } 
                    ],

                    begin_address: [
                        { required: true, message: '这是必填项', trigger: 'blur' }
                    ],
                    end_address: [
                        { required: true, message: '这是必填项', trigger: 'blur' }
                    ],      
                    shipper_order_no:[
                        rule.max({ max: 20 , message: '长度不能超过50字符'})
                    ],
                    fee_detail:{
                        fees: { validator: rule.pointLimit,  trigger: 'change' },
                    },
                    pay_detail:{
                        type: "object",
                        fields: {
                            pay_xfu: { validator: rule.pointLimit,  trigger: 'blur' },
                            pay_df: { validator: rule.pointLimit,  trigger: 'blur' },
                            pay_qfu: { validator: rule.pointLimit,  trigger: 'blur' },
                            pay_yj: { validator: rule.pointLimit,  trigger: 'blur' },
                            pay_hdf: { validator: rule.pointLimit,  trigger: 'blur' },
                            pay_hkk: { validator: rule.pointLimit,  trigger: 'blur' },
                            pay_xfan: { validator: rule.pointLimit,  trigger: 'blur' },
                            pay_qfan: { validator: rule.pointLimit,  trigger: 'blur' },
                            pay_hdfk: { validator: rule.pointLimit,  trigger: 'blur' },
                        }
                    },
                    order_create_time: [
                        { required: true, message: '这是必填项'},
                        { validator: rule.curDateLimit, },
                    ],
                    fee_transport:[
                        { required: true, message: '这是必填项'},
                        { validator: rule.pointLimit },
                    ],
                },
                buildData:{
                    shipper_order_no:'',
                    shipper_remark: '',
                    create_user_id:'',
                    bulk_type: 0,
                    is_kzj: 'Y',
                    is_pickup: false,
                    is_delivery: false,
                    order_volumes: '',
                    order_weights: '',
                    cargos:[],
                    cargo: [

                    ],
                    cargo1: {
                        c_name:"",
                        c_pack:"",
                        c_amount:"",
                        c_weight: "",
                        c_volume: "",
                        c_price: "",
                        c_price_unit: "元/吨",
                    },
                    cargo2:{
                        c_name:"",
                        c_pack:"",
                        c_amount:"",
                        c_weight: "",
                        c_volume: "",
                        c_price: "",
                        c_price_unit: "元/吨",
                    },
                    cargo3:{
                        c_name:"",
                        c_pack:"",
                        c_amount:"",
                        c_weight: "",
                        c_volume: "",
                        c_price: "",
                        c_price_unit: "元/吨",
                    },
                    cargos_remark: '',
                    send_company: '',
                    begin_ad:'',
                    begin_code: '',
                    begin_area: '',
                    begin_address: '',
                    begin_link_man: '',
                    begin_link_mobile: '',
                    begin_lng: 0,
                    begin_lat: 0,
                    receive_company: '',
                    end_ad:'',
                    end_code: '',
                    end_area:'',
                    end_address: '',
                    end_link_man: '',
                    end_link_mobile: '',
                    end_lng: 0,
                    end_lat: 0,
                    fee_transport: '',
                    fee_details:{},
                    fee_detail: {
                        fee_smjz:"",
                        fee_zx:"",
                        fee_az:"",
                        fee_dshk:"",
                        fee_th:"",
                        fee_bj:"",
                        fee_sl:"",
                        fee_bg:"",
                        fee_dssx:"",
                        fee_sh:"",
                        fee_bx:"",
                        fee_bz:"",
                        fee_jc:"",
                        fee_qt:""
                    },
                    pay_total: '',
                    pay_type: 'pay_xfu',
                    pay_details:{},
                    pay_detail: {
                        pay_xfu:"",
                        pay_df:"",
                        pay_qfu:"",
                        pay_yj:"",
                        pay_hdf:"",
                        pay_hkk:"",
                        pay_xfan:"",
                        pay_qfan:"",
                        pay_hdfk:"",
                    },
                    back_type: 'no',
                    back_nums: '',
                    order_create_time:'',
                    expect_arrive_days:'',
                    back_type_other:''
                },
                //货物列表
                cargosList:[],
                cargos:[],
                //更多费用设置
                fee_show_control:{
                    fee_th:"",
                    fee_sh:"",
                    fee_smjz:"",
                    fee_zx:"",
                    fee_az:"",
                    fee_dshk:"",
                    fee_th:"",
                    fee_bj:"",
                    fee_sl:"",
                    fee_bg:"",
                    fee_dssx:"",
                    fee_sh:"",
                    fee_bx:"",
                    fee_bz:"",
                    fee_jc:"",
                }, 
                fee_show_value:'0',
                //客户列表
                companyList:[],
                //发货人列表
                sendList:[],
                //收货人列表
                reciveList:[],
                cargosSource:[],
                cargosPack:[],                
            }
        },
        created () {
            this.user = this.userInfo
            this.search()
            this.getCargosDict()
            this.getCargosPack()
            this.buildData.cargo[0]=this.buildData.cargo1;
            this.buildData.cargo[1]=this.buildData.cargo2;
            this.buildData.cargo[2]=this.buildData.cargo3;
            
        },
        mounted (){
            let _vm=this

            setTimeout(function(){
                _vm.lazyload = true
            },1000)
            
            
        },
        methods :{
            //获取客户信息
            search () {
                let _vm = this;
                queryCustoms({keyword:_vm.buildData.send_company}).then(json=>{
                    if(json.result==1){
                        _vm.companyList = json.resultObj;
                        _vm.buildData.begin_area="";
                        _vm.buildData.begin_area="";
                    }else{
                        //_vm.$Message.error(json.resultInfo)
                    }
                });
            },
            pickup (e){
                let _vm = this;
                if(e){
                    _vm.fee_show_control.fee_th=1;
                }
            },
            delivery (e){
                let _vm = this;
                if(e){
                    _vm.fee_show_control.fee_sh=1;
                }
            },
            //日期修改
            dateChange (e){	
                let _vm = this;
                _vm.buildData.order_create_time = e;
			      },
            //选择更多费用
            setMorefee (e){
                let _vm = this;
                if(e){
                    _vm.fee_show_control[e]=true;
                }
                setTimeout(()=>{_vm.fee_show_value = "0"},100)
                
            },
            //获取货列表
            getCargosDict (){
                let _vm = this;
                getCargosList({page:1,page_size:999}).then(json=>{
                    if(json.result==1){
                        _vm.cargosSource = json.resultObj;
                    }else{
                        //_vm.$Message.error(json.resultInfo)
                    }
                })
            },
            //获取包装列表
            getCargosPack (){
                let _vm = this;
                getDict.dictCargoPackApi().then(json=>{
                    if(json.result==1){
                        _vm.cargosPack = json.resultObj;
                    }else{
                        //_vm.$Message.error(json.resultInfo)
                    }
                })
            },
            //自动填充发货人信息
            autoSendInfo(e){
                let _vm = this;
                e = e || {};
                _vm.buildData.begin_link_man = e.link_name;
                _vm.buildData.begin_link_mobile = e.link_mobile;
                _vm.buildData.begin_address = e.link_address;
                _vm.buildData.begin_ad = e.link_area_code+"$"+e.link_area;
                _vm.buildData.begin_code = "";
            },
            //自动填充收货人信息
            autoReciveInfo(e){
                let _vm = this;
                e = e || {};
                _vm.buildData.end_link_man = e.receipt_username;
                _vm.buildData.end_link_mobile = e.receipt_mobile;
                _vm.buildData.end_address = e.receipt_address;
                _vm.buildData.end_ad = e.receipt_area_code+"$"+e.receipt_area;
                _vm.buildData.end_code = "";
            },
            //发货人列表
            loadSendlist(e){
                let _vm = this;
                getLinklist({cs_id:e}).then(json=>{
                    if(json.result==1){
                         _vm.autoSendInfo(json.resultObj[0])
                        _vm.sendList = json.resultObj;
                    }else{
                        //_vm.$Message.error(json.resultInfo)
                    }
                })
            },
            //收货人列表
            loadRecivelist(e){
                let _vm = this;
                getrecivelist({cs_id:e}).then(json=>{
                    if(json.result==1){
                        _vm.reciveList = json.resultObj;
                        _vm.autoReciveInfo(json.resultObj[0])
                    }else{
                        //_vm.$Message.error(json.resultInfo)
                    }
                })
            },
            //改客户
            companyBlur(e){
                if(e==null){return}
                let _vm = this
                setTimeout(function(){
                    if(e && e.cs_company==_vm.buildData.send_company){
                        _vm.loadSendlist(e.cs_id);
                        _vm.loadRecivelist(e.cs_id)
                    }
                    else{
                        for(let i=0;i<_vm.companyList.length;i++){
                            if(_vm.companyList[i].cs_company==_vm.buildData.send_company){
                                _vm.loadSendlist(_vm.companyList[i].cs_id);
                                _vm.loadRecivelist(_vm.companyList[i].cs_id)
                                break; 
                            }
                        }
                    }
                },500)
            },
            //改托运人
            sendManBlur(e){
                if(e==null){return}
                let _vm = this
                setTimeout(function(){
                    if(e){
                        _vm.autoSendInfo(e)
                    }
                    else{
                        for(let i=0;i<_vm.sendList.length;i++){
                            if(_vm.sendList[i].link_name==_vm.buildData.link_name){
                                _vm.autoSendInfo(_vm.sendList[i])
                                break; 
                            }
                        }
                    }
                },500)
            },
            //改托运人电话
            sendPhoneBlur(e){
                if(e==null){return}
                let _vm = this
                setTimeout(function(){
                    if(e){
                        _vm.autoSendInfo(e)
                    }
                    else{
                        for(let i=0;i<_vm.sendList.length;i++){
                            if(_vm.sendList[i].link_name==_vm.buildData.link_name){
                                _vm.autoSendInfo(_vm.sendList[i])
                                break; 
                            }
                        }
                    }
                },500)
            },
            //改收货人
            reciveManBlur(e){
                if(e==null){return}
                let _vm = this
                setTimeout(function(){
                    if(e){
                        _vm.autoReciveInfo(e)
                    }
                    else{
                        for(let i=0;i<_vm.reciveList.length;i++){
                            if(_vm.reciveList[i].receipt_username==_vm.buildData.end_link_man){
                                _vm.autoReciveInfo(_vm.reciveList[i])
                                break; 
                            }
                        }
                    }
                },500)
            },
            //改收货人电话
            recivePhoneBlur(e){
                if(e==null){return}
                let _vm = this
                setTimeout(function(){
                    if(e){
                        _vm.autoReciveInfo(e)
                    }
                    else{
                        for(let i=0;i<_vm.reciveList.length;i++){
                            if(_vm.reciveList[i].receipt_username==_vm.buildData.end_link_man){
                                _vm.autoReciveInfo(_vm.reciveList[i])
                                break; 
                            }
                        }
                    }
                },500)
            },
            //创建开单
            buildOrer (name){
                let _vm = this;
                if(_vm.cargos.length==0){
                    return _vm.$Message.error("您未填写货物信息")
                }
                _vm.$refs[name].validate((valid) => {
                    if (valid) {
                        let submitObj = Object.assign({},this.buildData)
                        let beginAddr = submitObj.begin_address.split("$")
                        let endAddr = submitObj.end_address.split("$")
						submitObj.end_address = endAddr[0]
                        submitObj.end_lng = endAddr[1]
                        submitObj.end_lat = endAddr[2]
                        submitObj.begin_address = beginAddr[0]
                        submitObj.begin_lng = beginAddr[1]
                        submitObj.begin_lat = beginAddr[2]
                        submitObj.create_user_id = _vm.user.user_id;
                        submitObj.cargos = JSON.stringify(_vm.cargos);
                        submitObj.order_volumes=parseInt(submitObj.order_volumes*100)/100
                        submitObj.order_weights=parseInt(submitObj.order_weights*1000)/1000

                        submitObj.fee_details = JSON.stringify(submitObj.fee_detail);
                        submitObj.is_pickup=_vm.is_pickup?"Y":"N";
                        submitObj.is_delivery=_vm.is_delivery?"Y":"N";
                        if(submitObj.pay_type=="多笔付" || submitObj.pay_type=="pay_dbf"){
                            submitObj.pay_details=JSON.stringify(submitObj.pay_detail);                   
                        }
                        else{
                            _vm.pay_detail={};
                            submitObj.pay_details='{"'+submitObj.pay_type+'":"' + submitObj.pay_total + '"}';
                            //JSON.stringify({submitObj.pay_type:})
                        }
                        if((submitObj.pay_type=="多笔付"||submitObj.pay_type=="pay_dbf") && getPaydetailTotal(submitObj.pay_detail)!=submitObj.pay_total){
                            _vm.$Message.error("多笔付总额不正确")
                            return false;
                        }

                        if(submitObj.pay_type=="pay_hkk"){
                            if(!submitObj.fee_detail.fee_dshk){
                                _vm.$Message.error("您选择了贷款扣，代收货款不能小于合计费用！");
                                return false;
                            }
                            var payhdf=isNaN(parseFloat(submitObj.fee_detail.fee_dshk))?0:submitObj.fee_detail.fee_dshk;
                            if(parseFloat(submitObj.pay_total)>payhdf){
                                _vm.$Message.error("您选择了贷款扣，代收货款不能小于合计费用！")
                                return false;
                            }
                        }
                        submitObj.cargo=null
                        submitObj.pay_detail=null
                        submitObj.cargo1=null
                        submitObj.cargo2=null
                        submitObj.cargo3=null
                        if(typeof submitObj.order_create_time=="object"){
                            submitObj.order_create_time=getDateFormat(submitObj.order_create_time)
                        }   
                        orderDetailModify(submitObj).then(json=>{
                            if(json.result==1){
                                this.$Message.success("修改成功")
                                this.lsearch();
                            }else{
                                _vm.$Message.error(json.resultInfo)
                            }
                        })
                    }
                })
            },
            volumeCacl (e) {
                let cargo_vol = (this.buildData['cargo'+e].c_volume+"").split("*");
                if(cargo_vol.length==3){
                    this.buildData['cargo'+e].c_volume=Math.round(cargo_vol[0] * cargo_vol[1] * cargo_vol[2]*100)/100+'';
                                
                }
            },
            removeFee(e){
                let _vm=this;
                _vm.fee_show_control[e]=''
                _vm.buildData.fee_detail[e]=''
            }
        },
        computed :{
            payTotal (){
                var fee=parseFloat(this.buildData.fee_transport);
                fee=isNaN(fee)?0:fee;
                for(name in this.buildData.fee_detail){
                    if(this.buildData.fee_detail[name] && name!="fee_smjz" && name!="fee_dshk" && name!="fee_transport"){
                        fee+=parseFloat(this.buildData.fee_detail[name]);
                    }
                }
                fee=Math.round(fee * 100) / 100;
                this.buildData.pay_total=fee
                return fee;
            },
            filterCompanyList (){
                let key = this.buildData.send_company;
                let List = this.companyList||[];
                if (key.length == 0) {
                    return []
                }
                return List.filter(function(item) {
                    var str = "";
                    str += item.cs_company ? item.cs_company : "";
                    str += item.receipt_username ? item.receipt_username : "";
                    str += item.company_keyword ? item.company_keyword : "";
                    return str.toLowerCase().indexOf(key.toLowerCase()) != -1
                });
            },
            cargosSource0 (){
                let key=this.buildData.cargo1.c_name;
                let array=this.cargosSource.slice()||[];
                if(key.length>0){
                    return array.filter(function(item) {
                        return item.c_name.toLowerCase().indexOf(key.toLowerCase()) != -1
                });
                }

            },
            cargosSource1 (){
                let key=this.buildData.cargo2.c_name;
                let array=this.cargosSource.slice()||[];
                if(key.length>0){
                    return array.filter(function(item) {
                        return item.c_name.toLowerCase().indexOf(key.toLowerCase()) != -1
                });
                }

            },
            cargosSource2 (){
                let key=this.buildData.cargo3.c_name;
                let array=this.cargosSource.slice()||[];
                if(key.length>0){
                    return array.filter(function(item) {
                        return item.c_name.toLowerCase().indexOf(key.toLowerCase()) != -1
                });
                }
            },
            ...mapState(['userInfo']),
            
        },
        watch:{
            "buildData.cargo1": {
                
                handler: function(curVal,oldVal){
                    let array = [];
                    this.buildData.cargo.forEach(item=>{
                        if(item.c_name){
                            array.push(item)
                        }
                    })
                    this.cargos=array;
                    this.buildData.fee_transport=getPayment(array);
                    let obj=getWeightVolumes(array);
                    this.buildData.order_volumes=obj.volumes;
                    this.buildData.order_weights=obj.weights;
    　　　　　　　},
                deep:true
            },
            "buildData.cargo2": {
                handler: function(curVal,oldVal){
                    let array = [];
                    this.buildData.cargo.forEach(item=>{
                        if(item.c_name){
                            array.push(item)
                        }
                    })
                    this.cargos=array;
                    this.buildData.fee_transport=getPayment(array);
                    let obj=getWeightVolumes(array);
                    this.buildData.order_volumes=obj.volumes;
                    this.buildData.order_weights=obj.weights;
    　　　　　　　},
                deep:true
            },
            "buildData.cargo3": {
                handler: function(curVal,oldVal){
                    let array = [];
                    this.buildData.cargo.forEach(item=>{
                        if(item.c_name){
                            array.push(item)
                        }
                    })
                    this.cargos=array;
                    this.buildData.fee_transport=getPayment(array);
                    let obj=getWeightVolumes(array);
                    this.buildData.order_volumes=obj.volumes;
                    this.buildData.order_weights=obj.weights;
    　　　　　　　},
                deep:true
            },
            'buildData.begin_ad': {
                handler: function(curVal,oldVal){
                    let bgAddr = this.buildData.begin_ad.split("$");
                    this.buildData.begin_code = bgAddr[0];
                    this.buildData.begin_area = bgAddr[1];
    　　　　　　　},
                deep:true
            },
            'buildData.end_ad': {
                handler: function(curVal,oldVal){
                    let endAddr = this.buildData.end_ad.split("$");
                    this.buildData.end_code = endAddr[0];
                    this.buildData.end_area = endAddr[1];
    　　　　　　　},
                deep:true
            },
            detailData:{
                handler: function(curVal,oldVal){
                    this.$refs.buildData.resetFields();
                    let array=JSON.parse(curVal.cargos); 
                    var data=this.buildData;
                    var cargoobj={
                        c_name:"",
                        c_pack:"",
                        c_amount:"",
                        c_weight: "",
                        c_volume: "",
                        c_price: "",
                        c_price_unit: "元/吨",
                    }
                    var payObj={
                        pay_xfu:"",
                        pay_df:"",
                        pay_qfu:"",
                        pay_yj:"",
                        pay_hdf:"",
                        pay_hkk:"",
                        pay_xfan:"",
                        pay_qfan:"",
                        pay_hdfk:"",
                    };
                    data.cargo1=array[0]?array[0]:Object.assign({}, cargoobj)
                    data.cargo2=array[1]?array[1]:Object.assign({}, cargoobj)
                    data.cargo3=array[2]?array[2]:Object.assign({}, cargoobj)
                    data.cargo=[data.cargo1,data.cargo2,data.cargo3]
                    data.fee_detail=JSON.parse(curVal.fee_details); 
                    for(let x in data.fee_detail){
                       if(data.fee_detail[x]){
						   this.fee_show_control[x]=true;
                       }
					   else{
						   this.fee_show_control[x]=false;
					   }
                    }
					this.fee_show_control.fee_qt=true;
                    data.pay_detail=Object.assign(payObj, JSON.parse(curVal.pay_details)); 

                    data.shipper_order_no = curVal.shipper_order_no
                    data.shipper_remark = curVal.shipper_remark
                    data.create_user_id = curVal.create_user_id
                    data.bulk_type = curVal.bulk_type
                    data.is_kzj = curVal.is_kzj
                    this.is_pickup = curVal.is_pickup=="Y"?true:false
                    this.is_delivery = curVal.is_delivery=="Y"?true:false
                    data.order_volumes = curVal.order_volumes
                    data.order_weights = curVal.order_weights
                    
                    data.cargos_remark = curVal.cargos_remark
                    data.send_company = curVal.send_company
                    data.begin_ad = curVal.begin_code+"$"+curVal.begin_area
                    data.begin_code = curVal.begin_code
                    data.begin_area = curVal.begin_area
                    data.begin_address = curVal.begin_address
                    data.begin_link_man = curVal.begin_link_man
                    data.begin_link_mobile = curVal.begin_link_mobile
                    data.begin_lng = curVal.begin_lng
                    data.begin_lat = curVal.begin_lat
                    data.receive_company = curVal.receive_company
                    data.end_ad = curVal.end_code+"$"+curVal.end_area
                    data.end_code = curVal.end_code
                    data.end_area = curVal.end_area
                    data.end_address = curVal.end_address
                    data.end_link_man = curVal.end_link_man
                    data.end_link_mobile = curVal.end_link_mobile
                    data.end_lng = curVal.end_lng
                    data.end_lat = curVal.end_lat
                    
                    
                    data.pay_type = curVal.pay_type
                    data.back_type = curVal.back_type
                    data.back_nums = curVal.back_nums
                    data.order_create_time = curVal.order_create_time
                    data.expect_arrive_days = curVal.expect_arrive_days  
                    data.order_no= curVal.order_no  
					data.order_id = this.order_id   
                    data.back_type_other = curVal.back_type_other  
                    setTimeout(function(){
                        data.fee_transport = curVal.fee_transport
                        data.pay_total = curVal.pay_total
                    },100)  
    　　　　　　　},
                deep:true
            },
        },
    }
function getPayment(cargos) {
    let price = 0;
    for (let i = 0; i < cargos.length; i++) {
        let type 
        if(cargos[i].c_price_unit=="元/吨"){
            type='c_weight';
        }
        else if(cargos[i].c_price_unit=="元/件"){
            type='c_amount';
        }
        else if(cargos[i].c_price_unit=="元/方"){
            type='c_volume';
        }
        if (cargos[i].c_name) {
            if (cargos[i].c_price && cargos[i][type]) {
                price += parseFloat(cargos[i].c_price) * parseFloat(cargos[i][type])
            }
        }
    }
    return Math.round(price * 100) / 100;
}
function getWeightVolumes(cargos) {
    let obj = {};
    let weights = 0;
    let volumes = 0;
    let length = cargos.length;
    for (let i = 0; i < length; i++) {
        if (cargos[i].c_name) {
            weights += parseFloat(cargos[i].c_weight);
            volumes += parseFloat(cargos[i].c_volume);
        }
    }
    obj.weights = weights;
    obj.volumes = volumes;
    return obj;

}
//计算合记费用
function getPaydetailTotal(e){
    var paynum=0;
    $.each(e,function(name,value){
        if(!(isNaN(parseFloat(value)))){
            paynum+=parseFloat(value)
        }
    });
    return paynum;
}
</script>
<style lang="scss">

</style>