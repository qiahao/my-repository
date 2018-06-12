export let initOrderStateScale = {
    title: {
        text: ''
    },
    tooltip: {},
    grid: {
        top:'10',
        left: '3%',
        right: '3%',
        bottom: '0%',
        containLabel: true
    },
    yAxis : [
        {
            data : ['已签收','运输中','未发车']
        }
    ],
    xAxis: {
        splitLine: {show: false}
    },
    animationDurationUpdate: 1200,
    series : [
        {
            type: 'bar',
            barWidth: '30',
            data:[
                {
                    value:0, 
                    name:'已签收',
                    itemStyle: {
                        normal:{
                            color:'#0071c0'
                        }
                    }
                },
                {
                    value:0, 
                    name:'运输中',
                    itemStyle: {
                        normal:{
                            color:'#13ce66'
                        }
                    }
                },
                {
                    value:0, 
                    name:'未发车',
                    itemStyle: {
                        normal:{
                            color:'#ff8686'
                        }
                    }
                },
            ],
        }
    ],
};