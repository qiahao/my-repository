<script>
import { Cascader } from 'iview'
import provinces from './provincesThree'
const _opts = { 'change-on-select': true, 'render-format': label => label.join('-') }
export default {
    name: 'cascaderDiy',
    props: {
        value: {
            type: [String, Array],
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: '请选择城市'
        },
        opts: {
            type: Object,
            default: () => _opts
        }
    },
    data() {
        return {
            provinces: [],
        }
    },
    computed: {
        code() {
            if (typeof(this.value) === 'object') {
                return this.value
            } else {
                if (this.value.length >= 6) {
                    let _code = this.value.split('$')[0]
                    let _codes = _code.match(/\d{2}/g)
                    let _values = _codes.map((c, i) => {
                        return (_code.substr(0, i * 2) + c).padEnd(6, 0)
                    })
                    return _values || []
                } else {
                    return []
                }
            }
        }
    },
    methods: {
        onChange(value, data) {
            let _value = ''
            if (data.length !== 0) {
                _value = value[data.length - 1] + '$' + data.map((item) => { return item.label }).join('-')
            }
            this.$emit('input', _value)
            this.$emit('on-change', _value)
        }
    },
    mounted() {
        setTimeout(() => {
            this.provinces = Object.freeze(provinces)
            // todo 修正 change-on-select = true 问题
            if (this.value) {
                let _initValue = this.value
                this.$emit('input', '')
                this.$nextTick(()=>{this.$emit('input', _initValue) })
            }
        },400)
    },
    activated(){},
    render(h) {
        const _data = {
            on: {
                'on-change': (value, data) => {
                    this.onChange.call(this, value, data)
                }
            },
            props: {
                value: this.code,
                disabled: this.disabled,
                placeholder: this.placeholder,
                data: this.provinces,
                ...Object.assign({}, _opts, this.opts)
            },
            ref: 'provinceCascader'
        }
        return <Cascader { ..._data } > < /Cascader>
    }
}
</script>