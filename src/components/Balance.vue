<template>
  <div class="container">
    <div class="row">
      <div class="col-md-2 col-xs-2 yin-date-prev">
        <a @click="goToDate(prevDate.format('YYYY-MM-DD'))"><i class="glyphicon glyphicon-chevron-left"></i></a>
      </div>
      <div class="col-md-8 col-xs-8 yin-date">
        {{date.format('YYYY-MM-DD')}}
      </div>
      <div class="col-md-2 col-xs-2 yin-date-next">
        <a :disabled="nextDate.isAfter(today, 'day')" @click="goToDate(nextDate.format('YYYY-MM-DD'))"><i class="glyphicon glyphicon-chevron-right"></i></a>
      </div>
    </div>
    <div class="row">
      <div class="yin-balance-income">{{balance.cash_income}}</div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
var Config = require('../config')
var YinApi = require('../lib/17yinApi')
var api = new YinApi(Config.API_ROOT)
var cookie = require('../lib/cookie')
import moment from 'moment'
export default {
  data () {
    let date = moment(this.$route.params.date)
    return {
      balance: {},
      date: date,
      prevDate: moment(this.$route.params.date).add(-1, 'day'),
      nextDate: moment(this.$route.params.date).add(1, 'day'),
      today: moment()
    }
  },
  route: {
    data: function (transition) {
      console.log(1)
      let date = moment(this.$route.params.date)
      console.log(date)
      return {
        balance: {},
        date: date,
        prevDate: moment(this.$route.params.date).add(-1, 'day'),
        nextDate: moment(this.$route.params.date).add(1, 'day')
      }
    }
  },
  created: function () {
    this.getBalance()
  },
  watch: {
    'date': function (date) {
      this.getBalance()
    }
  },
  methods: {
    goToDate: function (date) {
      this.$router.go({
        name: 'balance',
        params: {
          date: date
        }
      })
    },
    getBalance: function () {
      let _this = this
      let token = cookie.readCookie('token')
      api.getBalance(token, _this.date.format('YYYY-MM-DD')).then(function (res) {
        _this.balance = res.data.data
        console.log(res.data.data)
      })
    }
  }
}
</script>
<style>
.yin-date, .yin-date-prev, .yin-date-next {text-align: center;font-size: 2em;padding-top: 20px}
.yin-date {font-size: 2em}
.yin-balance-income {margin-top: 20px; font-size: 5em;font-weight: bold;text-align: center}
</style>
