/**
 * 开单基本信息：项目、客户、托运人、收货人选择；
 */
import { getProjectList } from '@/api/src/projectApi'
import * as constants from './constants.js'

export default {
    data() {
        return {
            util: {
                projectListLoading: false,
                projectListParams: { ...constants.projectListParams },
                projectList: [],
                // 当前选择的项目： 选择项目时赋值为对象，
                curProject: null,
            },
        }
    },
    watch: {
        'order.prj_id': function (n,o) {
            if (n) {
                for (let i = 0, l = this.util.projectList.length; i < l; i++) {
                    if (this.util.projectList[i].prj_id == this.order.prj_id) {
                        this.util.curProject = this.util.projectList[i]
                        break;
                    }
                }
            }else{
                this.util.curProject = null
            }
        }
    },
    methods: {
        // 获取项目列表
        getProjectList(obj = {}) {
            let params = Object.assign({},this.util.projectListParams, obj)
            this.util.projectListLoading = true
            getProjectList(params).then(data => {
                this.util.projectListLoading = false
                this.util.projectList = data.resultObj ? data.resultObj.list : []
            })
        },
        // 关键字获取项目列表
        projectListRemote(query) {
            this.getProjectList({ query_string: query })
        }
    },
    activated (){
    	this.getProjectList()
    }

}