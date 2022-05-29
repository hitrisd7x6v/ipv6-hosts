import "core-js/stable";
import "regenerator-runtime/runtime";
import '@/components/ivonline.css' // 导入全局样式

import Vue from 'vue'
import '@/components/online/preview.data'

import IvzOnline from '@/components/online/IvzOnline.vue'

// import Ivzone from "@/components/ivzone";
// Vue.use(Ivzone);

new Vue({
    el: '#online',
    components: {IvzOnline},
    data: {

    },
    methods: {
        saveCallback(config) {
            console.log(config)
        }
    }
});
