/* 加载第三方类库, 注：Vue、antd、axios等组件库不会被打包而是采用umd方式引用 */
// Vue框架
import Vue from 'vue'
// antd主ui库 url：https://vue.ant.design/docs/vue/introduce-cn/
import Antd from 'ant-design-vue'
import 'ant-design-vue/lib/style'
import Qs from 'qs'
import Http from './http.utils'
import Utils from './basic.utils' // 工具库
import Logger from './logger.utils' // 日志库
import Message from './message.utils' // 消息库
import Global from '../components/global.config' // 全局配置

Vue.config.productionTip = false;

/* 如果是开发环境必须安装antd组件库 */
if (process.env.NODE_ENV === 'development') {
  Vue.use(Antd)
} else {
  /* 生产环境antd组件库使用cdn引入 */
}

let izCtx = Global.izCtx || '';
let izStx = Global.izStx || process.env.NODE_ENV === 'production' ? izCtx : '';

/* 挂载一些常用的参数到Vue原型 */
Vue.prototype.izCtx = izCtx
Vue.prototype.izStx = izStx

Vue.prototype.$log = Logger
Vue.prototype.$msg = Message
Vue.prototype.$utils = Utils

Vue.prototype.$qs = Qs
Vue.prototype.$http = Http
Vue.prototype.isArray = Utils.isArray
Vue.prototype.isBlank = Utils.isBlank
Vue.prototype.isObject = Utils.isObject
Vue.prototype.isNotBlank = Utils.isNotBlank
