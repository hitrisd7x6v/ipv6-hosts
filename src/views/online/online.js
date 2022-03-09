import "core-js/stable";
import "regenerator-runtime/runtime";
import '@/utils' // 基础类库
import Vue from 'vue'
import './online.css'
import '@/utils/icon.utils'
import Online from './online.vue'
import vdr from 'vue-draggable-resizable-gorkys'

// 导入默认样式
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css'
Vue.component('vdr', vdr)

new Vue({
    render: h => h(Online)
}).$mount("#online");
