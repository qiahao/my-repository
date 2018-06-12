// 2017-11-24 后详情侧拉子组件使用该mixin
// 解决组件、子组件初始化 init()


const detialChild = {
    data (){
        return {
            usedId: '',
            routeName: '',
        }
    },
    computed: {
        id (){
            return this.$route.params.id
        },
    },
    watch: {
        id (n,o){
            if (n && this.$route.name == this.routeName) {
                // 处理路由同名param.id的情况
                // this._inactive不能作为是否为详情路由的依据： 存在子路由时this.inactive = false ，id 也变了， 详情数据不需要加载的情况
                this.usedId = n
            }
        },
        usedId (n,o){
            this.init()
        }
    },
    methods: {
        init (){
            console.warn(`[wran] rewrite < ${this.$options.name} > component’s init function witch with detail-child-mixin`)
        }
    },
    created(){
        // 初始化
        this.usedId = this.id
        this.routeName = this.$route.name
    },
    mounted(){},
    
}

export default detialChild