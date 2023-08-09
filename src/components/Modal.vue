<template>
  <div class="yin-modal-mask" v-show="show" transition="modal">
    <div class="yin-modal-wrapper">
      <div class="yin-modal-container">

        <div class="yin-modal-header">
          <slot name="header">
            default header
          </slot>
        </div>

        <div class="yin-modal-body">
          <slot name="body">
            default body
          </slot>
        </div>

        <div class="yin-modal-footer">
          <slot name="footer">
            <button class="modal-default-button" @click="show = false">OK</button>
          </slot>
        </div>
        <div style="clear:both"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      twoWay: true
    }
  }
}

</script>
<style>
.yin-modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.yin-modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.yin-modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 10px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}


.yin-modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.yin-modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * the following styles are auto-applied to elements with
 * v-transition="modal" when their visiblity is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter, .modal-leave {
  opacity: 0;
}

.modal-enter .yin-modal-container,
.modal-leave .yin-modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
