import "core-js/stable";
import "regenerator-runtime/runtime";
import '@/utils' // 基础类库
import Vue from 'vue'
import './login.css'
import '@/utils/icon.utils'
import Login from './login.vue'

new Vue({
  render: h => h(Login)
}).$mount("#login");
