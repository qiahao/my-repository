<script>
import extendComp from './detail-extend.vue'

export default {
    name: 'vehicleDetail',
    data() {
        return {
            title: '车辆详情',
            isAddVehicle: false,
        }
    },
    extends: extendComp,
    watch: {},
    methods: {
        init(){
            this.loadDetail()
        },
        loadDetail(driver) {
            let params = {driver_id: this.id}
            this.$api.vehicleApi.apiDetailVehicle(params).then(data => {
                this.vehicle = data.resultObj
            })
        },
        saveVehicle() {
            let _valid = false
            this.$refs.formVehicle.validate(valid => _valid = valid)
            if (!_valid) {return }
            
            let params = Object.assign(this.vehicle)
            if (!params.truck_vehicle_type) {params.truck_vehicle_type = 'H01'}
            this.$api.vehicleApi.apiEditVehicle(params).then(data => {
                this.$Message.success('修改车辆成功')
                this.dispatch('vehicle-list-reload')
            })
        
        }
    },
}
</script>
<style>
    
</style>