import {createApp} from 'vue'
import App from './App.vue'
import Router from './router'
import {http} from '@/utils'
import Antd, {message, notification} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
import {createFromIconfontCN} from '@ant-design/icons-vue';

const IvzIcon = createFromIconfontCN({
    extraCommonProps: {},
    scriptUrl: '//at.alicdn.com/t/font_1174643_8oqzyet5k3d.js', // 在 iconfont.cn 上生成
});

let app = createApp(App).use(Router).use(Antd)
    .component("ivz-icon", IvzIcon);

app.config.globalProperties.ivzStx=''
app.config.globalProperties.ivzCtx=''
app.config.globalProperties.$http = http
app.config.globalProperties.$msg = message
app.config.globalProperties.$notify = notification

app.mount('#app')
