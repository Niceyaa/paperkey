<!--<template>
  <div id="track-map" class="app-container">


  </div>
</template>

<script>
  import {orderTrail} from "../../api/recycleManagement";

  export default {
    data() {
      return {
        orderId:null,
      }
    },
    watch:{
    },
    methods: {
      getList(){
        let prm = {
          "pageNum": 1,
          "pageSize": 30,
          // orderId:this.orderId
          orderId:"1"

        }
        orderTrail(prm).then(res=>{
          let recordList = res.data.result.list[0].trailRecord.recordList
          console.log(333,recordList)
        })
      },
      initMap(){
        let that = this
        this.map = new AMap.Map('track-map', {
          zoom:11,//级别
          center: [116.397428, 39.90923],//中心点坐标
          resizeEnable: true,
          zoom: 12,
        });
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
          that.map.addControl(new AMap.ToolBar())
          that.map.addControl(new AMap.Scale())
        })
        // marker标记
        this.marker = new AMap.Marker({
          position: null
        })
        this.map.add(this.marker);
        // 绘制折线
        this.path = new AMap.Polyline({
          path: null,
          isOutline: false,     //线条是否带描边，默认false
          outlineColor: '#ffeeff',//线条描边颜色，此项仅在isOutline为true时有效，默认：#000000
          borderWeight: 1,    //描边的宽度，默认为1
          strokeColor: "#3366FF", //线条颜色，使用16进制颜色代码赋值。默认值为#006600
          strokeOpacity: 1,   //线条透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
          strokeWeight: 4,    //线条宽度，单位：像素
          // 折线样式还支持 'dashed'
          strokeStyle: "solid",  //线样式，实线:solid，虚线:dashed
          // strokeStyle是dashed时有效
          strokeDasharray: [10, 5],//勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效
          lineJoin: 'round',    //折线拐点的绘制样式，默认值为'miter'尖角，其他可选值：'round'圆角、'bevel'斜角
          lineCap: 'round',   //折线两端线帽的绘制样式，默认值为'butt'无头，其他可选值：'round'圆头、'square'方头
          zIndex: 50,       //折线覆盖物的叠加顺序。默认叠加顺序，先添加的线在底层，后添加的线在上层。通过该属性可调整叠加顺序，使级别较高的折线覆盖物在上层显示默认zIndex：50、
        })
        // 将折线添加至地图实例
        this.map.add(this.path);

        let prm = {
          "pageNum": 1,
          "pageSize": 30,
          // orderId:this.orderId
          orderId:"1"

        }
        orderTrail(prm).then(res=>{
          if (res.data.code === 200){
            let recordList = res.data.result.list[0].trailRecord.recordList
           /* let rest = [
              {longitude: "106.7091771", latitude: "26.6299674"},
              {longitude: "106.7091881", latitude: "26.62990674"},
              {longitude: "106.7091893", latitude: "26.6290674"},
              {longitude: "106.7091999", latitude: "26.6297774"},
              {longitude: "106.7191771", latitude: "26.62999674"},
              {longitude: "106.7291771", latitude: "26.63990674"},
              {longitude: "106.7391771", latitude: "26.64990674"},
              {longitude: "106.7491771", latitude: "26.65990674"},
              {longitude: "106.7591771", latitude: "26.61990674"},
              {longitude: "106.771771", latitude: "26.88990674"},
              {longitude: "106.7891771", latitude: "26.62943674"},
              {longitude: "106.7991771", latitude: "26.6293490674"},
              {longitude: "106.8091771", latitude: "26.62934390674"},
            ]*/
            let trackPath = []
            recordList.forEach((item,index) => {
              trackPath.push(new AMap.LngLat(item.longitude,item.latitude))
            });
            this.path.setPath(trackPath)
            this.path.show()

            // 将最后一条记录添加marker标记
            let lastTrack = new AMap.LngLat(recordList[0].longitude,recordList[0].latitude)
            this.map.setCenter(lastTrack)
            this.marker.setPosition(lastTrack)
            this.marker.show()
          }
        })

      },

    },
    mounted() {
      this.orderId = this.$route.query.orderID

      this.getList();
      this.initMap()
    }
  };
</script>
<style scoped lang="less">
.app-container{
  width: 100%;
  height: calc(100vh - 100px);
}
</style>-->
<template>
  <div id="container" class="app-container">
  </div>
</template>

<script>
  import {orderTrail} from "../../api/recycleManagement";

  export default {
    data() {
      return {
        orderId:null,
      }
    },
    watch:{
    },
    methods: {
      initMap() {
        var map = new AMap.Map('container', {
          zoom: 4
        });
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
          map.addControl(new AMap.ToolBar())
          map.addControl(new AMap.Scale())
        })
        // marker标记
        let marker = new AMap.Marker({
          position: null
        })
        map.add(marker);
        AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (PathSimplifier, $) {

          if (!PathSimplifier.supportCanvas) {
            alert('当前环境不支持 Canvas！');
            return;
          }

          const defaultTrailRenderStyle = {
            renderAllPointsIfNumberBelow: 50,
            pathTolerance: 2,
            keyPointTolerance: 0,
            pathLineStyle: {
              lineWidth: 4,
              strokeStyle: '#F7B538',
              borderWidth: 1,
              borderStyle: '#eeeeee',
              dirArrowStyle: false
            },
            pathLineHoverStyle: {
              lineWidth: 3,
              strokeStyle: 'rgba(204, 63, 88,1)',
              borderWidth: 1,
              borderStyle: '#cccccc',
              dirArrowStyle: false
            },
            pathLineSelectedStyle: {
              lineWidth: 6,
              strokeStyle: '#C11534',
              borderWidth: 1,
              borderStyle: '#cccccc',
              dirArrowStyle: true
            },
            dirArrowStyle: {
              stepSpace: 35,
              strokeStyle: '#ffffff',
              lineWidth: 4
            },
            startPointStyle: {
              radius: 4,
              fillStyle: '#109618',
              lineWidth: 1,
              strokeStyle: '#eeeeee'
            },
            endPointStyle: {
              radius: 4,
              fillStyle: '#dc3912',
              lineWidth: 1,
              strokeStyle: '#eeeeee'
            },
            keyPointStyle: {
              radius: 3,
              fillStyle: 'rgba(8, 126, 196, 1)',
              lineWidth: 1,
              strokeStyle: '#eeeeee'
            },
            keyPointHoverStyle: {
              radius: 4,
              fillStyle: 'rgba(0, 0, 0, 0)',
              lineWidth: 2,
              strokeStyle: '#ffa500'
            },
            keyPointOnSelectedPathLineStyle: {
              radius: 4,
              fillStyle: 'rgba(8, 126, 196, 1)',
              lineWidth: 2,
              strokeStyle: '#eeeeee'
            },
            pathNavigatorStyle: {
              pathLinePassedStyle:{
                lineWidth:4,
                strokeStyle:'#ff7902',
                borderWidth:0
              }
            }
          }

          var pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            //autoSetFitView:false,
            map: map, //所属的地图实例

            getPath: function (pathData, pathIndex) {

              return pathData.path;
            },
            getHoverTitle: function (pathData, pathIndex, pointIndex) {

              if (pointIndex >= 0) {
                //point
                return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
              }

              return pathData.name + '，点数量' + pathData.path.length;
            },
            renderOptions: defaultTrailRenderStyle
          });

          window.pathSimplifierIns = pathSimplifierIns;

          let prm = {
            "pageNum": 1,
            "pageSize": 30,
            // orderId:this.orderId
            orderId:"1"

          }
          orderTrail(prm).then(res=>{
            let recordList = res.data.result.list[0].trailRecord.recordList
            let trailData = []

            let rest = [
              {longitude: "106.7091771", latitude: "26.6299674"},
              {longitude: "106.7091881", latitude: "26.62990674"},
              {longitude: "106.7091893", latitude: "26.6290674"},
              {longitude: "106.7091999", latitude: "26.6297774"},
              {longitude: "106.7191771", latitude: "26.62999674"},
              {longitude: "106.7291771", latitude: "26.63990674"},
              {longitude: "106.7391771", latitude: "26.64990674"},
              {longitude: "106.7491771", latitude: "26.65990674"},
              {longitude: "106.7591771", latitude: "26.61990674"},
              {longitude: "106.771771", latitude: "26.88990674"},
              {longitude: "106.7891771", latitude: "26.62943674"},
              {longitude: "106.7991771", latitude: "26.6293490674"},
              {longitude: "106.8091771", latitude: "26.62934390674"},
            ]

            rest.forEach(item=>{
              trailData.push([item.longitude,item.latitude])
            })
            console.log(333,trailData)

            //设置数据
            pathSimplifierIns.setData([{
              name: '运输路线',
              /* path: [
                 [116.405289, 39.904987],
                 [113.964458, 40.54664],
                 [111.47836, 41.135964],
                 [108.949297, 41.670904],
                 [106.380111, 42.149509],
                 [103.774185, 42.56996],
                 [101.135432, 42.930601],
                 [98.46826, 43.229964],
                 [95.777529, 43.466798],
                 [93.068486, 43.64009],
                 [90.34669, 43.749086],
                 [87.61792, 43.793308]
               ]*/
              path:trailData
            }]);

            //对第一条线路（即索引 0）创建一个巡航器
            var navg1 = pathSimplifierIns.createPathNavigator(0, {
              loop: false, //循环播放
              speed: 70000 //巡航速度，单位千米/小时
            });

            navg1.start();
          })


        });
      }
    },
    mounted() {
      this.orderId = this.$route.query.orderID
      console.log(this.orderId)
      this.initMap()
    }
  }
</script>
<style scoped lang="less">
  .app-container{
    width: 100%;
    height: calc(100vh - 100px);
    box-sizing: border-box;
    padding: 10px;
  }
</style>
