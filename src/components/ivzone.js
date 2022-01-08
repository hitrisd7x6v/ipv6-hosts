import "core-js/stable";
import "regenerator-runtime/runtime";
import './ivzone.css' // 导入全局样式
import '../utils/icon.utils'
import Page from './page.config' // 导入每个iframe页面独有的库
/* 导入组件 */
import IvzSearchForm from './form/IvzSearchForm'
import IvzSearchModel from "./form/IvzSearchModel";

import IvzEditView from './view/IvzEditView'
import IvzBasicView from './view/IvzBasicView'
import IvzModalView from './view/IvzModalView'
import IvzBasicForm from './form/IvzBasicForm'
import IvzBasicModel from './form/IvzBasicModel'

import IvzDrawerView from './view/IvzDrawerView'
import IvzEditTable from './table/IvzEditTable'

import IvzBasicTable from './table/IvzBasicTable'
import IvzModalForm from './form/IvzModalForm'
import IvzDrawerEditTable from './table/IvzDrawerEditTable'
import IvzDiyView from "@/components/view/IvzDiyView";
import IvzGroupForm from "@/components/form/IvzGroupForm";

/* 注册组件 */
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.prototype.$page = Page
    window.Vue.component(IvzEditTable.name, IvzEditTable)
    window.Vue.component(IvzBasicTable.name, IvzBasicTable)

    window.Vue.component(IvzDiyView.name, IvzDiyView)
    window.Vue.component(IvzEditView.name, IvzEditView)
    window.Vue.component(IvzBasicView.name, IvzBasicView)
    window.Vue.component(IvzModalView.name, IvzModalView)
    window.Vue.component(IvzDrawerView.name, IvzDrawerView)

    window.Vue.component(IvzSearchForm.name, IvzSearchForm)
    window.Vue.component(IvzSearchModel.name, IvzSearchModel)

    window.Vue.component(IvzBasicForm.name, IvzBasicForm)
    window.Vue.component(IvzGroupForm.name, IvzGroupForm)
    window.Vue.component(IvzBasicModel.name, IvzBasicModel)
    window.Vue.component(IvzModalForm.name, IvzModalForm)

    window.Vue.component(IvzDrawerEditTable.name, IvzDrawerEditTable)
}

export default {
    install (Vue) {
        Vue.prototype.$page = Page
        // 表组件
        Vue.component(IvzEditTable.name, IvzEditTable)
        Vue.component(IvzBasicTable.name, IvzBasicTable)

        // 页级组件
        Vue.component(IvzDiyView.name, IvzDiyView)
        Vue.component(IvzBasicView.name, IvzBasicView)
        Vue.component(IvzEditView.name, IvzEditView)
        Vue.component(IvzModalView.name, IvzModalView)
        Vue.component(IvzDrawerView.name, IvzDrawerView)

        // 表单组件
        Vue.component(IvzModalForm.name, IvzModalForm)
        Vue.component(IvzBasicForm.name, IvzBasicForm)
        Vue.component(IvzGroupForm.name, IvzGroupForm)
        Vue.component(IvzBasicModel.name, IvzBasicModel)

        Vue.component(IvzSearchForm.name, IvzSearchForm)
        Vue.component(IvzSearchModel.name, IvzSearchModel)

        // 其他组件
        Vue.component(IvzDrawerEditTable.name, IvzDrawerEditTable)
    }
}
