export let initTripSends = {
    color: ['#3398DB'],
    legend: {
        data:[{name:'发车次数',textStyle:{}}],
        top:'0'
    },
    tooltip : {
        trigger: 'axis',
    },
    grid: {
        top:'60',
        left: '2%',
        right: '2%',
        bottom: '2%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
                alignWithLabel: true
            },
            splitLine:{  
        　　　　show:true  
        　　}  
        }
    ],
    yAxis : [
        {
            type : 'value',
            splitLine:{  
        　　　　show:true  
        　　}  
        }
    ],
    series : [
        {
            name:'发车次数',
            type:'bar',
            barWidth: '40%',
            barGap :'100%',
            data:[10, 52, 200, 334, 390, 330, 220]
        }
    ]
}