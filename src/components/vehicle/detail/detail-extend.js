import detailModal from '@/common/detail-modal'
import imgUpload from '@/common/upload-image'
import detailMixin from '@/mixins/detail-mixin'
import emitter from '@/mixins/emitter'
import * as constants from './constants.js'

const phoneRge = /^1[3|4|5|6|7|8|9][\d]{9}$/;
export default {
    name: 'vehicle',
    data() {
        return {
            formRule: constants.getRules(),
            dict: {
                truckType: [],
                truckLength: [],
                truckPlateType: [],
                truckVehicleType: []
            },
            vehicle: constants.getInitVehicle(),
        }
    },
    mixins: [detailMixin,emitter],
    components: {detailModal, imgUpload },
    computed: {
        truckPics () {
            return this.vehicle.truck_pics ? this.vehicle.truck_pics.split(',') : []
        }
    },
    methods: {
        init(){

        }, 
        closeDetail(){
            this.detailShow = false
            this.$router.push({name: 'vehicleV1List'})
        },
        initDict() {
            function buildDict(data) {
                if (data && data.result == 1 && data.resultObj && data.resultObj.length > 0) 
                    return data.resultObj.map(x => x)
                return []
            }
            this.$api.dictApi.dictTruckTypeApi()
                .then(data => { this.dict.truckType = buildDict(data) });
            this.$api.dictApi.dictTruckLengthApi()
                .then(data => { this.dict.truckLength = buildDict(data) });
            this.$api.dictApi.dictTruckPlateTypeApi()
                .then(data => { this.dict.truckPlateType = buildDict(data) });
        },
        transBlur(){
				this.vehicle.truck_plate=this.vehicle.truck_plate.toUpperCase();
			},
        removeImg(viewImg, viewIndex, uploadId) {
            if (this.vehicle[uploadId].indexOf(viewImg.name) > -1) {
                this.vehicle[uploadId] = this.vehicle[uploadId].replace(viewImg.name, '')
            }
            this.vehicle[uploadId] = this.vehicle[uploadId].split(',').filter(x => x && x != '').join(',')
        },
        uploadedImg(file, compoId) {
            this.vehicle[compoId] = file.url
        },
        singleUpload(file, compoId) {
            this.vehicle[compoId] = file.url
        },
        multipleUpload(file, compoId) {
            if (this.vehicle[compoId]) {
                this.vehicle[compoId] += ',' + file.url
            }else{
                this.vehicle[compoId] = file.url
            }
        },
        // 根据手机号 获取运吧司机详情
        getYunbaVehicle (){
            if (!this.isAddVehicle || !phoneRge.test(this.vehicle.driver_mobile)) 
                return false
            
            this.$api.vehicleApi.getYunbaDriverInfo({driver_mobile: this.vehicle.driver_mobile}).then((data)=>{
                if (!data.resultObj) {return}
                for (let key in data.resultObj) {
                    if (data.resultObj.hasOwnProperty(key) && data.resultObj[key]) {
                        this.vehicle[key] = data.resultObj[key]
                    }
                }
            })
        },
        
        getYunbaTruckInfo (){
            if (!this.isAddVehicle || this.vehicle.truck_plate.length < 6 )
                return false
            this.$api.vehicleApi.getYunbaTruckInfo({truck_plate: this.vehicle.truck_plate}).then((data)=>{
                if (!data.resultObj) {return}
                for (let k in data.resultObj) {
                    if (data.resultObj.hasOwnProperty(k) && data.resultObj[k] && !this.vehicle[k]) {
                        this.vehicle[k] = data.resultObj[k]
                    }
                }
            
            })
        }
    },
    
    created() {
        this.initDict()
    },

}