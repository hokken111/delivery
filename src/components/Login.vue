<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 col-xs-12">
        <div class="yin-logo">
          <img class="logo" src="../assets/logo.png">
        </div>
        <validator name="validation">
          <form autocomplete="off">
            <input type="" style="display:none"/>
            <div class="input-group input-group-lg">
              <span class="input-group-addon" id="sizing-addon1"><i class="glyphicon glyphicon-phone"></i></span>
              <input type="text" v-model="mobile" v-validate:mobile="{ mobile: true}" class="form-control" placeholder="手机号码" aria-describedby="sizing-addon1">
            </div>
            <p class="errmsg-container">
              <span class="errmsg" v-if="!$validation.mobile.pristine && $validation.mobile.mobile">请输入有效的手机号码</span>
            </p>

            <div class="input-group input-group-lg">
              <span class="input-group-addon" id="sizing-addon1"><i class="glyphicon glyphicon-lock"></i></span>
              <input type="password" v-model="password" id="password" v-validate:password="{required: true}" class="form-control" placeholder="密码" aria-describedby="sizing-addon1">
            </div>
            <p class="errmsg-container">
              <span class="errmsg" v-if="!$validation.password.pristine && $validation.password.required">请输入密码</span>
            </p>
            <div class="input-group input-group-lg" style="width: 100%">
              <button class="btn btn-lg btn-success btn-login" v-on:click="login" :disabled="!$validation.valid">登录</button>
            </div>
          </form>
        </validator>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import resource from 'vue-resource'
import validator from 'vue-validator'
import cookie from '../lib/cookie'
import swal from 'sweetalert'
Vue.use(resource)
Vue.use(validator)

var Base64 = require('base-64')
var YinApi = require('../lib/17yinApi')
var Config = require('../config')
var api = new YinApi(Config.API_ROOT)

Vue.validator('mobile', function (val) {
  return /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/.test(val)
})

export default {
  components: {
    Base64: Base64
  },
  data () {
    return {
      mobile: '',
      password: '',
      dis: false
    }
  },
  created: function () {
  },
  methods: {
    login: function () {
      let token = Base64.encode(this.mobile + ':' + this.password)
      let authority = {
        deliveryman: true
      }
      var _this = this
      api.login(token).then(
        function (res) {
          let user = res.data.data
          if (user && authority[user.state]) {
            cookie.createCookie('token', token, 7)
            cookie.createCookie('user', JSON.stringify(res.data.data), 7)
            _this.$route.router.go('orders')
            // 派发事件，用户已登录
            _this.$dispatch('user-login', res.data.data)
          } else {
            swal({
              title: '提示',
              text: 'sorry，您暂时没有访问权限',
              type: 'warning'
            })
          }
        },
        function (res) {
          swal({
            title: '提示',
            text: '登录失败，请确认您的手机号码和密码是否正确',
            type: 'warning'
          })
        }
      )
    }
  }
}
</script>

<style>
  @import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
  @import '../../node_modules/sweetalert/dist/sweetalert.css';
  .btn-login {width: 100%;}
  .errmsg-container {height: 24px; line-height: 24px;}
  .errmsg-container .errmsg {color: #a94442;}
  .yin-logo {text-align: center; margin-top: 60px; margin-bottom: 40px;}
  .yin-logo .logo {width: 130px; height: 52px;margin: 0 auto; }
</style>
