<template>
  <div class="mapContainer">
    <div class="container mapHeader" v-if="remarkable">
      <h5>{{merchant.name}}</h5>
      <p>{{merchant.address}}</p>
      <div class="buttonsContainer">
        <button v-if="!marking && merchant.coordinate" class="btn btn-sm btn-success pull-right" v-on:click="startMarking()"><i class="glyphicon glyphicon-pushpin"></i> 重新标注</button>
        <button v-if="!marking && !merchant.coordinate" class="btn btn-sm btn-success pull-right" v-on:click="startMarking()"><i class="glyphicon glyphicon-pushpin"></i> 在地图上标注</button>

        <div v-if="marking">
          <button class="btn btn-sm btn-primary pull-right" v-on:click="updateMerchantLocation()"><i class="glyphicon glyphicon-ok-circle"></i> 保存</button>
          <button class="btn btn-sm btn-warning pull-right" v-on:click="cancelMarking()"><i class="glyphicon glyphicon-ban-circle"></i> 取消</button>
          <span>{{marker.point.lng}}, {{marker.point.lat}}</span>
        </div>
        <div style="clear: both"></div>
      </div>
    </div>

    <div id="map" class="mapBody"><div>
  </div>

</template>
<script>
var store = require('../store')
var swal = require('sweetalert')
var YinApi = require('../lib/17yinApi')
var Config = require('../config.js')
var api = new YinApi(Config.API_ROOT)
var cookie = require('../lib/cookie')
var jquery = require('jquery')

export default {
  data: function () {
    return {
      marker: null,
      marking: false,
      map: null,
      defaultPoint: null,
      myPositionMaker: null,
      infoWindow: null
    }
  },
  computed: {
    merchant () {
      // 支持url中的地址信息，提供给app中的webView使用
      if (typeof store.state.currentMerchant.name === 'undefined') {
        alert('hello')
        store.dispatch('SET_CURRENT_MERCHANT', {
          coordinate: {lng: this.$route.query.lng, lat: this.$route.query.lat},
          name: this.$route.query.name,
          address: '1111'
        })
      }
      console.log(store.state.currentMerchant)
      return store.state.currentMerchant
    },
    remarkable () {
      return typeof store.state.currentMerchant.name !== 'undefined'
    }
  },
  methods: {
    startMarking: function () {
      if (this.map) {
        this.map.clearOverlays()
        this.map.addOverlay(this.marker)
        this.marker.enableDragging()
        this.map.panTo(this.marker.point)

        if (this.myPositionMaker) {
          this.map.addOverlay(this.myPositionMaker)
        }

        swal({
          title: '提示',
          text: '拖动图标以标识门店位置',
          type: 'info'
        })
        this.marking = true
      }
    },
    cancelMarking: function () {
      if (this.map && this.marker) {
        this.marker.point = this.defaultPoint
        this.marker.disableDragging()

        this.marking = false
        if (this.myPositionMaker) {
          this.map.setViewport([this.myPositionMaker.point, this.marker.point])
        } else {
          this.map.panTo(this.defaultPoint)
        }
        if (this.infoWindow) {
          this.map.openInfoWindow(this.infoWindow, this.marker.point)
        }
      }
    },
    updateMerchantLocation: function () {
      let _this = this
      _this.merchant = _this.merchant || store.state.currentMerchant
      api.updateMerchantLocation({
        merchant: _this.merchant,
        point: _this.marker.point,
        token: cookie.readCookie('token')
      }).then(function (res) {
        if (typeof res.data.data !== 'undefined') {
          swal({
            title: '提示',
            text: '标记成功',
            type: 'success'
          })
        } else {
          alert('保存坐标失败，请稍候再试')
        }
        _this.marker.disableDragging()
        _this.marking = false
        if (_this.infoWindow) {
          _this.map.openInfoWindow(_this.infoWindow, _this.marker.point)
        }
      }, function (res) {
        alert('标记失败')
        _this.marking = false
      })
    }
  },
  created: function () {
    let _this = this
    console.log(this.remarkable)
    if (!this.remarkable) {
      jquery('#sidebar-wrapper').remove()
      jquery('#wrapper').css({position: 'fixed'})
    }
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'http://api.map.baidu.com/api?v=2.0&ak=jscginsPhRMiZeZUQwIkW6WD&callback=initMap'
    window.initMap = function () {
      let BMap = window.BMap
      let map = new BMap.Map('map')
      _this.map = map

      // 当前位置
      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() === window.BMAP_STATUS_SUCCESS) {
          var icon = new BMap.Icon('http://api0.map.bdimg.com/images/geolocation-control/point/position-icon-14x14.png', new BMap.Size(14, 14))
          _this.myPositionMaker = new BMap.Marker(r.point, {icon: icon})
          map.addOverlay(_this.myPositionMaker)
          _this.myPositionMaker.setAnimation(window.BMAP_ANIMATION_DROP)

          if (store.state.currentMerchant.coordinate) {
            let _point = new BMap.Point(store.state.currentMerchant.coordinate.lng, store.state.currentMerchant.coordinate.lat)
            map.setViewport([_point, r.point])
          }
        } else {
          console.log('getCurrentPosition error')
        }
      }, {enableHighAccuracy: true})

      // 初始化infoWindow
      let infoWindow = new BMap.InfoWindow(store.state.currentMerchant.address, {
        width: 80,
        height: 30,
        title: store.state.currentMerchant.name
      })
      _this.infoWindow = infoWindow

      // 初始化marker
      if (store.state.currentMerchant.coordinate) {
        let _point = new BMap.Point(store.state.currentMerchant.coordinate.lng, store.state.currentMerchant.coordinate.lat)
        _this.defaultPoint = _point
        _this.marker = new BMap.Marker(_point)
        map.centerAndZoom(_this.marker.point, 18)
        map.addOverlay(_this.marker)
        map.panTo(_this.marker.point)
        map.openInfoWindow(_this.infoWindow, _point)
        // _this.infoWindow = infoWindow
      } else {
        geolocation = new BMap.Geolocation()
        geolocation.getCurrentPosition(function (r) {
          if (this.getStatus() === window.BMAP_STATUS_SUCCESS) {
            _this.marker = new BMap.Marker(r.point)
            _this.defaultPoint = r.point
            map.centerAndZoom(_this.marker.point, 18)
            map.addOverlay(_this.marker)
            map.panTo(_this.marker.point)
          } else {
            console.log('getCurrentPosition error')
          }
        }, {enableHighAccuracy: true})
      }

      // 添加导航控件
      // var navigationControl = new BMap.NavigationControl({
      //   anchor: window.BMAP_ANCHOR_TOP_LEFT,
      //   type: window.BMAP_NAVIGATION_CONTROL_LARGE,
      //   enableGeolocation: true
      // })
      // map.addControl(navigationControl)

      // 添加定位控件
      var geolocationControl = new BMap.GeolocationControl()
      geolocationControl.addEventListener('locationSuccess', function (e) {
        _this.myPositionMaker.point = e.point
        _this.map.setViewport([e.point, _this.marker.point])
      })
      map.addControl(geolocationControl)
    }
    window.document.body.appendChild(script)
    window.scrollTo(0, 0)
  }
}
</script>

<style>
.buttonsContainer {margin-bottom: 4px;}
.mapContainer {height: 100%; width: 100%; position: relative;}
.mapContainer .mapHeader {position: absolute; top: 0; min-height: 80px; overflow-y: auto;z-index: 997; background-color: rgba(255, 255, 255, 0.8); width: 100%;}
.mapContainer .mapBody {width: 100%; height: 100%; position: absolute; }
.BMap_noprint.anchorBL {bottom: 56px!important;}
</style>
