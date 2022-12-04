import 'vite-plugin-vuedoc/style.css'
import {defineComponent} from "vue";
import Doc from '@/doc/index.vue'
import TableDoc from '@/doc/table.doc.md'
import store from "@/store";
import router from "@/router";

import BasicView from './basic.doc.md'
store.commit('sys/addNewMenu', {url: '/doc', name: '基础视图'})
router.addRoute("Main", {path: 'doc', component: Doc, name: '文档', children: [
        {path: '', component: BasicView, name: '基础视图'}
    ]
})
export const Demo = defineComponent({
    name: 'Demo',
    components: {BasicView},
    template: `
        <DP></DP>
    `
})

export default {

}