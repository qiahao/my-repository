const table = {
    data () {
        return {
            tableParams: {
                list: [],
                selectList: [],
                page: 1,
                pageSize: 10,
                total: 0,
                isCheckBoxClick: false, // 点击复选框标示
            },
        }
    },
    watch: {
    },
    computed: {
        hasSelect () {
            return !!this.tableParams.selectList.length
        },
        tableSelectLength () {
            return this.tableParams.selectList.length
        },
        currentPage () {
            return this.tableParams.page
        },
        selectedIds () {
            return this.tableParams.selectList.map(item => {
                return item[this.pk]
            })
        },
    },
    methods: {
        loadList () {
            this.$Message.info('请在页面实例重写loadList')
        },
        onSearch () {
            // 重置
            this.tableParams.page = 1
            this.tableParams.selectList = [] 
            this.loadList()
        },
        // 表单重置
        onReset () {
            if (this.$refs.searchForm) {
                this.$refs.searchForm.resetFields()
                if (this.onRangeChange && typeof (this.onRangeChange) === 'function') {
                    this.rangeTime = []
                    this.onRangeChange([])
                }
            }
        },
        onSelectionChange (selection) {
            this.tableParams.selectList = Object.freeze(selection)
            this.tableParams.isCheckBoxClick = true
        },
        onPageChange (p) {
            this.tableParams.page = p
            this.tableParams.selectList = []
            this.loadList()
        },
        onPageSizeChange (pz) {
            this.tableParams.pageSize = pz
            this.onSearch()
        },
        assignQuery (query) {
            return { page: this.tableParams.page, page_size: this.tableParams.pageSize, ...query }
        },
    }
}


export default table