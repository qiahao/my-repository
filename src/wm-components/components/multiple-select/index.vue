<template>
    <div class="multiple-select" v-clickoutside="hideMenu">
        <div class="multiple-select-label" @click="toggleSelect">
            <slot name="input">
                <span>{{placeholder}}</span>
                <span class="num">{{value.length||0}}</span>
                <Icon type="arrow-down-b"></Icon>
            </slot>
        </div>
        <transition name="slide-up">
            <div class="multiple-select-list" v-show="visible">
                <slot></slot>
                <i-button @click.stop="clear" type="primary" size="small" v-show="clearable&&this.value.length">清空</i-button>
            </div>
        </transition>
    </div>
</template>
<script>
import clickoutside from '@/directives/clickoutside'
import Emitter from '@/mixins/emitter';
export default {
    name: 'multipleSelect',
    data() {
        return {
            visible: false
        }
    },
    props: {
        value: {
            type: Array,
            default: [],
        },
        placeholder: {
            type: String,
            defalult: ''
        },
        clearable: {
            type: Boolean,
            default: false
        }
    },
    components: {
    },
    mixins: [Emitter],
    directives: { clickoutside },
    mounted() {
        this.$on('on-multiple-selected', (value) => {
            if (this.value.includes(value)) {
                this.value.splice(this.value.indexOf(value), 1)
            } else {
                this.value.push(value)
            }
            this.broadcast('on-query-change', this.value.includes(value));
        })
    },
    methods: {
        toggleSelect() {
            this.visible = !this.visible
        },
        hideMenu() {
            this.visible = false
        },
        clear() {
            this.$emit('input', [])
        }
    }
}
</script>
<style lang="scss" scoped>
.multiple-select {
    position: relative;
    &-label {
        height: 34px;
        line-height: 34px;
        border-radius: 4px;
        border: 1px solid #dddee1;
        padding: 0 10px;
        .num {
            display: inline-block;
            width: 16px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            border-radius: 50%;
            border: 1px solid rgba(45, 140, 240, 0.9);
            font-style: normal;
        }
    }
    &-list {
        width: 230px;
        background: #fff;
        position: absolute;
        left: 0;
        top: 34px;
        max-height: 200px;
        overflow: auto;
        padding: 5px 0;
        background-color: #fff;
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        position: absolute;
        z-index: 900;
    }
}
</style>
