import '@/utils'
import Vue from 'vue'
import Index from './403.vue'
import Antd from "ant-design-vue";
import Utils from '@/utils/basic.utils' // 工具库
/* 如果是开发环境必须安装antd组件库 */
if (process.env.NODE_ENV === 'development') {
    Vue.use(Antd)
} else {
    /* 生产环境antd组件库使用cdn引入 */
}
new Vue({
    render: h => h(Index)
}).$mount("#index");
