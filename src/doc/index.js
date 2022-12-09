import 'vite-plugin-vuedoc/style.css'
import {defineComponent} from "vue";
import Doc from '@/doc/index.vue'
import router from "@/router";

import BasicView from './basic.doc.md'

router.addRoute("Main", {path: 'doc', component: Doc, name: '文档教程', children: [
        {path: 'basic', component: BasicView, name: '基础视图'}
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