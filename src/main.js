import {createApp} from 'vue'
import App from './App.vue'
import store from "@/store";
import Router from './router'
import {http} from '@/utils'
import '@/api/mock' // 数据模拟, 正式环境请注释掉
// import IvzOnline from 'ivz-online'
import IvzComponents from '@/components'
import Antd,{message, notification} from 'ant-design-vue'
import {createFromIconfontCN} from '@ant-design/icons-vue';

// 项目中使用到的图标
const IvzIcon = createFromIconfontCN({
    extraCommonProps: {},
    scriptUrl: '//at.alicdn.com/t/font_1174643_bl1frm7ekx6.js', // 在 iconfont.cn 上生成
});


// 开发环境需要导入的库文件
if(import.meta.env.DEV) {
    import('ant-design-vue/dist/antd.css')
}

let app = createApp(App).use(Router).use(Antd).use(store)
.use(IvzComponents).component("ivz-icon", IvzIcon);


app.config.globalProperties.ivzStx=''
app.config.globalProperties.ivzCtx=''
app.config.globalProperties.$http = http
app.config.globalProperties.$msg = message
app.config.globalProperties.$notify = notification

app.mount('#app')
