import {GET, POST} from '@/utils/request'

// 获取首页菜单
export function getMenus() {
    return GET("/core/menus")
}
