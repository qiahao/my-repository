
## 套打直接引用./src/print-order-cover.js 内的方法，由lodop直接打印

```
import {printOrderCover} from '@/common/print-lodop'

export default {
  data () {
    return {
      order
    }
  },
  methods: {
    handlerPrint () {
      printOrderCover(order)
    }
  }
}

```

## 货签打印引用./components/print-tag, 以组件使用，确认打印份数

```
import printTag from '@/common/print-lodop/components/print-tag'

export default {
  data () {
    return {
      order
    }
  },
  components: {
    printTag
  },
  methods: {
   
  }
}

```

## 装车清单打印引用./components/print-trip, 以组件使用，传入要打印的车次信息，已经要打印的运单，在组件内生成html打印

```
import printTrip from '@/common/print-lodop/components/print-trip'

export default {
  data () {
    return {
      order
    }
  },
  components: {
    printTrip
  },
  methods: {
   
  }
}

```
