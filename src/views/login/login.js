import Vue from 'vue'
import '@/utils' // 基础类库
import './login.css'
import "core-js/stable";
import "regenerator-runtime/runtime";
import '@/utils/icon.utils'
import Login from './login.vue'

new Vue({
  el: '#login',
  components: { Login },
  template: '<Login />'
})
