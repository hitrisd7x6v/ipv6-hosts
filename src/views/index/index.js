import Vue from 'vue'
import './index.css'
import '@/utils'
import "core-js/stable";
import "regenerator-runtime/runtime";
import Index from './index.vue'
import '@/utils/icon.utils'
import CacheApi from '@/utils/cache.utils'

window.CacheApi = CacheApi // 将缓存挂载到window对象, 子页面需要用到, 详情见：Page.utils.js

/* 以下是开发环境用来做数据模拟 */
if (process.env.NODE_ENV === 'development') {
    const Mock = require("mockjs")
    const spec = [
        {label: '颜色', value: '0'}, {label: '重量', value: '1'}
    ]
    Mock.setup({ timeout: '100-300' })
    /* 获取字典数据 */
    Mock.mock(RegExp('/core/dictData/listByType.*'), 'get', (options) => {
        // let query = Utils.getUrlParam(options.url)
        return Mock.mock({
            code: 200,
            message: '获取成功',
            data: {
                rows: spec
            }
        })
    })
    /* 获取菜单 */
    Mock.mock(RegExp('/resources'), 'get', (options) => {
        // let query = Utils.getUrlParam(options.url)
        return Mock.mock({
            code: 200,
            message: '获取成功',
            data: {
                resources: [
                    {id: 1, name: '组件管理', type: 'M', children: [
                            {id: 11, name: '页级组件', type: 'M', icon: 'iz-icon-page', children: [
                                    {id: 111, name: '基础视图页', icon: 'iz-icon-default', type: 'V', url: '/demo/basicView.html?id=3'},
                                    {id: 112, name: '抽屉视图页', icon: 'iz-icon-drawer', type: 'V', url: '/demo/drawerView.html?type=aa'},
                                    // {id: 113, name: 'ModalView', icon: '', type: 'V', url: '/demo/modalView.html'},
                                    {id: 114, name: '可编辑表页', icon: 'iz-icon-page-edit', type: 'V', url: '/demo/editView.html'},
                                    // {id: 116, name: 'diy视图页', type: 'V', url: '/demo/diyView.html'},
                                    {id: 117, name: 'slot表单视图页', type: 'V', url: '/demo/diyFormView.html'},
                                    {id: 118, name: 'slot表格视图页', type: 'V', url: '/demo/diyTableView.html'},
                                ]
                            },
                            {id: 22, name: '功能组件', type: 'M', icon: '', children: [
                                    {id: 221, name: 'ModalView组件', icon: '', type: 'V', url: '/demo/modalView.html'},
                                    // {id: 222, name: 'SlotFormView组件', type: 'V', url: '/demo/slotFormView.html'}
                                ]},
                        ]
                    }
                ]
            }
        })
    })
    /* 获取系统配置 */
    Mock.mock(RegExp('/env'), 'get', (options) => {
        return Mock.mock({
            code: 200,
            message: '获取成功',
            data: {
                env: {
                    user: {avatar: '#'},
                    config: {
                        work_name: {name: '首页名称', value: '工作台'},
                        sys_name: {name: '系统名称', value: '厦门由创源科技'}
                    },
                    profiles: ['dev']}
            }
        })
    })
} else {
    /* 生产环境antd组件库使用cdn引入 */
}
new Vue({
    render: h => h(Index)
}).$mount("#index");
