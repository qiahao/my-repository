<template>
  <div :class="classes" v-clickoutside="handleClose">
    <div :class="[prefixCls + '-selection']" ref="reference" @click="toggleMenu">
      <!-- <div class="ivu-tag" v-for="(item, index) in selectedMultiple">
                <span class="ivu-tag-text">{{ item.label }}</span>
                <Icon type="ios-close-empty" @click.native.stop="removeTag(index)"></Icon>
            </div> -->
      <!-- <span :class="[prefixCls + '-placeholder']" v-show="showPlaceholder && !filterable">{{ localePlaceholder }}</span>
            <span :class="[prefixCls + '-selected-value']" v-show="!showPlaceholder && !multiple && !filterable">{{ selectedSingle }}</span> -->
      <input type="text" v-model="query" :class="[prefixCls + '-input']" :placeholder="placeholder" @blur="handleBlur" @keydown="resetInputState" @keydown.delete="handleInputDelete" ref="input">
    </div>

    <transition name="slide-down">
      <Drop v-show="dropVisible" placement="bottom" ref="dropdown">
        {{selectedValues}}
        <city-cascade
                      :data="data" 
                      :select-value="selectedValues" 
                      @select-item="handlerSelectCityCascade"></city-cascade>
        <city-list v-show="listVisible" 
                    :data-list="queryDataList"
                    @select-item="handlerSelectCityList"></city-list>
      </Drop>
    </transition>
  </div>
</template>
<script>
// import Icon from '../icon';
import clickoutside from "@/directives/clickoutside.js";
// import { oneOf, findComponentDownward } from '../../utils/assist';
import Emitter from "@/mixins/emitter";
// import Locale from '../../mixins/locale';

import Drop from "./components/dropdown.vue";
import cityCascade from "./components/cascade";
import cityList from "./components/list";

// test data
import { dataList ,cityListData} from "./src/test-data";

const prefixCls = "ivu-select";

export default {
  name: "wmCitySelect",
  mixins: [Emitter],
  // mixins: [ Emitter, Locale ],
  components: { Drop, cityCascade, cityList },
  directives: { clickoutside },
  props: {
    value: {
      type: [String, Number, Array],
      default: ""
    },
    label: {
      type: [String, Number, Array],
      default: ""
    },

    disabled: {
      type: Boolean,
      default: false
    },
    // remoteMethod: {
    //     type: Function
    // },
    placeholder: {
      type: String,
      default: "请选择城市"
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      // 是否显示
      visible: false, // 点击组件输入框架、选择城市时切换
      visebleActivated: false, // 是否激活组件下拉显示状态：由外面改变 value 时不触发组件下拉
      isListVisible: false,
      selectToChangeQuery: false, // 临时变量，改变query 是否为选择城市触发


      
      // options: [],
      // optionInstances: [],
      data: dataList, // 所有城市数据列表： 数组，组件内转树型数据
      queryDataList: [],
      query: "",
      // selectedValues: [],
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-visible`]: this.visible,
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-multiple`]: this.multiple,
          [`${prefixCls}-single`]: !this.multiple,
          [`${prefixCls}-show-clear`]: this.showCloseIcon,
          [`${prefixCls}-${this.size}`]: !!this.size
        }
      ];
    },
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    selectedValues() {
      if (!this.value) { return []; }
      for (let i = 0, l = this.data.length; i < l; i++) {
        if (this.data[i].code == this.value) {
          this.query = this.data[i].label
          return this.data[i].fullCode;
        }
      }
      return []
    },
    dropVisible() {
      return this.visible && this.visebleActivated
    },

    listVisible() {
      return this.dropVisible && this.isListVisible;
    }
  },
  watch: {
    value(val) {
      if (val === "") this.query = "";
    },
    
    query(val) {
      if (!this.selectToChangeQuery) {
        this.isListVisible = true;
        // this.visible = true;
        this.remoteMethod(val);
      } else {
        this.isListVisible = false;
      }

      this.selectToChangeQuery = false;

      // this.remoteMethod(val);

      // if (this.remoteMethod) {
      //     if (!this.selectToChangeQuery) {
      //         this.$emit('on-query-change', val);
      //         this.remoteMethod(val);
      //     }
      //     // this.findChild(child => {
      //     //     child.isFocus = false;
      //     // });
      // }
      // else {
      //     if (!this.selectToChangeQuery) {
      //         this.$emit('on-query-change', val);
      //     }
      //     this.broadcastQuery(val);

      //     let is_hidden = true;

      //     this.$nextTick(() => {
      //         this.findChild((child) => {
      //             if (!child.hidden) {
      //                 is_hidden = false;
      //             }
      //         });
      //         this.notFound = is_hidden;
      //     });
      // }
      // this.selectToChangeQuery = false;
      // this.broadcast('Drop', 'on-update-popper');
    },
    visible(val) {
      // if (val) {
      //     if (this.filterable) {
      //         if (this.multiple) {
      //             this.$refs.input.focus();
      //         } else {
      //             this.$refs.input.select();
      //         }
      //         if (this.remote) {
      //             this.findChild(child => {
      //                 child.selected = this.multiple ? this.model.indexOf(child.value) > -1 : this.model === child.value;
      //             });
      //             // remote下，设置了默认值，第一次打开时，搜索一次
      //             const options = this.$slots.default || [];
      //             if (this.query !== '' && !options.length) {
      //                 this.remoteMethod(this.query);
      //             }
      //         }
      //     }
      //     this.broadcast('Drop', 'on-update-popper');
      // } else {
      //     if (this.filterable) {
      //         this.$refs.input.blur();
      //         // #566 reset options visible
      //         setTimeout(() => {
      //             this.broadcastQuery('');
      //         }, 300);
      //     }
      //     this.broadcast('Drop', 'on-destroy-popper');
      // }
    },
  },
  methods: {
    toggleMenu() {
      if (this.disabled) {
        return false;
      }
      this.visible = !this.visible;
    },
    hideMenu() {
      this.visible = false;
    },

    remoteMethod() {
      return this.queryDataList = cityListData;
    },

    // 联级城市选择
    handlerSelectCityCascade(item) {
      this.selectCity(item);
      this.isListVisible = false;
    },
    // 筛选城市选择
    handlerSelectCityList(item) {
      this.isListVisible = true;
      this.selectCity(item);
    },
    selectCity(item) {
      this.selectToChangeQuery = true;
      this.query = item.label;
      this.model = item.code;
      this.selectedValues = item.fullCode;
    },

    // find option component
    findChild(cb) {
      const find = function(child) {
        const name = child.$options.componentName;

        if (name) {
          cb(child);
        } else if (child.$children.length) {
          child.$children.forEach(innerChild => {
            find(innerChild, cb);
          });
        }
      };

      if (this.optionInstances.length) {
        this.optionInstances.forEach(child => {
          find(child);
        });
      } else {
        this.$children.forEach(child => {
          find(child);
        });
      }
    },
    updateOptions(init, slot = false) {
      let options = [];
      let index = 1;

      this.findChild(child => {
        options.push({
          value: child.value,
          label: child.label === undefined ? child.$el.innerHTML : child.label
        });
        child.index = index++;

        if (init) {
          this.optionInstances.push(child);
        }
      });

      this.options = options;

      if (init) {
        if (!this.remote) {
          this.updateSingleSelected(true, slot);
          this.updateMultipleSelected(true, slot);
        }
      }
    },

    handleClose() {
      this.hideMenu();
    },

    handleKeydown(e) {
      if (this.visible) {
        const keyCode = e.keyCode;
        // Esc slide-up
        if (keyCode === 27) {
          e.preventDefault();
          this.hideMenu();
        }
        // next
        if (keyCode === 40) {
          e.preventDefault();
          this.navigateOptions("next");
        }
        // prev
        if (keyCode === 38) {
          e.preventDefault();
          this.navigateOptions("prev");
        }
        // enter
        if (keyCode === 13) {
          e.preventDefault();

          this.findChild(child => {
            if (child.isFocus) {
              child.select();
            }
          });
        }
      }
    },
    navigateOptions(direction) {
      if (direction === "next") {
        const next = this.focusIndex + 1;
        this.focusIndex = this.focusIndex === this.options.length ? 1 : next;
      } else if (direction === "prev") {
        const prev = this.focusIndex - 1;
        this.focusIndex = this.focusIndex <= 1 ? this.options.length : prev;
      }

      let child_status = {
        disabled: false,
        hidden: false
      };

      let find_deep = false; // can next find allowed

      this.findChild(child => {
        if (child.index === this.focusIndex) {
          child_status.disabled = child.disabled;
          child_status.hidden = child.hidden;

          if (!child.disabled && !child.hidden) {
            child.isFocus = true;
          }
        } else {
          child.isFocus = false;
        }

        if (!child.hidden && !child.disabled) {
          find_deep = true;
        }
      });

      this.resetScrollTop();

      if ((child_status.disabled || child_status.hidden) && find_deep) {
        this.navigateOptions(direction);
      }
    },
    resetScrollTop() {
      const index = this.focusIndex - 1;
      let bottomOverflowDistance =
        this.optionInstances[index].$el.getBoundingClientRect().bottom -
        this.$refs.dropdown.$el.getBoundingClientRect().bottom;
      let topOverflowDistance =
        this.optionInstances[index].$el.getBoundingClientRect().top -
        this.$refs.dropdown.$el.getBoundingClientRect().top;

      if (bottomOverflowDistance > 0) {
        this.$refs.dropdown.$el.scrollTop += bottomOverflowDistance;
      }
      if (topOverflowDistance < 0) {
        this.$refs.dropdown.$el.scrollTop += topOverflowDistance;
      }
    },
    handleBlur() {
      setTimeout(() => {
        const model = this.model;

        if (this.multiple) {
          this.query = "";
        } else {
          if (model !== "") {
            this.findChild(child => {
              if (child.value === model) {
                this.query =
                  child.label === undefined ? child.searchLabel : child.label;
              }
            });
            // 如果删除了搜索词，下拉列表也清空了，所以强制调用一次remoteMethod
            if (this.remote && this.query !== this.lastQuery) {
              this.$nextTick(() => {
                this.query = this.lastQuery;
              });
            }
          } else {
            this.query = "";
          }
        }
      }, 300);
    },
    resetInputState() {
      // this.inputLength = this.$refs.input.value.length * 12 + 20;
    },

    // use when slot changed
    slotChange() {
      this.options = [];
      this.optionInstances = [];
    }

    // broadcastQuery (val) {
    //     if (findComponentDownward(this, 'OptionGroup')) {
    //         this.broadcast('OptionGroup', 'on-query-change', val);
    //         this.broadcast('iOption', 'on-query-change', val);
    //     } else {
    //         this.broadcast('iOption', 'on-query-change', val);
    //     }
    // }
  },
  mounted() {
    // this.modelToQuery();
    // // 处理 remote 初始值
    // if (this.remote) {
    //     if (!this.multiple && this.model !== '') {
    //         this.selectToChangeQuery = true;
    //         if (this.currentLabel === '') this.currentLabel = this.model;
    //         this.lastQuery = this.currentLabel;
    //         this.query = this.currentLabel;
    //     } else if (this.multiple && this.model.length) {
    //         if (this.currentLabel.length !== this.model.length) this.currentLabel = this.model;
    //         this.selectedMultiple = this.model.map((item, index) => {
    //             return {
    //                 value: item,
    //                 label: this.currentLabel[index]
    //             };
    //         });
    //     }
    // }
    // this.$nextTick(() => {
    //     this.broadcastQuery('');
    // });
    // this.updateOptions(true);
    // document.addEventListener('keydown', this.handleKeydown);
    // this.$on('append', () => {
    //     if (!this.remote) {
    //         this.modelToQuery();
    //         this.$nextTick(() => {
    //             this.broadcastQuery('');
    //         });
    //     } else {
    //         this.findChild(child => {
    //             child.selected = this.multiple ? this.model.indexOf(child.value) > -1 : this.model === child.value;
    //         });
    //     }
    //     this.slotChange();
    //     this.updateOptions(true, true);
    // });
    // this.$on('remove', () => {
    //     if (!this.remote) {
    //         this.modelToQuery();
    //         this.$nextTick(() => {
    //             this.broadcastQuery('');
    //         });
    //     } else {
    //         this.findChild(child => {
    //             child.selected = this.multiple ? this.model.indexOf(child.value) > -1 : this.model === child.value;
    //         });
    //     }
    //     this.slotChange();
    //     this.updateOptions(true, true);
    // });
    // this.$on('on-select-selected', (value) => {
    //     if (this.model === value) {
    //         this.hideMenu();
    //     } else {
    //         if (this.multiple) {
    //             const index = this.model.indexOf(value);
    //             if (index >= 0) {
    //                 this.removeTag(index);
    //             } else {
    //                 this.model.push(value);
    //                 this.broadcast('Drop', 'on-update-popper');
    //             }
    //             if (this.filterable) {
    //                 // remote&filterable&multiple时，一次点多项，不应该设置true，因为无法置为false，下次的搜索会失效
    //                 if (this.query !== '') this.selectToChangeQuery = true;
    //                 this.query = '';
    //                 this.$refs.input.focus();
    //             }
    //         } else {
    //             this.model = value;
    //             if (this.filterable) {
    //                 this.findChild((child) => {
    //                     if (child.value === value) {
    //                         if (this.query !== '') this.selectToChangeQuery = true;
    //                         this.lastQuery = this.query = child.label === undefined ? child.searchLabel : child.label;
    //                     }
    //                 });
    //             }
    //         }
    //     }
    // });
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handleKeydown);
  }
};
</script>
