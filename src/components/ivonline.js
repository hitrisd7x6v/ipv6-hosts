import "core-js/stable";
import "regenerator-runtime/runtime";
import '@/components/ivonline.css' // 导入全局样式

import '@/components/online/preview.data'

import IvzOnline from '@/components/online/IvzOnline.vue'

import '@/components/ivzone'


/* 注册组件 */
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.component(IvzOnline.name, IvzOnline)
}

export default {
    install (Vue) {
        Vue.component(IvzOnline.name, IvzOnline)
    }
}
