const Vehicle = () => import('@/components/vehicle/list') // 车辆
const VehicleDetail = () => import('@/components/vehicle/detail/vehicle-detail.vue') // 车辆详情
const VehicleAdd = () => import('@/components/vehicle/detail/vehicle-add.vue') // 车辆新增

const Site = () => import('@/components/system/v1/site')
const SiteDetail = () => import('@/components/system/v1/site/detail')
const SiteNew = () => import('@/components/system/v1/site/new')
const Ship = () => import('@/components/system/v1/shipList')
const ShipChild = () => import('@/components/system/v1/shipChildList')
const Company = () => import('@/components/system/v1/company')
const Staff = () => import('@/components/system/v2/staff')
const Menu = () => import('@/components/system/v2/menu')
const Catalog = () => import('@/components/system/v2/catalog')
const Role = () => import('@/components/system/v2/role')
const Dept = () => import('@/components/system/v2/dept')



export default [
	{
		path: '/vehicle/v1',
		name: 'vehicleV1List',
		component: Vehicle,
		children: [
			{
				path: '/vehicle/detail/:id',
				name: 'vehicleDetail',
				component: VehicleDetail
			},
			{
				path: '/vehicle/add',
				name: 'vehicleAdd',
				component: VehicleAdd 
			}
		]
	},
	{
		path: '/site/v1',
		name: 'siteV1List',
		component: Site,
		children: [
			{
				path: 'detail/:id',
				name: 'siteV1Detail',
				component: SiteDetail
			},
			{
				path: 'new',
				name: 'siteV1New',
				component: SiteNew
			}
		]
	},
	{
		path: '/ship/v1',
		name: 'systemV1Ship',
		component: Ship
	},
	{
		path: '/ship/v1/child/:id',
		name: 'shipV1Child',
		component: ShipChild
	},
	{
		path: '/company/v1',
		name: 'companyV1List',
		component: Company
	},
	{
		path: '/print/setting',
		name: 'printSettin',
		title: '打印设置',
		component: r => require(['@/components/system/print-setting/index.vue'],r)
	},
	{
		path: '/staff/v2',
		name: 'staffV1List',
		component: Staff
	},
	{
		path: '/menu/v2',
		name: 'menuList',
		component: Menu
	},
	{
		path: '/catalog/v2',
		name: 'catalogList',
		component: Catalog
	},
	{
		path: '/role/v2',
		name: 'roleList',
		component: Role
	},
	{
		path: '/dept/v2',
		name: 'deptList',
		component: Dept
	}
]