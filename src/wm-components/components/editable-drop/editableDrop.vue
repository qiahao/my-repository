<template>
    <div :class="classes" @click="toggleMenu" v-clickoutside="clickoutsideHandle">
        <i-input class="wm-drop-input" type="text" v-model="query" :placeholder="placeholder" :disabled="disabled" @on-blur="blurHandle" @input="inputHandle" @on-change="changeHandle" @on-enter="enterHandle"></i-input>
        <transition name="slide-up">
            <ul class="wm-drop-list" v-show="!hidden">
                <slot></slot>
            </ul>
        </transition>
    </div>
</template>
<script>
import emitter from '@/mixins/emitter'
import clickoutside from '@/directives/clickoutside'

const prefixCls = 'wm-editable-drop'
export default {
    name: 'editableDrop',
    props: {
        value: '',
        placeholder: {
            default: '请输入数据'
        },
        disabled: {
            default: false
        }
    },
    data() {
        return {
            visible: false,
            model: '',
            query: '',
            resultData: null,
            clickOptionChange: false
        }
    },
    mixins: [emitter],
    directives: { clickoutside },
    computed: {
        classes() {
            return [`${prefixCls}`]
        },
        hidden() {
            return !this.visible || this.disabled
        }
    },

    watch: {
        value(n) {
            this.model = n
        },

        model(n) {
            this.query = n
            this.findChild((child) => {
                child.selected = child.value == this.model
                return child.selected
            })
            this.$emit('input', n)

            this.clickOptionChange = false
        },

        query(n) {
            this.model = n
            this.broadcast('query-change', n)

        },
    },
    methods: {
        findChild(cb) {
            let found = false
            const find = function(child) {
                const name = child.$options.name;
                if (name == 'wmEditableDropOption') {
                    return cb(child);
                }
            };
            // if (!this.clickOptionChange) {
            for (let i = 0, l = this.$children.length; i < l; i++) {

                find(this.$children[i])
                // if (find(this.$children[i])) {
                //     this.$children[i].$emit('set-on-chick')
                //     found = true
                // }
            }
            // }

            if (!found && !this.clickOptionChange) {
                this.$emit('on-select', this.query, null)
            }
        },
        toggleMenu() {
            if (this.disabled) return false
            this.visible = !this.visible
        },
        clickoutsideHandle() {
            this.visible = false
        },
        inputHandle(val) {
            // 解决表单验证 延迟问题
            this.$emit('input', val)
        },
        changeHandle(e) {
            this.$emit('on-change', e.target.value)
            this.$nextTick(()=>{
                this.checkSelect()
            })

        },
        blurHandle(e) {
            this.$emit('input-blur', e.target.value)
            this.$nextTick(()=>{
                this.checkSelect()
            })
        },
        enterHandle(e){
            this.$emit('on-enter', e.target.value)  
        },
        checkSelect() {
            this.findChild((child) => {
                child.selected = child.value == this.model
            })
        }

    },
    mounted() {
        this.model = this.value
        
        this.$on('option-select', (val1, val2) => {
            this.query = val1;
            this.clickOptionChange = true
            this.$emit('on-select', val1, val2)
        })
    },
}
</script>