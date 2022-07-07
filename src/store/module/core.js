/*系统模块相关配置*/
import {getMenus, getDict} from "@/api";
import {registerMenusRoutes} from '@/router'
import {reactive} from "vue";

function importLocale(path, menu) {
    return () => import('../../views/' + path + '/index.vue').then(item => {
        // 获取组件名称 用来处理组件缓存(KeepAlive)
        menu['component'] = item['default'].name;
        return item;
    })
}

// 解析菜单映射
function resolverMenuMaps(menus) {
    let urlMenuMap = {};
    let doResolverMenuMaps = (menus) => {
        for(let i=0; i < menus.length; i++) {
            let menu = menus[i];
            if (menu['type'] === 'V') {
                urlMenuMap[menu.url] = menu;
            } else if (menu['children']) {
                doResolverMenuMaps(menu['children'])
            }
        }

        return urlMenuMap;
    }

    return doResolverMenuMaps(menus);
}

function resolverMenuToRoutes(urlMenuMaps) {
    return Object.values(urlMenuMaps).map(menu => {
        let {url, name} = menu;
        // 如果以'/'开头
        let split = url.split('/').filter(item => item != '');
        let path = split.join('/');

        return {path, component: importLocale(path, menu), meta: menu}
    })
}
const registerSysModule = function (store) {
    store.registerModule('sys', {
        namespaced: true,
        state: {
            views: [], // 视图信息
            init: false, // 系统是否已经初始化(菜单初始化, 用于动态路由404问题)
            activeMenu: {}, // 当前激活的菜单
            activeView: {}, // 当前激活的视图
            taskBarData: [], // 任务栏打开的菜单
            optionsMaps: {}, //
            urlMenuMaps: {/*url -> menu*/}, // url -> menu 对象
            optionsInfo: {/*dict -> data | url -> data*/}, // 字典和url的数据信息

        },
        getters: {
            // 标识菜单是否已经初始化完成
            init: state => state.init,
            views: state => state.views,
            // 返回字典label或者url返回的label {label, value}
            optionsLabel: state => (key, value) => {
                let options = state.optionsMaps[key];
                return '男'
            },
            // url -> menu 映射
            urlMenuMaps: state => state.urlMenuMaps,
            // 当前激活的视图
            activityView: state => state.activeView,
            // 当前激活的菜单
            activityMenu: state => state.activeMenu,
            // 任务栏打开的任务列表
            taskBarData: state => state.taskBarData,
            //系统菜单
            menus: state => state.activeView['children'],
        },
        mutations: {
            putMenuToTaskBars: (state, menu) => {
                state.taskBarData.push(menu)
            },
            switchActiveMenuTo: (state, menu) => {
                state.activeMenu = menu;
            },
            switchActiveViewTo: (state, view) => {
                state.activeView = view;
            }
        },
        actions: {
            initMenus: ({commit, state}) => {
                getMenus().then(({data}) => {
                    state.init = true; //
                    state.views = data;
                    state.activeView = state.views[0];
                    state.urlMenuMaps = resolverMenuMaps(data);
                    let routes = resolverMenuToRoutes(state.urlMenuMaps);
                    registerMenusRoutes(routes)
                })
            },

            getOptionsByDictType: ({state}, dictType) => {
                let dictData = reactive([]);
                let options = state.optionsMaps[dictType];
                if(options) {

                }
                getDict(dictType).then(({data}) => {

                })
                return new Promise(resolve => {
                    resolve(options || dictData)
                })

            }
        }
    })
}

export default registerSysModule;
