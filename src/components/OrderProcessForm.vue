<template>
  <p>订单编号: {{order.id}}</p>
  <ul class="yin-order-reasons">
    <li v-for="(index, reason) in orderStatus[optType].reasons"><a @click="selectReason(reason, $event)">{{reason}}</a></li>
  </ul>
  <textarea name="reason" style="width:100%" rows="3" v-model="reason"></textarea>
  <p class="pull-right">
    <button type="button" name="button" @click="submitForm(order.id, orderStatus[optType]['option'], reason)" class="btn btn-primary" :disabled="reason == ''"><i class="glyphicon glyphicon-ok-circle"></i> 提交</button>
    <button type="button" name="button" @click="cancel()" class="btn"><i class="glyphicon glyphicon-remove-circle"></i> 取消</button>
  </p>
</template>
<script>
var jquery = require('jquery')
var YinApi = require('../lib/17yinApi')
var Config = require('../config.js')
var cookie = require('../lib/cookie')
var api = new YinApi(Config.API_ROOT)
import Vue from 'vue'
import resource from 'vue-resource'
Vue.use(resource)
export default {
  data: function () {
    return {
      orderStatus: {
        'not_arrived': {
          title: '未能接货',
          reasons: ['物流未送达', '未生产', '其他'],
          option: 'not_arrived'
        },
        'finish-with-exception': {
          title: '配送异常',
          reasons: ['偏色', '印错', '其他'],
          option: 'finish'
        }
      },
      reason: ''
    }
  },
  props: {
    order: {
      required: true,
      twoWay: true
    },
    optType: {
      required: true
    }
  },
  ready: function () {
    // console.log(this.orderStatus, this.optType)
    // this.reason = this.orderStatus[this.optType]['reasons'][0]
  },
  methods: {
    selectReason: function (reason, $event) {
      jquery('.yin-order-reasons li a').removeClass('active')
      jquery($event.target).addClass('active')
      this.reason = reason
    },
    submitForm: function (orderid, action, extra) {
      var _this = this
      let token = cookie.readCookie('token')
      _this.$parent.$parent.processing = true

      api.processOrder(orderid, action, token, extra).then(
        function (res) {
          // TODO: 更科学的更新父组件中order的方式
          _this.$parent.$parent.processing = false
          _this.$parent.$parent.order = res.data.data
          // 删除此订单
          if (res.data.data.workflow_state === 'finished') {
            // console.log(_this.$parent.$parent.$parent)
            _this.$parent.$parent.$parent.deleteOrder(res.data.data)
          }
          _this.cancel()
        },
        function (res) {
          console.log(res)
          _this.$parent.$parent.processing = false
        }
      )
    },
    cancel: function () {
      this.$parent.show = false
    }
  }
}
</script>
<style>
ul.yin-order-reasons {padding: 0; margin: 0 0 10px 0;}
ul.yin-order-reasons ,ul.yin-order-reasons li {list-style: none; float: left}
ul.yin-order-reasons li a {display: inline-block; padding: 2px 8px; color: #999; border-radius: 2px; border: 1px solid #999; margin-left: 4px; text-decoration: none;}
ul.yin-order-reasons li a.active {border: 1px solid #45B6AF; background: #45B6AF; color: #FFF;}
</style>
