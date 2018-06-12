#### 库存管理、订单跟踪事件说明

1. bus.$emit('order-list-reload')	： 列表刷新
2. bus.$emit('order-detail-reload')	： 详情刷新
4. bus.$emit('order-detail-close') 	： 关闭详情
3. bus.$emit('operation-reload')	： 操作记录刷新 
4. bus.$emit('exception-reload')	： 异常列表刷新
4. bus.$emit('add-exception')		： 添加异常
