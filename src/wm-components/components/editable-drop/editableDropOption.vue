<template>
    <li :class="classes" @click="clickHandle">
        <slot></slot>
    </li>
</template>
<script>
import emitter from '@/mixins/emitter'
const prefixCls = 'wm-drop-option'
export default {
    name: 'wmEditableDropOption',
    props: {
        value: {
            require: true,
        },
        selectValue: {
            default: null
        }

    },
    data: () => {
        return {
            selected: false
        }
    },
    mixins: [emitter],
    watch: {},
    computed: {
        classes() {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-selected`]: this.selected
                }
            ]
        }
    },
    methods: {
        clickHandle() {
            this.dispatch('option-select', [this.value, this.selectValue])
            this.$emit('on-click')
        },
    },
    mounted() {
        this.$on('set-on-chick', ()=>{
            this.dispatch('option-select', [this.value, this.selectValue])
        })
    },
}
</script>