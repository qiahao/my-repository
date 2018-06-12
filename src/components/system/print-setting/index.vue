<template>
  <div>
    <div class="contain-main ptb20">
      <i-form ref="form" :model="entity" :rules="rules" :label-width="120" style="width: 600px">
        <h3 class="mb20">货签打印设置:</h3>
        <Form-item label="logo图片路径">
            <img-upload upload-id="print_logo_pic" :url-list="entity.print_sign_setting.print_logo_pic" 
            @on-remove="handlerImageRemove"  @on-success="handlerUploadSuccess"></img-upload>
          
          <p>留空表示使用默认值</p>
        </Form-item>
        <Form-item label="收货人电话">
          <RadioGroup v-model="entity.print_sign_setting.is_print_receive_linkmobile">
            <Radio label="Y">打印</Radio>
            <Radio label="N">不打印</Radio>
          </RadioGroup>
        </Form-item>
        <Form-item label="收货人名">
          <RadioGroup v-model="entity.print_sign_setting.is_print_receive_linkman">
            <Radio label="Y">打印</Radio>
            <Radio label="N">不打印</Radio>
          </RadioGroup>
        </Form-item>
        </Form-item>
        <Form-item label="自定义查单热线">
          <i-input v-model="entity.print_sign_setting.custom_order_hotline" placeholder="留空表示使用默认值"></i-input>
        </Form-item>
        
        <h3 class="mb20">运单打印设置:</h3>
        <Form-item label="收货人信息">
          <RadioGroup v-model="entity.print_order_setting.is_hide_receive_linkman">
            <Radio label="N">打印</Radio>
            <Radio label="Y">不打印</Radio>
          </RadioGroup>
        </Form-item>
        <Form-item label="发货人信息">
          <RadioGroup v-model="entity.print_order_setting.is_hide_send_linkman">
            <Radio label="N">打印</Radio>
            <Radio label="Y">不打印</Radio>
          </RadioGroup>
        </Form-item>
        <Form-item label="二维码">
          <RadioGroup v-model="entity.print_order_setting.is_print_QR_code">
            <Radio label="Y">打印</Radio>
            <Radio label="N">不打印</Radio>
          </RadioGroup>
        </Form-item>
        <Form-item label="条形码">
          <RadioGroup v-model="entity.print_order_setting.is_print_bar_code">
            <Radio label="Y">打印</Radio>
            <Radio label="N">不打印</Radio>
          </RadioGroup>
        </Form-item>
        <Form-item label="运单号">
          <RadioGroup v-model="entity.print_order_setting.is_print_order_no">
            <Radio label="Y">打印</Radio>
            <Radio label="N">不打印</Radio>
          </RadioGroup>
        </Form-item>
        <Form-item label="地址的层级">
          <RadioGroup v-model="entity.print_order_setting.print_area_level">
            <Radio label="1">全部</Radio>
            <Radio label="2">最后一级</Radio>
          </RadioGroup>
        </Form-item>


        <h3 class="mb20">打印机设置:</h3>
        <Form-item label="全打打印机">
          <Select v-model="entity.print_mac_setting.order_all_print_mac">
            <Option v-for="(name,i) in printers" :key="i"  :value="name">{{name}}</Option>
          </Select>
        </Form-item>
        <Form-item label="套打打印机">
          <Select v-model="entity.print_mac_setting.order_print_mac">
              <Option v-for="(name,i) in printers" :key="i"  :value="name">{{name}}</Option>
          </Select>
        </Form-item>
        <Form-item label="货签打印机">
          <Select v-model="entity.print_mac_setting.sign_print_mac">
            <Option v-for="(name,i) in printers" :key="i"  :value="name">{{name}}</Option>
          </Select>
        </Form-item>
        <Form-item label="装车清单打印机">
          <Select v-model="entity.print_mac_setting.order_list_print_mac">
            <Option v-for="(name,i) in printers" :key="i"  :value="name">{{name}}</Option>
          </Select>
        </Form-item>
        
        <Form-item>
          <i-button type="primary" @click="handlerSave">保存</i-button>
          <i-button @click="handlerCancel">取消</i-button>
        </Form-item>
  
        
      </i-form>
    </div>
  </div>
</template>
<script>
  import {getLodop} from '@/lib/lodop'
  import imgUpload from '@/common/upload-image'
  let LODOP;
  
  export default {
    data () {
      return {
        entity: {
          print_sign_setting: {
            print_logo_pic: '',//	String		logo图片路径（没有值表示货签不打印个性化logo）
            is_print_receive_linkmobile: 'Y',//	String		是否打印收货人电话（Y：是；N：否）
            custom_order_hotline: '',//	String		自定义查单热线（没有值表示货签使用默认的运吧查单热线电话）
            is_print_receive_linkman: 'Y',//	String		是否打印收货人姓名（Y：是；N：否）
          },
          print_order_setting: {
            is_hide_receive_linkman: 'N',//	String		是否隐藏收货人
            is_hide_send_linkman: 'N',//	String		是否隐藏发货人
            is_print_QR_code: 'Y',//	String		是否打印二维码
            is_print_bar_code: 'Y',//	String		是否打印条形码
            is_print_order_no: 'Y',//	String		是否打印运单号
            print_area_level: '1',//	String		打印地址的层级: 1全打，2最后一级
          },
          print_mac_setting: {
            order_all_print_mac: '',//	String		全打打印机名称
            order_print_mac: '',//	String		套打打印机名称
            sign_print_mac: '',//	String		货签打印机名称
            order_list_print_mac: '',//	String		装车清单打印机名称
          }
        },
        rules: {},
        printers: []
      }
    },
    components: {
      imgUpload
    },
    methods: {
      init(){

      },
      async loadDetail(){
        this.entity = await this.$api.companyApi.getPrintSetting()
      },
      async handlerSave(){
        let postData = {...this.entity}
        await this.$api.companyApi.updatePrintSetting(postData)
        this.$Message.success('操作成功')
      },
      handlerCancel(){
        
        this.loadDetail()
      },
      getPrinterList(){
        LODOP = getLodop()
        if(LODOP && LODOP.Printers && LODOP.Printers.list){
          this.printers = LODOP.Printers.list.map(item => item.name)
        }
      },
      handlerUploadSuccess(response,id){
        this.entity.print_sign_setting[id] = response.url
      },
      handlerImageRemove(item,index,id){
        this.entity.print_sign_setting[id] = ''
      }
    },   
    created() {
      this.getPrinterList()
      this.loadDetail()
    },
  }
</script>
<style lang="scss"></style>