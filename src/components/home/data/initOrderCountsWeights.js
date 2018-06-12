export let initOrderCountsWeights = {
    color: ['#13ce66', '#20a0ff'],
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:[{name:'运单(单)',textStyle:{}},{name:'重量(吨)',textStyle:{}},],
        top:'0'
    },
    grid: {
        top:'60',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一','周二','周三','周四','周五','周六','周日']
    },
    yAxis: {
        type: 'value',
        splitLine:{  
        　　　　show:true  
        　　}  
    },
    series: [
        {
            name:'运单(单)',
            type:'line',
            smooth: true,
            lineStyle:{
                normal:{
                    color:'#13ce66'
                }
            },
            data:(function (){
                var res = [];
                var len = 7;
                while (len--) {
                    res.push(Math.round(Math.random() * 1000));
                }
                return res;
            })()
        },
        {
            name:'重量(吨)',
            type:'line',
            lineStyle:{
                normal:{
                    color:'#20a0ff'
                }
            },
            smooth: true,
            data:(function (){
                var res = [];
                var len = 0;
                while (len < 7) {
                    res.push((Math.random()*10 + 5).toFixed(1) - 0);
                    len++;
                }
                return res;
            })()
        }
    ]
}