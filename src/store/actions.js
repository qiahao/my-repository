import router from '@/router';
import * as types from './mutation-types.js';
import * as localStorageMng from '@/utils/local-storage-mng'
import api from '@/api';

export default {
	login: ({ commit }, user) => {
		return api.userApi.login(user).then((data) => {
			let _user = data.resultObj
			// 存储用户信息 到store
			commit(types.setUserInfo, _user)
			// 存储用户信息
			localStorageMng.setUserInfo(_user)
		})
	},
	logout: ({ commit }) => {
		return new Promise((resolve, reject) => {
			commit(types.setUserInfo)
			commit(types.setPageMenu)
			commit(types.setFuncMenu)
			if (localStorageMng.hasLocalStorage) localStorageMng.clearUserInfo()
			// 重定到登陆 设置登录后重定向路径
			router.push({
				name: 'login',
				params: { redirect: router.currentRoute.fullPath }
			})
			resolve()
		})
	},
	getTruckTypes: ({ commit, state }) => {
		return new Promise((resolve, reject) => {
			if (!state.truckTypes || !state.truckTypes.length) {
				api.dictApi.dictTruckTypeApi().then((data) => {
					commit(types.setTruckTypes, data.resultObj)
					resolve(data.resultObj)
				}).catch((e) => { reject() })
			} else {
				resolve(state.truckTypes)
			}
		})
	},
	getTruckLengths: ({ commit, state }) => {
		return new Promise((resolve, reject) => {
			if (!state.truckLengths || !state.truckLengths.length) {
				api.dictApi.dictTruckLengthApi().then((data) => {
					commit(types.setTruckLengths, data.resultObj)
					resolve(data.resultObj)
				}).catch((e) => { reject() })
			} else {
				resolve(state.truckLengths)
			}
		})
	},
	getCargoPacks: ({ commit, state }) => {
		return new Promise((resolve, reject) => {
			if (!state.cargoPacks || !state.cargoPacks.length) {
				api.dictApi.dictCargoPackApi().then((data) => {
					commit(types.setCargoPacks, data.resultObj)
					resolve(data.resultObj)
				}).catch((e) => { reject() })
			} else {
				resolve(state.cargoPacks)
			}
		})
	},
}