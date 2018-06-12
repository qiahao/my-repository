export function SearchCache(opt = {limit: 5}) {
    this.orderNumbers = []
    this.limit = opt.limit

}
SearchCache.prototype.updateNumbers = function updateNumbers(num,cb) {
    let i = this.orderNumbers.indexOf(num)
    let item = i != -1 ? this.orderNumbers.splice(i,1)[0] : num
    this.orderNumbers.unshift(item)
    if (this.orderNumbers.length > this.limit) this.orderNumbers.length = this.limit 
    if (typeof cb == 'function') {
    	cb.call(this,arguments)
    }
}