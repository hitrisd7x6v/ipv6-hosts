/*系统模块相关配置*/
import router from "@/router";
import {getMenus, getDict} from "@/api";
import {registerMenusRoutes} from '@/router'
import {reactive} from "vue";

// component: Index必须和首页组件的name一致
const index = {id: -1, name: '首页', url: '/', component: 'main', closable: false}
const KeepAliveMaps = {'Index': index};

// 动态菜单生成路由
function importLocale(path, menu) {
    return () => import('../../views/' + path + '/index.vue').then(item => {
        // 获取组件名称 用来处理组件缓存(KeepAlive)
        // 注意：每个组件的名称都不能重复, 否则会导致KeepAlive缓存清除失败
        let componentName = item['default'].name;
        menu['component'] = componentName;

        let existsMenu = KeepAliveMaps[componentName];
        if(existsMenu) {
            console.error(`菜单[${menu.name}]和[${existsMenu.name}]组件名称都是[${componentName}], 会导致KeepAlive组件缓存失效`)
        } else {
            KeepAliveMaps[componentName] = menu;
        }
        return item;
    })
}
function resolveMenusBreadcrumb(menus) {
    if(menus instanceof Array) {
        return menus.map(({name, id, url}) => {return {name, id, url}})
    }
}
// 解析菜单映射
function resolverMenuMaps(menus) {
    let urlMenuMap = {}, idMenuMap = {};
    let doResolverMenuMaps = (menus) => {
        for(let i=0; i < menus.length; i++) {
            let menu = menus[i];
            idMenuMap[menu.id] = menu;
            if (menu['type'] === 'V') {
                urlMenuMap[menu.url] = menu;
            } else if (menu['children']) {
                doResolverMenuMaps(menu['children'])
            }
        }
    }

    doResolverMenuMaps(menus)
    return {urlMenuMap, idMenuMap};
}

function resolverMenuToRoutes(urlMenuMaps) {
    return Object.values(urlMenuMaps).map(menu => {
        let {url, name} = menu;
        // 如果以'/'开头
        let split = url.split('/').filter(item => item != '');
        let path = split.join('/');

        return {path, component: importLocale(path, menu), meta: {active: true}}
    })
}

const registerSysModule = function (store) {
    store.registerModule('sys', {
        namespaced: true,
        state: {
            user: {}, // 当前登录的用户
            views: [], // 视图信息
            init: false, // 系统是否已经初始化(菜单初始化, 用于动态路由404问题)
            openKeys: [], // 当前展开的子菜单key
            activeMenu: {}, // 当前激活的菜单
            activeView: {}, // 当前激活的视图
            taskBarData: [index], // 任务栏打开的菜单
            optionsMaps: {}, // url | dict -> {options, valueLabelMap}
            idMenuMaps: {}, // id和菜单的映射
            selectedKeys: [], // 选中的菜单
            urlMenuMaps: {'/': index}, // url -> menu 对象
            optionsInfo: {/*dict -> data | url -> data*/}, // 字典和url的数据信息
            pidBreadcrumbMaps: {}, // pid和面包屑菜单列表映射

        },
        getters: {
            // 标识菜单是否已经初始化完成
            init: state => state.init,
            user: state => state.user,
            views: state => state.views,
            openKeys: state => state.openKeys,

            // url -> menu 映射
            urlMenuMaps: state => state.urlMenuMaps,
            // 当前激活的视图
            activityView: state => state.activeView,
            // 当前激活的菜单
            activityMenu: state => state.activeMenu,
            // 任务栏打开的任务列表
            taskBarData: state => state.taskBarData,
            // 选中的菜单
            selectedKeys: state => state.selectedKeys,
            //系统菜单
            menus: state => state.activeView['children'],
            // 解析面包屑路径
            resolverBreadcrumb: state => {
                let activeMenu = state.activeMenu;
                let activeView = state.activeView;

                let view = {name: activeView.name, id: activeView.id}
                let menu = {name: activeMenu.name, url: activeMenu.url, id: activeMenu.id}

                let parent = state.idMenuMaps[activeMenu.pid];
                if(parent != activeView) {
                    let children = resolveMenusBreadcrumb(parent.children);
                    let menus = {id: parent.id, name: parent.name, children, type: '8'}
                    return [view, menus, menu]
                } else {
                    return [view, {type: 'empty'}, menu]
                }
            },
            getOptionsByUrl: state => {
                return url => []
            },

            getValueLabelMap: state => {
              return key =>  state.optionsMaps[key].valueLabelMap;
            },

            getOptionsByDictType: (state) => {
                return dictType => {
                    let dictData = reactive([]);
                    let options = state.optionsMaps[dictType];
                    if(!options) { // 说明字典数据还不存在, 先缓存
                        state.optionsMaps[dictType] = {options: dictData, valueLabelMap: {}};

                        getDict(dictType).then((options) => {
                            dictData.push(...options)
                        })
                    }

                    return state.optionsMaps[dictType].options
                }
            }
        },
        mutations: {
            // 在任务栏上面打开一个任务
            openUrlOrSwitchTask: (state, url) => {
                let menu = state.urlMenuMaps[url];
                let exists = state.taskBarData.filter(item => menu == item);
                if(exists.length > 0) {
                    store.commit('sys/switchActiveMenuTo', url);
                } else {
                    store.commit('sys/putMenuToTaskBars', menu);
                    store.commit('sys/switchActiveMenuTo', url);
                }
            },
            // 在任务栏上面打开一个任务, 并展开此任务菜单的父菜单
            openUrlTaskAndMenu: (state, url) => {
                let menu = state.urlMenuMaps[url];
                let parent = state.idMenuMaps[menu.pid];
                if(parent) {
                    store.commit('sys/openUrlOrSwitchTask', url);
                    store.commit('sys/switchOpenSubMenuTo', [parent.id]);
                }
            },
            putMenuToTaskBars: (state, menu) => {
                state.taskBarData.push(menu)
            },
            switchActiveMenuTo: (state, url) => {
                let menu = state.urlMenuMaps[url];

                state.activeMenu = menu;
                state.selectedKeys.length = 0;
                state.selectedKeys.push(url);
                router.push(url).then(() => null);
            },
            switchActiveViewTo: (state, view) => {
                state.activeView = view;
            },
            switchOpenSubMenuTo: (state, openKeys) => {
                state.openKeys = openKeys
            },
        },
        actions: {
            initMenus: async ({commit, state}) => {
                await getMenus().then(({data}) => {
                    state.init = true; //
                    state.views = data;
                    state.activeView = state.views[0];
                    let {urlMenuMap, idMenuMap} = resolverMenuMaps(data);
                    state.idMenuMaps = idMenuMap;

                    Object.assign(state.urlMenuMaps, urlMenuMap);
                    let routes = resolverMenuToRoutes(state.urlMenuMaps);
                    registerMenusRoutes(routes)
                })
            },

        }
    })
}

export default registerSysModule;
