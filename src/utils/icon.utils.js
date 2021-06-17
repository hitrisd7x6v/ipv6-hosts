import Vue from 'vue'
import {Icon} from 'ant-design-vue'
import Global from '../components/global.config'

let iconUrl = Global.iconUrl
const IvzIcon = Icon.createFromIconfontCN({
    scriptUrl: iconUrl,
    extraCommonProps: {
        style: {fontSize: '17px'}
    }
})
Vue.component('IvzIcon', IvzIcon)
