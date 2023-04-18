/*系统模块相关配置*/
import {getDict, getMenus, getUser} from "@/api";
import {reactive} from "vue";
import {GET} from "@/utils/request";
import router, {resolverMenuToRoutes} from "@/router";
import CoreConsts from "@/components/CoreConsts";

function resolveMenusBreadcrumb(menus) {
    if(menus instanceof Array) {
        return menus.map(({name, id, url}) => {return {name, id, url}})
    }
}
// 解析菜单映射
function resolverMenuMaps(menus) {
    let urlMenuMap = {}, idMenuMap = {}, authMenuMap = {};
    let doResolverMenuMaps = (menus) => {
        for(let i=0; i < menus.length; i++) {
            let menu = menus[i];
            idMenuMap[menu.id] = menu;
            if (menu['type'] === 'V') { // 视图类型
                urlMenuMap[menu.url] = menu;
            } else if(menu['type'] === 'A') { // 权限类型
                if(menu['perms']) { // 通过权限字符串校验权限
                    authMenuMap[menu['perms']] = menu;
                }

                if(menu.url) { // 通过url校验权限
                    authMenuMap[menu.url] = menu;
                }
            }

            if (menu['children']) {
                doResolverMenuMaps(menu['children'])
            }
        }
    }

    doResolverMenuMaps(menus)
    return {urlMenuMap, idMenuMap, authMenuMap};
}

function resolverOptions(data, labelField, valueField, valueLabelMap) {
    data.forEach(item => {
        item['label'] = item[labelField];
        item['value'] = item[valueField];
        valueLabelMap[item['value']] = item['label'];

        if(item.children instanceof Array) {
            resolverOptions(item.children, labelField, valueField, valueLabelMap);
        }
    })
}


const registerSysModule = function (store) {
    store.registerModule('sys', {
        namespaced: true,
        state: {
            user: {}, // 当前登录的用户
            views: [], // 视图信息
            init: false, // 系统路由是否已经初始化(菜单初始化, 用于动态路由404问题)
            userKey: null,
            theme: 'default', // 默认主题
            userVisible: false, // 用户中心

            openKeys: [], // 当前展开的子菜单key
            activeMenu: {}, // 当前激活的菜单
            activeRoute: {}, // 当前激活的路由
            activeView: {}, // 当前激活的视图
            taskBarData: [], // 任务栏打开的菜单
            optionsMaps: {}, // url | dict -> {options, valueLabelMap}
            idMenuMaps: {}, // id和菜单的映射
            selectedKeys: [], // 选中的菜单
            authMenuMap: {}, // perms -> menu 权限
            urlMenuMaps: {}, // url -> menu 对象
            urlRouteMaps: {}, // url -> route taskBarData
            optionsInfo: {/*dict -> data | url -> data*/}, // 字典和url的数据信息
            pidBreadcrumbMaps: {}, // pid和面包屑菜单列表映射
        },
        getters: {
            // 标识菜单是否已经初始化完成
            init: state => state.init,
            user: state => state.user,
            views: state => state.views,
            theme: state => state.theme,
            userKey: state => state.userKey,
            userVisible: state => state.userVisible,

            // 打开的子菜单
            openKeys: state => state.openKeys,

            // url -> menu 映射
            urlMenuMaps: state => state.urlMenuMaps,
            // perms -> menu 映射
            authMenuMap: state => state.authMenuMap,
            // 当前激活的视图
            activityView: state => state.activeView,
            // 当前激活的菜单
            activityMenu: state => state.activeMenu,
            // 当前激活的路由
            activeRoute: state => state.activeRoute,
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
                if(parent && parent != activeView) {
                    let children = resolveMenusBreadcrumb(parent.children);
                    let menus = {id: parent.id, name: parent.name, children, type: '8'}
                    return [view, menus, menu]
                } else {
                    return [view, {type: 'empty'}, menu]
                }
            },

            getOptionsByUrl: state => {
                return (url, labelField, valueField) => {
                    let options = state.optionsMaps[url];
                    if(!options) {
                        let dictData = reactive([]), valueLabelMap = {};
                        state.optionsMaps[url] = {options: dictData, valueLabelMap};

                        GET(url).then(({data}) => {
                            if(data instanceof Array) {
                                resolverOptions(data, labelField, valueField, valueLabelMap)

                                dictData.push(...data)
                                data.forEach(item => {
                                    valueLabelMap[item.value] = item.label;
                                })
                            }
                        })
                    }
                    return state.optionsMaps[url].options
                }
            },

            getValueLabelMap: state => {
              return key =>  state.optionsMaps[key].valueLabelMap;
            },

            getOptionsByDictType: (state) => {
                return (dictType, labelField, valueField) => {
                    let dictData = reactive([]), valueLabelMap = {};
                    let options = state.optionsMaps[dictType];
                    if(!options) { // 说明字典数据还不存在, 先缓存
                        state.optionsMaps[dictType] = {options: dictData, valueLabelMap};

                        getDict(dictType).then((options) => {
                            if(options instanceof Array) {
                                options.forEach(item => {
                                    item['label'] = item[labelField];
                                    item['value'] = item[valueField];
                                })

                                dictData.push(...options)
                                options.forEach(item => {
                                    valueLabelMap[item.value] = item.label;
                                })
                            }
                        })
                    }

                    return state.optionsMaps[dictType].options
                }
            }
        },
        mutations: {
            // 切换主题
            switchTheme(state, theme) {
                state.theme = theme;
            },
            // 任务栏切换
            pushAndSwitchTask: (state, url) => {
                let route = state.urlRouteMaps[url];
                if(route == null) {
                    return console.error(`url[${url}]对应的路由不存在`)
                }

                router.push(route).catch(reason=> {
                    console.error(`切换任务失败(组件不存在或者未注册路由)[${reason}]`)
                });
            },

            // 移除任务栏的任务
            removeTask: (state, url) => {
                let urlRoute = state.urlRouteMaps[url];
                if(urlRoute) {
                    state.urlRouteMaps[url] = null;
                    let number = state.taskBarData.findIndex(route => route.path == url);
                    if(number > -1) {
                        state.taskBarData.splice(number, 1);
                    }
                }
            },
            // 在任务栏上面打开一个任务
            openUrlOrSwitchTask: (state, url) => {
                router.push(url).catch(reason=> {
                    console.error(`打开菜单失败(组件不存在或者未注册路由)`)
                });
            },
            openOrSwitchTask: (state, route) => {
                let path = route.path;
                // 首页(工作台)作为第一个任务
                if(state.taskBarData.length == 0 && route.path != '/') {
                    return router.push('/').then(() => {
                        router.push(route).finally()
                    })
                }

                if(!state.urlRouteMaps[path]) {
                    state.taskBarData.push(route);
                }

                state.activeRoute = route;
                state.urlRouteMaps[path] = route;
                store.commit('sys/switchActiveMenuTo', path)
            },
            setRouteKeepAlive: (state, {url, componentName}) => {
                let urlRoute = state.urlRouteMaps[url];
                if(urlRoute && componentName) {
                    urlRoute.meta['keepAlive'] = componentName;
                }
            },
            switchActiveRouteTo: (state, route) => {
                state.activeRoute = route;
            },
            // 切换激活的菜单
            switchActiveMenuTo: (state, url) => {
                let menu = state.urlMenuMaps[url];

                if(menu) {
                    state.activeMenu = menu;

                    state.selectedKeys.length = 0;
                    state.selectedKeys.push(menu.url);
                } else {
                    state.selectedKeys.length = 0;
                }
            },

            // 在任务栏上面打开一个任务, 并展开此任务菜单的父菜单
            openUrlAndParentMenu: (state, url) => {
                let menu = state.urlMenuMaps[url];
                if(menu) {
                    store.commit('sys/openUrlOrSwitchTask', url);

                    // 打开菜单栏中此url对应的父菜单
                    let parent = state.idMenuMaps[menu.pid];
                    if(parent) {
                        store.commit('sys/switchOpenSubMenuTo', [parent.id]);
                    }
                }

            },

            // 往任务栏中增加新的任务
            addNewMenu: (state, menu) => {
                let taskUrl = menu['url'] != null ? menu['url'] : menu['path'];
                if(taskUrl == null) {
                    return console.warn(`菜单[${menu.name}]未指定url`)
                }

                if(!menu['name'] && import.meta.env.DEV) {
                    console.warn(`未指定任务name[${menu}]`)
                }

                let taskMenu = state.urlMenuMaps[taskUrl];
                if(!taskMenu) {
                    // 是否是侧边栏菜单
                    menu['isMenu'] = menu['isMenu'] || false;

                    state.urlMenuMaps[taskUrl] = menu;
                } else {
                    if(taskMenu.name == menu.name) {
                        console.warn(`此任务名[${menu.name}]已经存在, 任务[${taskMenu}]`)
                    }
                }
            },

            addNewTask: (state, route) => {

            },
            putMenuToTaskBars: (state, menu) => {
                state.taskBarData.push(menu)
            },

            switchActiveViewTo: (state, view) => {
                state.activeView = view;
            },
            switchOpenSubMenuTo: (state, openKeys) => {
                state.openKeys = openKeys
            },
            toggleUserVisible: (state, {visible, key}) => {
                state.userKey = key || state.userKey;
                state.userVisible = visible != null
                    ? visible : state.userVisible;
            },
            /**
             * 注销
             * 清除数据
             * @param state
             */
            logout: (state) => {
                state.init = false;
                state.openKeys = [];
                state.urlMenuMaps = {};
                state.taskBarData = [];
                state.urlRouteMaps = {};
                state.selectedKeys = [];
                state.activeRoute = null;
                state.userVisible = false;
            }
        },
        actions: {
            initUser: ({commit, state}) => {
                return getUser().then((resp) => {
                    if(resp) {
                        let {data, code, message} = resp;
                        if(code == CoreConsts.SuccessCode) {
                            state.user = data;
                        } else {
                            console.error(message || "获取用户失败");
                        }
                    }
                    return {};
                });
            },
            initMenus: ({commit, state}) => {
                 return getMenus().then((resp) => {
                     if(resp) {
                         let {data} = resp;
                         state.views = data;
                         state.activeView = state.views[0];
                         let {urlMenuMap, idMenuMap, authMenuMap} = resolverMenuMaps(data);
                         state.idMenuMaps = idMenuMap;
                         state.authMenuMap = authMenuMap;

                         // 加入到菜单列表
                         if(urlMenuMap != null) {
                             Object.keys(urlMenuMap).forEach(key => {
                                 state.urlMenuMaps[key] = urlMenuMap[key];
                             })
                         }

                         resolverMenuToRoutes(urlMenuMap);
                         state.init = true; // 声明路由信息已经初始化完成
                         return urlMenuMap;
                     }

                    return {};
                });
            },

        }
    })
}

export default registerSysModule;
