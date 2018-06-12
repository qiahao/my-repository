
<template>
    <Modal v-model="modelShow" @on-ok="onSubmit" @on-cancel="onCancel" :width="width">
      <div class="amap-page-container" v-bind:style="{height: height+'px'}">
          <el-amap vid="amapDemo" :map-manager="AMapManager" :center="center"
                   :zoom="zoom" :plugin="plugin" :events="events" class="amap-demo">
                   
                   <input id="map_search" ref="map_search"></input>
          </el-amap>
          详细地址：<i-input style="width: 70%" v-model="point.addr"></i-input>
      </div>
    </Modal>
</template>
<script>
    import { AMapManager,VueAMap } from 'vue-amap';
    let amapManager = new AMapManager();
    
    export default {
        name: 'mapModal',
        props: {
            mapModal: {
                type: Boolean,
                default: false
            },
            addrMap: {
                type: Object
            }
        },
        data (){
           let _vm = this;
           return {
               
               modelShow: false, // 地图的显示/隐藏
               point: { // 返回结果数据
                   lng: "",
                   lat: "",
                   addr: "",
                   area: "",
                   areaCode: "",
               },
               // map setting
               center: [119.27875, 26.459757],
               zoom: 13,
               AMapManager: amapManager,     //高德地图组件
               events: {
                   init: (o)=> {

                        //输入提示
                        var autoOptions = {
                            input: "map_search"
                        };
                        var auto = new AMap.Autocomplete(autoOptions);
                        var placeSearch = new AMap.PlaceSearch({
                            map: amapManager.getMap()
                        });  //构造地点查询类
                        AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
                        function select(e) {
                            placeSearch.setCity(e.poi.adcode);
                            //placeSearch.search(e.poi.name);  //关键字查询查询

                            let poi = e.poi;
                            let addr = poi.address;
                            let areaCode = poi.adcode;
                            let area = poi.district;
                            let lng = poi.location.lng;
                            let lat = poi.location.lat;
                            /*if(lng != undefined && lng != null && lng != '' 
                              && lat != undefined && lat != null && lat !='') {*/
                            if(lng && lat) {
                              _vm.center = [lng, lat];
                              _vm.addMarker(lng, lat);
                              _vm.setPointInfo(area, areaCode, addr, lng, lat);
                            }
                        }
                   },
                   moveend: () => {
                   },
                   zoomchange: () => {
                   },
                   click: (e) => {
                       this.point.lng = e.lnglat.lng;
                       this.point.lat = e.lnglat.lat;
                       
                       let _vm = this;
                       let geocoder =  new AMap.Geocoder({ 
                            radius: 1000, 
                            extensions: "all" 
                        });
                       geocoder.getAddress([e.lnglat.lng ,e.lnglat.lat],
                           function(status, result) {
                               if (status === 'complete' && result.info === 'OK') {
                                   if (result && result.regeocode) {
                                       
                                       _vm.addMarker(e.lnglat.lng, e.lnglat.lat);
                                       let addr = result.regeocode.formattedAddress;
                                       let areaCode = result.regeocode.addressComponent.adcode;
                                       let area = result.regeocode.addressComponent.province + "-"
                                           + result.regeocode.addressComponent.city + "-"
                                           + result.regeocode.addressComponent.district;

                                       _vm.setPointInfo(area, areaCode, addr, e.lnglat.lng ,e.lnglat.lat);
                                   }
                               }
                           });

                   }
               },
               plugin: ['ToolBar', {
                   pName: 'MapType',
                   defaultType: 0,
                   events: {
                       init(o) {
                       }
                   }
               }],

           }
        },
        created() {

        },

        methods:{
           
            // 地图标志物
            addMarker(lng, lat) {
                
                let _vm = this;
                _vm.clearMap();
                var marker = new AMap.Marker({
                    map: amapManager.getMap(),
                    position: [ lng,  lat]
                });
            },
            // 设置point返回数据
            setPointInfo(area, areaCode, address, lng, lat) {
                this.point.addr = address;
                this.point.areaCode = areaCode;
                this.point.area = area;
                this.point.lng = lng;
                this.point.lat = lat;

            },
            // 出发数据返回
            onSubmit(){
                this.$emit('returnPoint',this.point);
                this.clearMap();
                this.setPointInfo('','','','','');
                this.$refs.map_search.value = '';
            },
            onCancel(){
                this.$emit('returnPoint', null);
                this.clearMap();
                this.setPointInfo('','','','','');
                this.$refs.map_search.value = '';
            },
            clearMap(){
              let map = amapManager.getMap();
              map.clearMap();
            }
        },
        computed : {
            width: function(){
              let winWidth = 1920;
              // 获取窗口宽度
              if (window.innerWidth)
                  winWidth = window.innerWidth;
              else if ((document.body) && (document.body.clientWidth))
                  winWidth = document.body.clientWidth;
              
              // 通过深入 Document 内部对 body 进行检测，获取窗口大小
              if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
              {
                  winWidth = document.documentElement.clientWidth;
              }
                return winWidth/2;
            },
            height: function(){
                let winHeight = 300;
                // 获取窗口高度
                if (window.innerHeight)
                    winHeight = window.innerHeight;
                else if ((document.body) && (document.body.clientHeight))
                    winHeight = document.body.clientHeight;

                // 通过深入 Document 内部对 body 进行检测，获取窗口大小
                if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
                {
                    winHeight = document.documentElement.clientHeight;
                }
                return winHeight * 0.6;
            }
        },
        watch: {
            addrMap(addrMap) {
                let _vm = this;
                if (addrMap) {
                    var lng = addrMap.lng;
                    var lat = addrMap.lat;
                    var area  = addrMap.area;
                    var areaCode = addrMap.areaCode;
                    var address = addrMap.address;
                    _vm.setPointInfo(area, areaCode, address, lng, lat);

                    // 1、经纬度定位
                    if (lng != null && lng !='' && lat != null && lat != '') {
                        _vm.center = [lng, lat];
                        _vm.addMarker(lng, lat);
                    // 2、区域定位
                    }else if(area != null && area !=''){
                        let geocoder =  new AMap.Geocoder({ 
                            radius: 1000, 
                            extensions: "all" 
                        });
                        geocoder.getLocation(area, function(status ,result){
                            if("complete" === status ){
                                _vm.center = [result.geocodes["0"].location.lng, result.geocodes["0"].location.lat];
                            }else {
                                _vm.$Message.error('地址解析错误，请检查网络');
                            }
                        })
                    }else {
                        var citysearch = new AMap.CitySearch();
                        //自动获取用户IP，返回当前城市
                        citysearch.getLocalCity(function(status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                if (result && result.city && result.bounds) {
                                    
                                    var citybounds = result.bounds;
                                    //地图显示当前城市
                                    amapManager.getMap().setBounds(citybounds);
                                }
                            } else {
                                
                            }
                        }); 
                    }
                }
            },
            mapModal(val) {
               this.modelShow = val;
            }
        }
    }

</script>
<style>
.amap-demo {
    height: 300px;
}
#map_search {
    position: absolute;
    top: 20px;
    right: 25%;
    width: 50%;
    left: 25%;
    height: 30px;
    font-size: 14px;
    padding: 0 5px 0 5px;
}
</style>