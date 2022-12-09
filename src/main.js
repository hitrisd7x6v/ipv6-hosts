import {createApp} from 'vue'
import App from './App.vue'
import store from "@/store";
import Router from './router'
import EventBus from '@/event'
import {http} from "@/utils/request"
import '@/doc' // 文档教程 不需要请注释掉
import '@/api/mock' // 非数据模拟环境请注释
import IvzComponents from '@/components'
import Antd, {message, notification} from 'ant-design-vue'
import {createFromIconfontCN} from '@ant-design/icons-vue';

// 项目中使用到的图标
const IvzIcon = createFromIconfontCN({
    extraCommonProps: {style: {fontSize: '16px'}},
    // https://www.iconfont.cn/
    scriptUrl: '//at.alicdn.com/t/font_1174643_moy3ilu84wm.js',
});


// 开发环境需要导入的库文件
if(import.meta.env.DEV) {
    import('ant-design-vue/dist/antd.css')
}

let app = createApp(App).use(Router).use(Antd).use(store).use(EventBus)
.use(IvzComponents).component("ivz-icon", IvzIcon);

app.config.globalProperties.ivzStx=''
app.config.globalProperties.ivzCtx=''
app.config.globalProperties.$http = http
app.config.globalProperties.$msg = message
app.config.globalProperties.$notify = notification

app.mount('#app')
