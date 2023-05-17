<template>
 <div>
 <h1 class="home_title">
    <el-button icon="el-icon-arrow-left" @click="getPreYearData"
    >上一年</el-button>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <span>{{year}}</span>
    <span>年学员数量</span>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <el-button icon="el-icon-arrow-right" @click="getNextYearData"
    >下一年</el-button>
 </h1>
 <div id="myChart"></div>
 </div>
</template>

<script>
import studentApi from '@/api/student';
export default {
 data () {
 return {
    year:new Date().getFullYear()
 }
 },

 components: {},
mounted(){
    this.drawChart()
},
 methods: {
    getPreYearData(){
        this.year--
        this.drawChart()
    },
    getNextYearData(){
        this.year++
        this.drawChart()
    },
    drawChart(){
        studentApi.getStudentListForMonth(this.year).then((response)=>{
            const resp = response.data;
            console.log("resp",resp);
            if(resp.status == 0){
                var chartDom = document.getElementById('myChart');
                var myChart = this.$echarts.init(chartDom);
                var option;
                //展示数据
                let dataArr = [0]
                if(resp.data && resp.data.length){
                    resp.data.forEach(item=>{
                        dataArr[item._id -1] = item.count
                    })
                }else{
                    this.$message({
                        message:"当前年份不存在数据",
                        type:'warning'
                    })
                }
                option = {
                    xAxis:{
                        type:"category",
                        data:["01","02","03","04","05","06","07","08","09","10","11","12"]
                    },
                    yAxis:{
                        type:"value"
                    },
                    series:[
                        {
                            data:dataArr,
                            type:'bar'
                        }
                    ]
                };
                option && myChart.setOption(option)
            }
        })
    }
 }
}
</script>

<style scoped>
h1{
    text-align:center
}
#myChart{
    width:100%;
    height:600px;
    margin:100px auto
}
</style>