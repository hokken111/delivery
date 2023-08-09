<template>
<modal :show.sync="showModal">
<h3 slot="header">订单处理</h3>
<div slot="body">
  <order-process-form :order.sync="order" :opt-type="optType"></order-process-form>
</div>
<div slot="footer"></div>
</modal>
<div class="yin-order" v-bind:class="{'yin-order-finished': order.workflow_state == 'finished', 'yin-order-normal': order.workflow_state != 'finished'}">
  <p class="yin-order-title" v-if="order.merchant" style='color: #1b809e!important'>{{order.merchant.name}}</p>
  <p class="yin-order-title">{{order.product_name}}</span> <span class="yin-order-price pull-right">{{order.price}}</span></p>
  <p>{{order.id}}
    <span class="yin-order-state yin-order-state-finished pull-right" v-if="order.workflow_state == 'deadline'"><i class="glyphicon glyphicon-tasks"></i> 印刷中</span>
    <span class="yin-order-state yin-order-state-finished pull-right" v-if="order.workflow_state == 'finished'"><i class="glyphicon glyphicon-ok-circle"></i> 已完成</span>
    <span class="yin-order-state yin-order-state-ship pull-right" v-if="order.workflow_state == 'ready_to_ship'"><i class="glyphicon glyphicon-export"></i> 出库中</span>
    <span class="yin-order-state yin-order-state-ship pull-right" v-if="order.workflow_state == 'delay_to_ship'"><i class="glyphicon glyphicon-warning-sign"></i> 出库中(延迟)</span>
    <span class="yin-order-state yin-order-state-ship pull-right" v-if="order.workflow_state == 'shipping'"><i class="glyphicon glyphicon-send"></i> 配送中</span>
  </p>
  <div class="row nomargin">
    <div class="col-md-12 col-xs-12 nopadding yin-order-content">
      <p v-for="desc in order.description_list">
        {{$key}} : {{desc}}
      </p>
    </div>
  </div>
  <div class="row nomargin">
    <div class="col-md-12 col-xs-12 nopadding" style="text-align: right; margin-bottom: 8px;">
      <button v-if="order.workflow_state =='ready_to_ship' || order.workflow_state =='delay_to_ship'" class="btn btn-primary" type="button" @click="processOrder(order.id, 'ship')"><i class="glyphicon glyphicon-send"></i> 配送中</button>
      <button v-if="order.workflow_state =='ready_to_ship' || order.workflow_state =='delay_to_ship'" class="btn btn-danger" type="button" @click="openModal('not_arrived')"><i class="glyphicon glyphicon-alert"></i> 未能接货</button>
      <button :disabled="processing" v-if="order.workflow_state =='shipping'" class="btn btn-success" type="button" @click="processOrder(order.id, 'finish')"><i class="glyphicon glyphicon-ok"></i> 配送完成</button>
      <button :disabled="processing" v-if="order.workflow_state =='shipping'" class="btn btn-warning" type="button" @click="openModal('finish-with-exception')"><i class="glyphicon glyphicon-exclamation-sign"></i> 配送异常</button>
    </div>
  </div>
  <div v-if="order.trace_logs.length > 0" class="row nomargin">
    <div class="col-md-12 col-xs-12 nopadding">
      <accordion>
        <panel header="操作历史" :is-open="false">
          <ul class="yin-order-trace-logs">
            <li v-for="(index, log) in order.trace_logs">[{{log.created_at.substring(5, log.created_at.length)}}] {{log.operator}} {{log.content}} {{log.extra&&log.extra.message}}</li>
          </ul>
        </panel>
      </accordion>
    </div>
  </div>
  <p v-if="order.memo" class="yin-order-memo">
    {{order.memo}}
  </p>
</div>
</template>

<script>
var Config = require('../config')
var YinApi = require('../lib/17yinApi')
var api = new YinApi(Config.API_ROOT)
var cookie = require('../lib/cookie')
var swal = require('sweetalert')
var Modal = require('./Modal')
var OrderProcessForm = require('./OrderProcessForm')
// var store = require('../store')
// import Vue from 'vue'
// import Vuex from 'vuex'
// Vue.use(Vuex)
import { accordion, panel } from 'vue-strap'

export default {
  components: {
    OrderProcessForm: OrderProcessForm,
    Modal: Modal,
    accordion: accordion,
    panel: panel
  },
  data: function () {
    return {
      processing: false
    }
  },
  created: function () {
    this.showModal = false
  },
  props: {
    order: {
      required: true,
      twoWay: true
    },
    showModal: {
      type: Boolean
    },
    currentOrder: {},
    optType: {}
  },
  methods: {
    processOrder: function (id, action) {
      let _this = this
      swal({
        title: '操作提醒',
        text: '是否确认进行此操作？',
        type: 'warning',
        confirmButtonText: '确认',
        showCancelButton: true,
        cancelButtonText: '取消'
      }, function () {
        let token = cookie.readCookie('token')
        // _this.$parent.deleteOrder(_this.order)
        _this.processing = true

        api.processOrder(id, action, token).then(function (res) {
          _this.order = res.data.data
          // 完成订单从列表中删除
          if (_this.order.workflow_state === 'finished') {
            _this.$parent.deleteOrder(_this.order)
          }
          _this.processing = false
        }, function (res) {
          console.log(res)
          _this.processing = false
        })
      })
    },
    openModal: function (optType) {
      this.optType = optType
      this.showModal = true
    }
  }
}
</script>
<style>
  .yin-order {
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #eee;
    border-top-width: 2px;
  }
  .yin-order-finished {
    border-top-color: #eee;
    color: #ccc;
  }

  .yin-order-normal {
    border-top-color: #1b809e;
  }
  .yin-order-title {font-size: 1.2em;}

  .yin-order-normal .yin-order-title {color: #1b809e;}
  .yin-order-normal .yin-order-product-name: {font-weight: bold; font-size: 1.2em;}
  .yin-order-memo {color: red;}
  .yin-order-content p {margin: 0 0 4px; color: #666;}

  .yin-order-state.yin-order-state-finished {color: green;}
  .yin-order-state.yin-order-state-ship {color: green;}

  .yin-order-finished .yin-order-content p {color: #ccc;}
  /*override panel style*/
  .panel-title>.small, .panel-title>.small>a, .panel-title>a, .panel-title>small, .panel-title>small>a {
    display: inline-block;
    width: 100%;
    text-decoration: none;
  }
  .panel-body {padding: 2px 0;}
  .panel-heading {padding: 4px 4px;}
  .panel-title {color: #999;}
  .panel-group {margin-bottom: 0;}
  .yin-order-trace-logs {list-style: none; padding: 0; margin: 0;}
  .yin-order-trace-logs li {min-height: 24px; line-height: 24px; padding-left: 4px; border-bottom: 1px solid #eee;}
  .yin-order-trace-logs li:last-child {border-bottom: none;}


</style>
