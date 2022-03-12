import "core-js/stable";
import "regenerator-runtime/runtime";
import '@/utils' // 基础类库
import '@/components/online/preview.data'
import Vue from 'vue'
import './online.css'
import Ivzone from '@/components/ivzone'
import '@/utils/icon.utils'
import Online from './online.vue'

Vue.use(Ivzone);

new Vue({
    render: h => h(Online)
}).$mount("#online");
