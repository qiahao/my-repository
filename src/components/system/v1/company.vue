<template>
	<div>
		<div class="contain-main">
            <Row>
                <Col span="16" offset="2">
        			<Form ref="company" :model="company" :rules="ruleValidate" :label-width="140">
        		        <Form-item label="企业标志">
        		        	<!-- <img style="width: 100px; height: 100px;" :src="company.company_logo_url" > -->
        		        	<template>
        					    <div class="demo-upload-list" v-for="item in uploadList">
        					        <template v-if="item.status === 'finished'">
        					            <img :src="item.url">
        					            <div class="demo-upload-list-cover">
        					                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
        					                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        					            </div>
        					        </template>
        					        <template v-else>
        					            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        					        </template>
        					    </div>
        					    <Upload
                                    v-show='uploadList.length==0'
        					        ref="upload"
        					        :show-upload-list="false"
        					        :default-file-list="defaultList"
        					        :on-success="handleSuccess"
        					        :format="['jpg','jpeg','png']"
        					        :max-size="2048"
        					        :on-format-error="handleFormatError"
        					        :on-exceeded-size="handleMaxSize"
        					        :before-upload="handleBeforeUpload"
        					        multiple
        					        type="drag"
        					        :action="action"
        					        style="display: inline-block;width:58px;">
        					        <div style="width: 58px;height:58px;line-height: 58px;">
        					            <Icon type="camera" size="20"></Icon>
        					        </div>
        					    </Upload>
        					    <Modal title="查看图片" v-model="visible">
        					        <img :src="imgName"  style="width: 100%">
                                    <div slot="footer"></div>
        					    </Modal>
        					</template>
        		        </Form-item>
        		        <Form-item label="公司名称" prop="company_name">
        		            <i-input v-model="company.company_name"></i-input>
        		        </Form-item>
        		        <Form-item label="公司编号" prop="short_cut">
        		            <i-input v-model="company.short_cut" readonly="readonly"></i-input>
        		        </Form-item>
        		        <Form-item label="公司地址" prop="company_address">
        		            <i-input type="textarea" v-model="company.company_address"></i-input>
        		        </Form-item>
        		        <Form-item label="联系人" prop="link_man">
        		            <i-input v-model="company.link_man"></i-input>
        		        </Form-item>
        		        <Form-item label="联系电话" prop="link_mobile">
        		            <i-input v-model="company.link_mobile"></i-input>
        		        </Form-item>
        		        <Form-item label="身份证号" prop="link_id_no">
        		            <i-input v-model.trim="company.link_id_no"></i-input>
        		        </Form-item>
        		        <Form-item label="统一社会信用代码" prop="biz_permit_no">
        		            <i-input v-model="company.biz_permit_no"></i-input>
        		        </Form-item>
        		        <Form-item label="企业注册地址" prop="biz_permit_addr">
        		            <i-input type="textarea" v-model="company.biz_permit_addr"></i-input>
        		        </Form-item>
        		        <Form-item label="道路运输经营许可证" prop="road_permit_no">
        		            <i-input v-model="company.road_permit_no"></i-input>
        		        </Form-item>
        		        <Form-item label="经营范围" prop="road_permit_scope">
        		            <i-input v-model="company.road_permit_scope"></i-input>
        		        </Form-item>
        		        <Form-item>
        		            <Button type="primary" @click="saveData('company')">保存</Button>
        		        </Form-item>
        		    </Form>

                </Col>
            </Row>
	    </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
	import * as companyApi from '@/api/src/companyApi'
    import config from '@/config/index'
    import rule from '@/utils/validate-rule'
    import { utilCookie } from '@/utils/util'
    import { COOKIES } from '@/utils/constant'

    const RULE_VALIDATE = {
        company_name: [
            rule.required({ message: '公司名称不能为空'}),
            rule.max({ max: 50 , message: '公司名称不能超过50字符'}),        
        ],        
        short_cut: [
            rule.required({ message: '公司编号不能为空'}),
        ],
        company_address: [        
            rule.required({ message: '公司地址不能为空'}),
        ],
        link_man: [
            rule.required({ message: '联系人不能为空'}),
        ],
        link_mobile: [
            rule.required({ message: '联系电话不能为空'}),
        ],
        link_id_no: [
            { validator: rule.idCard,  message: '请输入正确的身份证号', trigger: 'blur' }
        ],
        road_permit_no: [
            rule.max({ max: 50 , message: '长度不能超过50字符'}),
        ],
        road_permit_scope: [
            rule.max({ max: 100 , message: 'message:'}),
        ],
        biz_permit_addr: [
            rule.max({ max: 100 , message: 'message:'}),
        ],
        biz_permit_no: [
            rule.max({ max: 50 , message: '长度不能超过50字符'}),
        ]
    }

	export default {
		name: 'company',
		data (){
			
			return {
				// 图片上传属性
				defaultList: [],
                imgName: '',
                visible: false,
                uploadList: [],
                action: config.imgUploadUrl,
				company: {
					company_name: '',
					short_cut: '',
					company_address: '',
					link_man: '',
					link_mobile: '',
					link_id_no: '',
					road_permit_no: '',
					road_permit_scope: '',
					biz_permit_addr: '',
					biz_permit_no: ''
				},
                ruleValidate: RULE_VALIDATE
			}
		},
        computed: {
            ...mapState(['userInfo'])
        },
		methods: {
			loadData() {
				let params = {company_id: this.userInfo.company_id || ''};
				companyApi.getCompanyInfo(params).then((data) => {
                    this.company = data.resultObj;
                    if(!data.resultObj.company_logo_url){
                       this.uploadList=[];
                       return
                    }
                    let logo = this.company.company_logo_url;
                    this.uploadList = [{
                		name: logo,
                		url: logo.indexOf(config.imgHost) == -1 ? `${config.imgHost + logo}` : logo,
                		status : 'finished'
                	}]
				})
			},
			saveData(name) {
				
				let params = Object.assign({},this.company)
				let logo = this.uploadList.length > 0 ? this.uploadList[0].url : '';
				logo = logo.replace(config.imgHost, '')
                params.company_logo_url = logo;
				this.$refs[name].validate((valid) => {
                    if (valid) {
                        companyApi.saveCompanyInfo(params).then((data)=>{
	                        this.$Message.success('保存成功!')
						})
                    } else {
    
                    }
                })
			},

			// 图片上传方法
			handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove (file) {
                // 从 upload 实例删除数据
                this.uploadList = [];
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file) {
                // 因为上传过程为实例，这里模拟添加 url
                let imgurl = file.response.resultObj;
                if (imgurl.indexOf(config.imgHost) < 0) {
                	imgurl = config.imgHost + imgurl;
                }
                file.url = imgurl;
                file.name = imgurl;

            	let l = this.$refs.upload.fileList.length;
                this.uploadList = [this.$refs.upload.fileList[l-1]]
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
                });
            },
            handleBeforeUpload () {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传 5 张图片。'
                    });
                }
                return check;
            }
		},
		created() {
			this.loadData()
			
		},
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
        }
	}
</script>
<style scoped>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>