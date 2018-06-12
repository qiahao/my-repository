import Vue from 'vue'
import Moment from 'moment'
import * as filters from '@/utils/src/filters.js'

Vue.filter('dateFormat', function (input, type) {
	return Moment(input).format(type)
});
Vue.filter('receiptType', function (input, type) {
	let text
	switch (input) {
		case '1':
			text = '司机带回'
			break
		case '2':
			text = '快递邮寄'
			break
		default:
			text = '直接发放'
	}
	return text
});

Vue.filter('areaFilter', filters.filterSlice)
// function (input) {
// 	if (!input) return ''
// 	let a1 = input.split('-'),
// 		a2 = input.split(' '),
// 		l1 = a1.length,
// 		l2 = a2.length
	
// 	if (l1 == l2 == 1) {
// 			return a1[0]
// 	}else if(l1 == 1){
// 			return a2[l2 - 1]
// 	}else if(l2 == 1){
// 			return a1[l1 - 1]
// 	}
// 	return input
// });

// areaFilter (areaString) {
// 	// 兼容 微信小程序开单出现的的  '福建 福州 台江'
// 	if (!areaString) return ''
// 	let a1 = areaString.split('-'), a2 = areaString.split(' '),l1 = a1.length,l2 = a2.length
	
// 	if (l1 == l2 == 1) {
// 			return a1[0]
// 	}else if(l1 == 1){
// 			return a2[l2 - 1]
// 	}else if(l2 == 1){
// 			return a1[l1 - 1]
// 	}

// 	return areaString
// },