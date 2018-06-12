import Vue from 'vue'

let bus = new Vue({ name: 'eventBus' })

let _on = bus.$on
let _emit = bus.$emit

bus.$on = function(eventName, params) {
	if (bus._events[eventName]) {bus.$off(eventName) }
    _on.apply(bus, arguments)
}

bus.$emit = function (eventName, params){
	_emit.apply(bus, arguments)
}

module.exports = bus