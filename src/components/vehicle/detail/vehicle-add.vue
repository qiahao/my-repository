<script>
import extendComp from './detail-extend.vue'
import * as constants from './constants.js'
export default {
    name: 'vehicleAdd',
    data() {
        return {
            title: '新增车辆',
            isAddVehicle: true,
        }
    },
    extends: extendComp,
    watch: {
        detailShow(n,o){
            this.initVehicle()
        }
    },
    methods: {
        initVehicle(){
            this.vehicle = constants.getInitVehicle()
            this.$refs.formVehicle.resetFields()
        },
        saveVehicle() {
            let _valid = false
            this.$refs.formVehicle.validate(valid => _valid = valid)
            if (!_valid) {return }
            
            let params = Object.assign(this.vehicle)
            this.$api.vehicleApi.apiAddVehicle(params).then(data => {
                this.$Message.success('新增车辆成功')
                this.dispatch('vehicle-list-reload')
                this.initVehicle()
            })
        }
    }
}
</script>