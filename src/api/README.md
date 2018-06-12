api 文件约定说明：
1. 创建API 文件以后端接口功能分类为准，一个功能对应一个API文件；
2. 文件名统一使用 ‘-’ 连接，接口方法名使用驼峰式命名；
3. 接口方法命名尽可能以 'get' 'add' 'delete' 'edit' 表示接口意图，在接口URL处备注api功能

以下为API文件与API分类映射：
buildApi.js 运单开单类 （应整合到运单内）；
common.js   公共或零散API 
companyApi.js 公司资料
dictApi.js 字典
homeApi.js 工作动态
index.js 对外导出文件
insureApi.js 投保
linerAPi.js 承运商管理
preorderApi.js 订单
projectApi.js 项目管理
reciptApi.js 回单
reportApi.js 报表统计
shipApi.js 客户资料 2017.08.19 使用 partner.js (客户管理)
siteApi.js 合作网点
staffApi.js 员工管理
tripApi.js  车次
userApi.js 登录等
vehicleApi.js 车辆
waybill.js 运单 2017.08.19 使用order.js (与后端接口定义关键词统一)
exception.js 运单异常 

// todo 以上文件命名在下版本修改


