import 'vite-plugin-vuedoc/style.css'
import Doc from '@/doc/index.vue'
import router from "@/router";
import BasicView from "@/doc/basic.doc.md";

router.addRoute("Main", {path: 'doc', component: Doc, name: '文档教程', meta: {keepAlive: 'Doc'}, children: [
        {path: 'basic', component: BasicView}
    ]
})

export default {

}