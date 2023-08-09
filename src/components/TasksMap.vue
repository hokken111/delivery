<template>
<p style="margin: 0;padding: 8px; color: #337ab7"><span class="pull-right"><i class="glyphicon glyphicon-th-list"></i> <a v-link="{name: 'tasksList'}">列表显示</a></span></p>
<div style="clear: both"></div>
<div class="map">
  <div id="map"><div>
</div>
</template>
<script>
import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

export default {
  data: function () {
    return {
      bdmap: null
    }
  },
  ready () {
    if (window.BMap) {
      window.initMap()
    } else {
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'http://api.map.baidu.com/api?v=2.0&ak=jscginsPhRMiZeZUQwIkW6WD&callback=initMap'
      window.document.body.appendChild(script)
    }
    var _this = this
    window.initMap = function () {
      let BMap = window.BMap
      let map = new BMap.Map('map')
      // map.centerAndZoom(new BMap.Point(116.417854, 39.921988), 15)
      _this.bdmap = map
      let points = store.state.tasks.map(function (task) {
        let point = new BMap.Point(task.merchant.coordinate.lng, task.merchant.coordinate.lat)
        let marker = new BMap.Marker(point)

        let infoWindow = new BMap.InfoWindow(task.merchant.address, {
          width: 80,
          height: 30,
          title: `${task.merchant.name}, ${task.orders.length}单, ${task.payment}元`
        })

        marker.addEventListener('click', function (e) {
          _this.bdmap.openInfoWindow(infoWindow, point)
        })

        _this.bdmap.addOverlay(marker)
        return point
      })
      // 当前位置
      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() === window.BMAP_STATUS_SUCCESS) {
          let icon = new BMap.Icon('http://api0.map.bdimg.com/images/geolocation-control/point/position-icon-14x14.png', new BMap.Size(14, 14))
          let myPositionMaker = new BMap.Marker(r.point, {icon: icon})
          map.addOverlay(myPositionMaker)
          myPositionMaker.setAnimation(window.BMAP_ANIMATION_DROP)

          points.push(r.point)
          _this.bdmap.setViewport(points)
        } else {
          console.log('getCurrentPosition error')
          _this.bdmap.setViewport(points)
        }
      }, {enableHighAccuracy: true})

    }
    // window.scrollTo(0, 0)
  },
  computed: {
    tasks () {
      return store.state.tasks
    }
  },
  methods: {
  }
}
</script>

<style>
.map, #map {width: 100%; height: 100%;}
</style>
