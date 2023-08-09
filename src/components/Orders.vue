<template>
  <div class="container">
    <div v-if="loading" class="yin-on-tasks">
      <i class="glyphicon glyphicon-repeat"></i> 加载中，请稍候
    </div>
    <div v-if="!loading && (tasks.length == 0 || !tasks)" class="yin-on-tasks">
      <i class="glyphicon glyphicon-thumbs-up"></i> 暂无订单，休息一会吧
    </div>
    <div v-for="task in tasks" class="yin-task-wrapper">
      <div style="border-bottom: 1px solid #eee">
        <p class="yin-merchant-title">
          <span class="yin-merchant-name"><span style="color:#22a1c4">{{task.merchant.fake_name}}</span>-{{task.merchant.name}}</span>
          <a href="tel:{{task.merchant.mobile}}"><i class="glyphicon glyphicon-phone"></i>{{task.merchant.mobile}}</a>
          <span class="pull-right">
            <span class="yin-merchant-payment">{{task.orders.length}}单, {{task.payment}}元</span>
          </span>
        </p>
        <p>
          <!-- <a v-link="{name: 'map', params: { merchant: task.merchant.id }}"><i class="glyphicon glyphicon-map-marker"></i> {{task.merchant.address}}</a> -->
          <a @click='openMap(task.merchant)'>
            <i v-if="task.merchant.coordinate" class="glyphicon glyphicon-map-marker"></i><i style="color: #d9534f !important" v-if="!task.merchant.coordinate" class="glyphicon glyphicon-question-sign"></i> {{task.merchant.address}}
          </a>
          <button class="pull-right btn btn-xs btn-info" @click="toggleOrderList($event)">展开</button>
        </p>
    </div>
      <div class="yin-order-list yin-order-list-closed">
        <order v-if="order.workflow_state !== 'finished'" v-for="order in task.orders" :order.sync="order"></order>
      </div>
    </div>

  </div>
</template>

<script>
import Order from './Order'
var YinApi = require('../lib/17yinApi')
var Config = require('../config.js')
var api = new YinApi(Config.API_ROOT)
import cookie from '../lib/cookie'
import Vue from 'vue'
import resource from 'vue-resource'
var store = require('../store')
var $ = require('jquery')
Vue.use(resource)
export default {
  components: {
    order: Order
  },
  data () {
    return {
      summary: {},
      tasks: [],
      loading: false
    }
  },
  computed: {
    totalPayment () {

    }
  },
  ready () {
    let token = cookie.readCookie('token')
    let _this = this
    _this.loading = true
    api.getTasks(token).then(
      function (res) {
        _this.summary = res.data.data.summary
        _this.tasks = res.data.data.tasks
        store.state.tasks = res.data.data.tasks
        _this.loading = false
      },
      function (res) {
        console.log('error')
        _this.loading = false
      }
    )
  },
  methods: {
    openMap: function (merchant) {
      store.dispatch('SET_CURRENT_MERCHANT', merchant)
      this.$route.router.go({
        name: 'map',
        params: { merchant: merchant.id }
      })
    },
    deleteOrder: function (order) {
      store.dispatch('DELET_ORDER', order)
      this.tasks = store.state.tasks
    },
    toggleOrderList: function (e) {
      $(e.target).parent().parent().parent().find('.yin-order-list').toggleClass('yin-order-list-closed')
      e.target.innerText = e.target.innerText === '展开' ? '收起' : '展开'
      // $('.yin-order-list').toggleClass('yin-order-list-closed')
    }
  }
}
</script>

<style>
.yin-merchant-title {height: 40px; line-height: 40px;}
.yin-merchant-title .yin-merchant-name {font-weight: bold; font-size: 1.4em;}
.yin-merchant-payment {font-size: 1.4em; color: #1b809e;}
.yin-on-tasks {font-size: 1.2em; color: #ccc; text-align: center; margin-top: 20px;}
.yin-order-list-closed {
  height: 0; overflow: hidden;
  -webkit-transition: all 1s ease-in;
  -moz-transition: all 1s ease-in;
  -o-transition: all 1s ease-in;
  transition: all 1s ease-in;
}
.yin-order-list {
  -webkit-transition: all 1s ease-in;
  -moz-transition: all 1s ease-in;
  -o-transition: all 1s ease-in;
  transition: all 1s ease-in;
}
/*.yin-order-list-open {height: auto}*/
</style>
