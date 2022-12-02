/*系统模块相关配置*/
import {getMenus, getDict, getUser} from "@/api";
import {reactive} from "vue";
import {GET} from "@/utils/request";
import router, {resolverMenuToRoutes} from "@/router";

// component: Index必须和首页组件的name一致
const index = {id: -1, name: '首页', url: '/', component: 'main', closable: false}

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
            activeView: {}, // 当前激活的视图
            taskBarData: [], // 任务栏打开的菜单
            optionsMaps: {}, // url | dict -> {options, valueLabelMap}
            idMenuMaps: {}, // id和菜单的映射
            selectedKeys: [], // 选中的菜单
            urlMenuMaps: {}, // url -> menu 对象
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

            // 在任务栏上面打开一个任务
            openUrlOrSwitchTask: (state, url) => {
                let menu = state.urlMenuMaps[url];
                if(menu == null) {
                    return console.error(`url[${url}]对应的菜单不存在`)
                }

                router.push(menu.url).then(() => {
                    store.commit('sys/openOrSwitchTask', menu)
                }).catch(reason=> {
                    console.error(`打开菜单失败(组件不存在或者未注册路由)`)
                });
            },

            // 在任务栏打开或者切换任务
            openOrSwitchTask: (state, urlOrMenu) => {
                let menu = urlOrMenu;
                if(typeof menu == 'string') {
                    menu = state.urlMenuMaps[urlOrMenu];
                }

                if(!menu) {
                    return console.error("请指定要打开的菜单");
                }

                let exists = state.taskBarData.filter(item => menu == item);
                // 任务已经在任务栏, 直接切换过去
                if(exists.length > 0) {
                    store.commit('sys/switchActiveMenuTo', menu);
                } else {
                    state.taskBarData.push(menu)
                    store.commit('sys/switchActiveMenuTo', menu);
                }
            },
            // 切换激活的菜单
            switchActiveMenuTo: (state, urlOrMenu) => {
                let menu = urlOrMenu;
                if(typeof menu == 'string') {
                    menu = state.urlMenuMaps[urlOrMenu];
                }

                if(menu != state.activeMenu) {
                    state.activeMenu = menu;

                    // 说明是侧边栏的菜单, 选中
                    // 通过方法addNewTask新增非侧边栏菜单
                    if(menu.isMenu != false) {
                        state.selectedKeys.length = 0;
                        state.selectedKeys.push(menu.url);
                    }
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
            }
        },
        actions: {
            initUser: ({commit, state}) => {
                getUser().then(({data}) => {
                    state.user = data;
                })
            },
            initMenus: ({commit, state}) => {
                 return getMenus().then(({data}) => {
                    state.views = data;
                    state.activeView = state.views[0];
                    let {urlMenuMap, idMenuMap} = resolverMenuMaps(data);
                    state.idMenuMaps = idMenuMap;

                    // 加入到菜单列表
                    if(urlMenuMap != null) {
                        Object.keys(urlMenuMap).forEach(key => {
                            state.urlMenuMaps[key] = urlMenuMap[key];
                        })
                    }

                    resolverMenuToRoutes(urlMenuMap);
                    state.init = true; // 声明路由信息已经初始化完成
                    return urlMenuMap;
                })
            },

        }
    })
}

export default registerSysModule;
