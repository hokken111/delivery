var Vue = require('vue')
Vue.use(require('vue-resource'))
var Yin17Api = function (url) {
  this.auth = {mobile: undefined, password: undefined}
  this.apiRootUrl = undefined
  this.apiRootUrl = url ? url : 'http://yin17.com/api/v1/'
}

Yin17Api.prototype.login = function (token) {
  Vue.http.headers.common.Authorization = 'Basic ' + token
  return Vue.http.get(this.apiRootUrl + 'login')
}

Yin17Api.prototype.getTasks = function (token) {
  Vue.http.headers.common.Authorization = 'Basic ' + token
  return Vue.http.get(this.apiRootUrl + 'deliveryman/orders?t=' + (new Date()).getTime())
}

Yin17Api.prototype.getHistory = function (token) {
  Vue.http.headers.common.Authorization = 'Basic ' + token
  return Vue.http.get(this.apiRootUrl + 'deliveryman/orders/history?per=10000')
}

Yin17Api.prototype.getBalance = function (token, date) {
  Vue.http.headers.common.Authorization = 'Basic ' + token
  return Vue.http.get(this.apiRootUrl + `deliveryman/cashflow/balance?date=${date}`)
}

Yin17Api.prototype.processOrder = function (orderid, action, token, memo) {
  var url = `deliveryman/orders/${orderid}/procedure/${action}`
  Vue.http.headers.common.Authorization = 'Basic ' + token
  return Vue.http.post(this.apiRootUrl + url, {
    extra: memo ? memo : ''
  })
}

Yin17Api.prototype.updateMerchantLocation = function (params) {
  var url = `users/${params.merchant.id}/coordinate`
  Vue.http.headers.common.Authorization = 'Basic ' + params.token
  return Vue.http.post(this.apiRootUrl + url, {
    lng: params.point.lng,
    lat: params.point.lat,
    provider: 'baidu',
    axis: 'bd09ll'
  })
}

module.exports = Yin17Api
