export function filterSlice (input) {
	if (!input) return ''
	let a1 = input.split('-'),
		a2 = input.split(' '),
		l1 = a1.length,
		l2 = a2.length
	
	if (l1 == l2 == 1) {
			return a1[0]
	}else if(l1 == 1){
			return a2[l2 - 1]
	}else if(l2 == 1){
			return a1[l1 - 1]
	}
	return input
}