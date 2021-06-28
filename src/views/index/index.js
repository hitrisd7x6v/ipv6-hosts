import Vue from 'vue'
import './index.css'
import '@/utils'
import "core-js/stable";
import "regenerator-runtime/runtime";
import Index from './index.vue'
import '@/utils/icon.utils'
import CacheApi from '@/utils/cache.utils'

window.CacheApi = CacheApi // 将缓存挂载到window对象, 子页面需要用到, 详情见：Page.utils.js

/* 以下是开发环境用来做数据模拟 */
if (process.env.NODE_ENV === 'development') {
    require("@/views/demo/data");
} else {
    /* 生产环境antd组件库使用cdn引入 */
}
new Vue({
    render: h => h(Index)
}).$mount("#index");
