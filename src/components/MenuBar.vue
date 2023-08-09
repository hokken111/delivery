<template>
  <div style="padding-top: 15px; z-index:1998">
    <div class="row yin-menubar nomargin">
      <div class="col-md-12 col-xs-12 nopadding">
        <p><i v-if="showMenuButton" @click="toggleMenu()" class="glyphicon glyphicon-menu-hamburger"></i><span class="yin-page-title">{{$route.title}}</span></p>
      </div>
    </div>
  </div>

</template>
<script>
  var $ = require('jquery')
  var cookie = require('../lib/cookie')
  export default {
    data: function () {
      return {
        showMenuButton: false
      }
    },
    created: function () {
      let current_user = cookie.readCookie('user')
      this.showMenuButton = !!current_user // typeof current_user === 'undefined' ? false : true
    },
    methods: {
      toggleMenu: function () {
        $('#wrapper').toggleClass('toggled')
      }
    },
    events: {
      'user-login': function (user) {
        this.showMenuButton = true
      },
      'user-logout': function (user) {
        this.showMenuButton = false
      }
    }
  }
</script>
<style>
  .yin-menubar {border-bottom: 1px solid #eee; padding:0 8px;}
  .yin-page-title {margin-left: 1em; line-height: 20px; height: 20px;}
</style>
