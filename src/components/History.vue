<template>
  <div class="container">
    <div v-if="loading" class="yin-on-tasks">
      <i class="glyphicon glyphicon-repeat"></i> 加载中，请稍候
    </div>
    <div v-if="!loading && (tasks.length == 0 || !tasks)" class="yin-on-tasks">
      <i class="glyphicon glyphicon-thumbs-up"></i> 暂无历史订单
    </div>
    <order v-for="order in tasks" :order.sync="order"></order>
</div>
</template>
<script>
var YinApi = require('../lib/17yinApi')
var Config = require('../config.js')
var api = new YinApi(Config.API_ROOT)
import cookie from '../lib/cookie'
import Vue from 'vue'
import resource from 'vue-resource'
import Order from './Order'
// var store = require('../store')
Vue.use(resource)
export default {
  components: {
    order: Order
  },
  data () {
    return {
      tasks: [],
      loading: false
    }
  },
  created () {
    let token = cookie.readCookie('token')
    let _this = this
    _this.loading = true
    api.getHistory(token).then(function (res) {
      _this.tasks = res.data.data.tasks
      _this.loading = false
    }, function (res) {
      console.log('loading history error')
      this.loading = false
    })
  }
}
</script>
