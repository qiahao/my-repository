<template>
  <div>
    <Row class="wm-city-head">
      <i-col span="8" 
              v-for="(item,i) in cityLevel" 
              :key="i" 
              :class="{'activated': currentLevel == item.level , 'disabled' : item.level > selectValueLength + 1 }"
              @click.native="handlerChangeCityLevel(item.level)">{{item.label}}</i-col>
    </Row>

    <div class="wm-city-contain wm-city-contain__cascade ">
      <ul>
        <li v-for="(item,i) in currentCityList" 
            @click="handlerClickItem(item)"
            :class="{'activated': selectValue.includes(item.code)}">{{item.label}}</li>      
      </ul>
    </div>
  </div>
</template>

<script>
import Emitter from "@/mixins/emitter";


const array2tree = (array, pflag = 'pid', sflag = 'id', root = 0) => {
    function cascader (pid) {
        const target = []
        array.forEach(a => {
            const _clone = Object.assign({}, a)
            if (_clone[pflag] == pid) {
                target.push(_clone)
                const _child = cascader(_clone[sflag])
                if (_child.length)
                    _clone.children = _child
            }
        });
        return target
    }
    return cascader(root)
};



const cityLevel = [
  {level: 1 , label: '省份'},
  {level: 2 , label: '城市'},
  {level: 3 , label: '区县'},
]

export default {
  props: {
    selectValue: {
      type: [Array],
      default () {
        return[]
      }
    },
    data: {
      type: [Array],
      default () {
        return[]
      }
    }

  },
  data () {
    return {
      cityListCache: {},
      cityLevel,
      currentLevel: 1,
    }
  },
  computed: {
    treeData(){
      return array2tree(this.data, 'parentCode','code', '0')
    },
    selectValueLength () {
      return this.selectValue.length
    },
    currentCityList () {
      return this.levelsCityMap[`${this.currentLevel}`]
    },

    levelsCityMap (){
      let obj = {}, l = 1
      
      if (!this.selectValue.length) {
        return obj = {'1': this.treeData}
      }

      let outArray = this.treeData
      
      const t = (arr,code,j) => {
        for (let i = 0, l = arr.length; i < l; i++) {
          if (arr[i].code == code) {
            obj[`${j}`] = [...arr]
            if (arr[i].children && arr[i].children.length) {
              outArray =  obj[`${j + 1}`] = [...arr[i].children] 
              return 
            }
          }
        }
      }

      this.selectValue.forEach((code,j) => {
        t(outArray,code, j + 1)
      })

      return obj
    }
  },
  methods: {
    handlerChangeCityLevel(level){
      if(!this.levelsCityMap[`${level}`] || !this.levelsCityMap[`${level}`].length){
        return
      }
      this.currentLevel = level
    },
    handlerClickItem (item){
      this.$emit('select-item',item)
      this.$nextTick(() => {
        this.$nextTick(() => {
        if(this.levelsCityMap[`${this.currentLevel + 1}`] && this.levelsCityMap[`${this.currentLevel + 1}`].length){
          this.currentLevel ++
        }
        })
      })
    },

    updateCityMap () {
      
    }
  }
};
</script>

<style lang="scss">
$hoverColor: #2d8cf0;
.wm-city-head{
  .ivu-col{
    cursor: pointer;
    background: #eee;
    text-align: center;
    &.activated{
      color: $hoverColor;
      background: #fff;
    }
    &.disabled {
      cursor: not-allowed;
    }
  }
}
.wm-city-contain{
  padding: 10px;
  &.wm-city-contain__cascade{
    li{
      display: inline-block;
      padding: 5px 10px;
      margin-bottom: 5px;
      cursor: pointer;
      &:hover,&.activated{
        color: $hoverColor;
      }
    }
  }
}
</style>
