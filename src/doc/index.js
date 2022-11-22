import 'vite-plugin-vuedoc/style.css'
import {defineComponent} from "vue";
import Doc from '@/doc/index.vue'
import TableDoc from '@/doc/table.doc.md'
import store from "@/store";
import router from "@/router";

import DP from './demo.md'
store.commit('sys/addNewMenu', {url: '/doc/table', name: '表组件'})
router.addRoute("Main", {path: 'doc', component: Doc, name: '文档', children: [
        {path: 'table', component: DP}
    ]
})
export const Demo = defineComponent({
    name: 'Demo',
    components: {DP},
    template: `
        <DP></DP>
    `
})

export default {

}