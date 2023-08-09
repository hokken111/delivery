import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  currentMerchant: {},
  tasks: []
}

const actions = {
  setCurrentMerchant: 'SET_CURRENT_MERCHANT',
  setTasks: 'SET_TASKS',
  deleteOrder: 'DELET_ORDER'
}

const mutations = {
  'SET_CURRENT_MERCHANT' (state, merchant) {
    state.currentMerchant = merchant
  },
  'SET_TASKS' (state, tasks) {
    state.tasks = tasks
  },
  'DELET_ORDER' (state, order) {
    state.tasks = state.tasks.filter(function (task) {
      let payment = 0
      let _orders = task.orders.filter(function (o) {
        if (o.id !== order.id) {
          payment += parseFloat(o.price.replace('元', ''))
        }
        return o.id !== order.id
      })
      task.orders = _orders
      task.payment = payment
      return task.orders.length > 0
    })
  },
  'CLEAR' (state) {
    state.currentMerchant = {}
    state.tasks = []
  }
}

module.exports = new Vuex.Store({
  state,
  mutations,
  actions
})
