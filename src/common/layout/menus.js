const menus = [
    // 常用
    { id: 1003, title: '开单v2', pid: 0, icon: 'menu-billing', path: '/waybill/v2/build' },
    { id: 1004, title: '库存管理', pid: 0, icon: 'menu-billing', path: '/order-store' },
    { id: 5, title: '车次管理', pid: 0, icon: 'menu-train-number2', path: '/trip/v1' },
    { id: 1006, title: '回单管理oms', pid: 0, icon: 'menu-receipt', path: '/receipt/v2' },
    
    { id: 8, title: '系统管理', pid: 0, icon: "menu-system" },
    { id: 810, title: '打印设置', pid: 8, path: '/print/setting' },
    { id: 801, title: '车辆管理', pid: 8, path: '/vehicle/v1' },
    { id: 802, title: '合作网点', pid: 8, path: '/site/v1' },
    { id: 803, title: '客户资料', pid: 8, path: '/ship/v1' },
    { id: 804, title: '公司资料', pid: 8, path: '/company/v1' },
    { id: 805, title: '菜单管理', pid: 8, path: '/menu/v2' },
    { id: 806, title: '企业菜单管理', pid: 8, path: '/catalog/v2' },
    { id: 807, title: '角色管理', pid: 8, path: '/role/v2' },
    { id: 808, title: '部门管理', pid: 8, path: '/dept/v2' },
    { id: 809, title: '员工管理', pid: 8, path: '/staff/v2' },
    
    //报表中心
    { id: 7, title: '报表中心', pid: 0 , icon: 'menu-chart'},
    { id: 7001, title: '报表统计', pid: 7, icon: 'menu-chart', path: '/report/v1' },
    { id: 7002, title: '运单毛利分析表', pid: 7, icon: 'menu-chart', path: '/report/order-profit' },
    { id: 7003, title: '车次毛利分析表', pid: 7, icon: 'menu-chart', path: '/report/vehicle-profit' },

    // 财务模块
    { id: 9, title: '财务管理', pid: 0 },
    { id: 9001, title: '费用核销', pid: 9, path: '/finance/fee'},
    { id: 9002, title: '对账单管理', pid: 9, path: '/finance/bill'},

    { id: 1007, title: '客户账号管理', pid: 0, icon: 'menu-billing', path: '/customerAccount/v2' },
    { id: 1008, title: '成员账号管理', pid: 0, icon: 'menu-billing', path: '/linerAccount/v2' },
    { id: 1009, title: '承运商管理', pid: 0, icon: "menu-system", path: '/liner/v2' },
    { id: 1010, title: '客户管理', pid: 0, icon: "menu-system", path: '/customer/v2' },
    { id: 1011, title: '价格管理', pid: 0, icon: "menu-system", path: '/price/v2' },
    { id: 1012, title: '项目管理', pid: 0, icon: "menu-system", path: '/project/v2' },
    { id: 1, title: '工作动态', pid: 0, icon: 'menu-home', path: '/home' },
    { id: 2, title: '订单', pid: 0, icon: 'menu-order', path: '/preorder/v1' },
    { id: 3, title: '开单', pid: 0, icon: 'menu-billing', path: '/waybill/v1/build' },
    { id: 4, title: '运单', pid: 0, icon: 'menu-train-number', path: '/waybill/v1' },
    { id: 6, title: '回单管理', pid: 0, icon: 'menu-receipt', path: '/receipt/v1' },
    { id: 1013, title: '日常收支', pid: 0, icon: 'menu-receipt', path: '/daily/cashFlow' },

]
const demo = [
    { id: 1000, title: 'demo', pid: 0, icon: "menu-bill" },
    { id: 1100, title: '打印', pid: 1000},
    { id: 1111, title: '装车清单', pid: 1100, path: '/demo/print/trip'},
    // print lodop
    { id: 1112, title: '货签-lodop', pid: 1100, path: '/demo/print/tag-lodop'},
    { id: 1113, title: '套打-lodop', pid: 1100, path: '/demo/print/order-cover-lodop'},
    { id: 1200, title: '测试1', pid: 1000, path: '/demo/test1'},
]

export default [...demo,...menus]

export { 
    menus,
    demo 
}
