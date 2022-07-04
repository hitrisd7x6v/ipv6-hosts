import { createApp } from 'vue'
import App from './App.vue'
import Router from './router'
import {http} from '@/utils'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
import {message, notification} from 'ant-design-vue'

let app = createApp(App).use(Router).use(Antd);

app.config.globalProperties.ivzCtx=''
app.config.globalProperties.ivzStx=''
app.config.globalProperties.$http=http
app.config.globalProperties.$msg = message
app.config.globalProperties.$notify = notification

app.mount('#app')
