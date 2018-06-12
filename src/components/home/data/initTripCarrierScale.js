export let initTripCarrierScale = {

    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    grid: {
        top:'0',
        left: '0%',
        right: '2%',
        bottom: '2%',
        containLabel: true
    },
    legend: {
        orient: 'vertical',
        right: '0',
        top:'180',
        data: ['外协车辆','自有车辆']
    },
    series : [
        {
            type: 'pie',
            radius : '55%',
            center: ['40%', '50%'],
            data:[
                {
                    value:335, 
                    name:'外协车辆',
                    itemStyle: {
           
                        normal:{
                            color:'#0071c0'
                        }
                    }
                },
                {
                    value:310, 
                    name:'自有车辆',
                    itemStyle: {
           
                        normal:{
                            color:'#13ce66'
                        }
                    }
                },
            ],
        }
    ]
}