<template>
  <!-- Sidebar -->
  <div id="sidebar-wrapper">
    <ul v-show="!currentUser" class="sidebar-nav">
      <li class="sidebar-brand">
        <a v-link="{name: 'login'}">
          <i class="glyphicon glyphicon-log-in"></i> 登录
        </a>
      </li>
    </ul>
    <ul v-show="currentUser" class="sidebar-nav">
      <li class="sidebar-brand">
        <a><i class="glyphicon glyphicon-user"></i> {{currentUser.name}}</span></a>
      </li>
      <li>
        <a v-link="{name: 'orders'}"><i class="glyphicon glyphicon-list"></i> 待送订单</a>
      </li>
      <li>
        <a v-link="{name: 'balance', params: {date: today}}"><i class="glyphicon glyphicon-jpy"></i> 对账</a>
      </li>
      <li>
        <a v-link="{name: 'history'}"><i class="glyphicon glyphicon-calendar"></i> 配送历史</a>
      </li>
      <li>
        <a v-link="{name: 'tasksList'}"><i class="glyphicon glyphicon-certificate"></i> 门店列表</a>
      </li>
      <li>
        <a @click="logout()"><i class="glyphicon glyphicon-log-out"></i> 退出</a>
      </li>
    </ul>
  </div>
  <!-- /#sidebar-wrapper -->

</template>
<script>
  import cookie from '../lib/cookie'
  import jquery from 'jquery'
  import moment from 'moment'
  var store = require('../store')
  // import tools from '../lib/tools'
  export default {
    props: ['currentUser'],
    data: function () {
      return {
        today: moment().format('YYYY-MM-DD')
      }
    },
    created: function () {
      this.currentUser = this.$parent.currentUser
    },
    ready: function () {
      // 菜单点击之后收起
      jquery('.sidebar-nav li a').bind('click', function (e) {
        jquery('#wrapper').toggleClass('toggled')
      })
      // var eles = tools.query('.sidebar-nav li a')
      // eles.forEach(function (ele) {
      //   console.log(ele)
      // })
    },
    methods: {
      bindMenuEvent: function () {

      },
      logout: function () {
        if (confirm('确定退出?')) {
          cookie.eraseCookie('user')
          cookie.eraseCookie('token')
          this.$dispatch('user-logout')
          store.dispatch('CLEAR')
          this.currentUser = undefined
        }
      }
    },
    events: {
      'user-login': function (user) {
        this.currentUser = user
      }
    }
  }
</script>
<style>
  .yin-side-bar-container {position: absolute; background: rgba(0, 0, 0, .4); width: 100%; height: 100%; z-index: 100;}
  .yin-side-bar {background: #FFF; height: 100%; width: 40%; }
</style>
