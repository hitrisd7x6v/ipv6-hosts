import 'vite-plugin-vuedoc/style.css'
import Doc from '@/doc/index.vue'
import router from "@/router";

router.addRoute("Main", {path: 'doc', component: Doc, name: '文档教程', meta: {keepAlive: 'Doc'}})

export default {

}