import Vue from 'vue'
// import App from './App'
import Login from './components/Login'
import Orders from './components/Orders'
import VueRouter from 'vue-router'
import Resource from 'vue-resource'
import cookie from './lib/cookie'
import MenuBar from './components/MenuBar'
import SideBar from './components/Sidebar'
import Map from './components/Map'
import TasksList from './components/TasksList'
import TasksMap from './components/TasksMap'
import History from './components/History'
import Balance from './components/Balance'
import jquery from 'jquery'
Vue.use(Resource)
Vue.use(VueRouter)

Vue.http.options.root = 'http://localhost:3000/api/v1/'

/* eslint-disable no-new */

var router = new VueRouter()

router.map({
  '/login': {
    name: 'login',
    component: Login,
    title: '登录'
  },
  '/orders': {
    name: 'orders',
    component: Orders,
    title: '待送订单'
  },
  '/map/:merchant': {
    name: 'map',
    component: Map,
    title: '地图'
  },
  '/tasks/list': {
    name: 'tasksList',
    component: TasksList,
    title: '门店列表 - 列表'
  },
  '/tasks/map': {
    name: 'tasksMap',
    component: TasksMap,
    title: '门店列表 - 地图'
  },
  '/history': {
    name: 'history',
    component: History,
    title: '配送历史'
  },
  '/balance/:date': {
    name: 'balance',
    component: Balance,
    title: '对账'
  }
})

router.redirect({
  '*': '/orders'
})

let auth_required_routes = ['/orders', '/account', '/history', '/balance']

router.beforeEach(function ({ to, next }) {
  let current_user = cookie.readCookie('user')
  let token = cookie.readCookie('token')
  if (!!current_user && !!token) {
    Vue.http.headers.common['Authorization'] = 'Basic ' + token
  }
  for (let route of auth_required_routes) {
    let reg = new RegExp(route)
    if (reg.test(to.path) && !current_user) {
      console.log('redirect to login')
      router.go('login')
      break
    }
  }
  next()
})

router.afterEach(function (transition) {
})

var App = Vue.extend({
  // template: '<div v-component="side-bar"></div><div id="page-content-wrapper"><div v-component="MenuBar" v-ref="menuBar"></div><router-view></router-view></div>',
  // el: '#wrapper',
  props: ['currentUser'],
  data: function () {
    return {
      pageTitle: '17yin',
      token: undefined
    }
  },
  components: {
    MenuBar: MenuBar,
    SideBar: SideBar,
    Login: Login
  },
  created: function () {
    let current_user = cookie.readCookie('user')
    // let token = cookie.readCookie('token')
    if (current_user) {
      this.currentUser = JSON.parse(current_user)
    }
  },
  methods: {
    closeSidebar: function () {
      jquery('#wrapper').toggleClass('toggled')
    }
  },
  events: {
    'user-login': function (user) {
      this.$broadcast('user-login', user)
    },
    'user-logout': function () {
      this.$broadcast('user-logout')
      router.go('login')
    }
  }
})
router.start(App, '#wrapper')
