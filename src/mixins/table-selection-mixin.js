/**
 * 使用on-select-change处理 较为麻烦
 * 受 iview 版本限制2.0.0-rc.19 版本才有on-select-cancel事件
 * 
 * 使用场景：左右表格选中穿梭
 */


export default {
    data (){
        return {
            idFlag: 'item_id',
            tableQuery: {
                page_size: 10,
                page: 1,
            },
            tableData: [],
            tableDataTotal: 0,
            tableLeftSelection: [], // 左侧选中
            tableRightSelection: [], // 右侧选中列表,监听tableSelectionTotalMap，其余地方不对tableSelectionTotal进行修改
            tableSelectionTotalMap: {}, // 全部选中Map
            tableSelectionTotalKeys: [], // 保存全部ID
        }
    },
    computed: {
        currentPage () {
            return this.tableQuery.page
        },
    },
    watch: {
        tableSelectionTotalMap: {
            handler (n,o) {
                this.tableRightSelection = Object.values(this.tableSelectionTotalMap)
                this.tableSelectionTotalKeys = Object.keys(this.tableSelectionTotalMap)
            },
            deep: true
        }
    },
    methods: {
        // 左侧列表
        handlerLeftSelectionChange (selection){
            this.tableLeftSelection = this.selectionChange(this.tableLeftSelection,selection)
        },
        // 右侧列表
        handlerRightSelectionChange (selection){
            this.tableLeftSelection = this.tableRightSelection = this.selectionChange(this.tableRightSelection,selection)
        },
        selectionChange(oldSelection,newSelection){
            let oldIds = oldSelection.map(item => item[`${this.idFlag}`]),
                oldLength = oldSelection.length,
                newIds = newSelection.map(item => item[`${this.idFlag}`]),
                newLength = newSelection.length,
                oldSelectionMap = {},
                newSelectionMap = {},
                touchedIds = []
            // 创建{ id: item} map
            oldSelection.forEach(item => oldSelectionMap[item[`${this.idFlag}`]] = item)
            newSelection.forEach(item => newSelectionMap[item[`${this.idFlag}`]] = item)

            // 对比改变前后数组的长短，判断是新增还是移除
            let array1,array2,l1,l2 // l2 长，l1 短
            if (oldLength < newLength) {
                array1 = oldIds
                l1 = oldLength
                array2 = newIds
                l2 = newLength
            }else{
                array1 = newIds
                l1 = newLength
                array2 = oldIds
                l2 = oldLength
            }

            // 确定新增 或者移除对象的id
            for (let i = 0; i < l2; i++) {
                if (!array1.includes(array2[i])) {
                    touchedIds.push(array2[i])
                }
            }
            
            if (oldLength < newLength) {
                // 新增
                touchedIds.forEach(id => {
                    this.addTableSelectionTotalMap(id, newSelectionMap[id])
                })
            }else{
                // 移除
                touchedIds.forEach(id => {
                    this.removeTableSelectionTotalMap(id,oldSelectionMap[id])
                })
            }
            
            return newSelection
        },
        
        handlerPageChange (i) {
            this.tableQuery.page = i
            this.tableSelection = []
            this.loadList()
        },
        handlerPageSizeChange (size) {
            this.tableQuery.page_size = size
            this.tableSelection = []
            this.loadList()
        },
        addTableSelectionTotalMap(key,item){
            if (!key || !item) { return }
            this.tableData.forEach(item => {
                if(item[`${this.idFlag}`] == key){
                    this.$set(item,'_checked',true)
                }
            })
            
            this.$set(item,'_checked',true)
            this.$set(this.tableSelectionTotalMap,key,item)
        },
        removeTableSelectionTotalMap(key,item){
            if (this.tableSelectionTotalMap[key]) {
                this.tableData.forEach(item => {
                    if(item[`${this.idFlag}`] == key){
                        this.$delete(item,'_checked')
                        this.$set(item,'_checked',false)
                    }
                })
                let i = this.tableLeftSelection.indexOf(item)
                this.tableLeftSelection.splice(i,1)
                this.$delete(this.tableSelectionTotalMap,key)
            }
        },
        callBackLoadList(data){
            this.tableDataTotal = data.resultObj.total
            let list = data.resultObj.list
            if (list.length) {
                list.forEach(item => {
                    if (this.tableSelectionTotalMap[item[`${this.idFlag}`]]) {
                        item._checked = true
                        this.tableLeftSelection.push(item)
                    }
                });
            }

            this.tableData = list

        },
        initTableDataCheck (data) {
            // 每次加载都需要验证本次加载的数据是否已经存在选中状态
            // this.tableSelectionTotal
            return data
        },
        assignQuery (query) {
            return Object.assign({}, this.tableQuery,query)
        }
    }
    
}
