<template>
    <span :class="classes" @click.stop="select" @mouseout.stop="blur">
        <slot>{{ showLabel }}</slot>
    </span>
</template>
<script>
import Emitter from '@/mixins/emitter';

const prefixCls = 'wm-select-item';

export default {
    name: 'mutipleOption',
    componentName: 'select-item',
    mixins: [Emitter],
    props: {
        value: {
            type: [String, Number],
            required: true
        },
        label: {
            type: [String, Number]
        }
    },
    data() {
        return {
            selected: false,
            index: 0,    // for up and down to focus
        };
    },
    computed: {
        classes() {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-selected`]: this.$parent.value.includes(this.value),
                    [`${prefixCls}-focus`]: this.isFocus
                }
            ];
        },
        showLabel() {
            return (this.label) ? this.label : this.value;
        }
    },
    methods: {
        select() {
            this.dispatch('on-multiple-selected', this.value);
        },
        blur() {
            this.isFocus = false;
        },
        queryChange(val) {
            debugger
            const parsedQuery = val.replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
            this.hidden = !new RegExp(parsedQuery, 'i').test(this.searchLabel);
        }
    },
    mounted() {
        this.searchLabel = this.$el.innerHTML;
        // this.dispatch('append');
        this.$on('on-multiple-close', () => {
            this.isFocus = false;
        });
        this.$on('on-query-change', (val) => {

        });
    }
};
</script>
<style lang="scss" scopde>
.wm-select-item {
    display: inline-block;
    padding: 0 10px;
    line-height: 1.5;
    &:hover {
        cursor: pointer;
    }
    &-selected {
        color: #2d8cf0;
    }
}
</style>
