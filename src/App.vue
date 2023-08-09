<template>
  <div id="app">
    <img class="logo" src="./assets/logo.png">
    <login></login>
  </div>
</template>

<script>
import jquery from 'jquery'
import Login from './components/login'

export default {
  components: {
    Login,
    jquery
  }
}
</script>

<style>
</style>
