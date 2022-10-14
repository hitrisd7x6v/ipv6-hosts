import store from "@/store";
import {computed, watch} from 'vue'
import Main from '@msn/main/index.vue'
import Login from '@msn/login/login.vue'
import NotFound from '@msn/error/404.vue'
import Index from '@msn/core/index/index.vue'
import {createRouter, createWebHashHistory} from 'vue-router'

// 用来处理组件缓存(KeepAlive)
const KeepAliveMaps = {};

// 主页路由名称            // 首页路径
const MainName = "Main", IndexPath = "/"

// 注册静态路由
let StaticRoutes = [
    {path: IndexPath, component: Index, name: '首页'},
    {path: 'dict/data', component: ()=>import("@msn/core/dict/DictData.vue"), name: '字典数据'}
]

/**
 * 路由的名称必须和组件的名称一致, 如果需要使用(KeepAlive)功能
 */
let routes = [
    {path: '/', component: Main, name: MainName, children: [
            ...StaticRoutes,
            {path:'/:chapters+', name: '404', component: NotFound, beforeEnter(to, from, next) {
                    let path = to.path;
                    let init = store.getters["sys/init"];
                    if(!init) {
                        init = computed(() => store.getters["sys/init"]);
                        watch(init, (val) => {
                            let urlMenuMaps = store.getters['sys/urlMenuMaps'];
                            let menu = urlMenuMaps[path];
                            if(menu) { // 当前url对应的菜单, 如果存在激活
                                store.commit('sys/openUrlOrSwitchTask', path)
                            }
                        });

                        next({path: '/'})

                    } else {
                        next();
                    }
                }
            }
        ]
    },
    {path: '/login', component: Login, name: '登录'},
]

const router = createRouter({
    routes,
    history: createWebHashHistory()
});

/**
 * 1. 切换路由时同步切换任务栏
 */
router.beforeEach((to, form, next) => {
    let url = to.path;
    let menu = store.getters['sys/urlMenuMaps'][url];
    // 菜单存在 则在任务栏中打开或者切换
    if(menu) {
        store.commit('sys/openOrSwitchTask', menu)
    }

    next();
});

/**
 * 添加系统和其他静态路由到菜单列表
 */
const initStaticRoutesToMenus = () => {
    // 添加用户中心菜单到菜单列表
    StaticRoutes.forEach(({path, name, component}) => {
        // 菜单的url需以 '/' 开头(否则可能出现任务栏不打开)
        let url = path.startsWith('/') ? path : '/'+path;
        /**
         * closable 声明任务不能关闭
         * isMenu 声明不是动态菜单
         */
        let menu = {url, name, closable: true, isMenu: false};

        // 用来处理KeepAlive组件的缓存(必须和组件的name属性相同)
        if(component) {
            KeepAliveMaps[name] = component.name
            menu['keepAlive'] = component.name
        }

        store.commit('sys/addNewMenu', menu);
        if(path == IndexPath) { // 首页
            menu.closable = false; // 首页不支持关闭
            store.commit('sys/openOrSwitchTask', menu)
        }
    })

    // 跳转到当前路由对应的页面
    let current = router.currentRoute.value;
    if(router.hasRoute(current.name)) {
        store.commit('sys/openUrlOrSwitchTask', current.path)
    }
}

// 动态菜单生成路由
function importLocale(path, menu) {
    return () => {
        let urlPath = path.split('/');
        // 必须使用这种写法才能正确开启动态加载
        // https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
        return import(`../views/${urlPath[0]}/${urlPath[1]}/index.vue`).then(item => {
            // 获取组件名称 用来处理组件缓存(KeepAlive)
            let componentName = item.default.name;
            if(!componentName) {
                console.warn(`菜单[${menu.name}]没有`);
            }
            // 注意：每个组件的名称都不能重复, 否则会导致KeepAlive缓存清除失败
            let existsMenu = KeepAliveMaps[componentName];
            if(existsMenu) {
                console.warn(`菜单[${menu.name}]和[${existsMenu.name}]的组件名都是[${componentName}], 会导致KeepAlive组件缓存失效`)
            } else {
                KeepAliveMaps[componentName] = menu;
                menu['keepAlive'] = componentName;
            }

            return item;
        })
    }
}

const resolverMenuToRoutes = (urlMenuMaps) => {
    Object.values(urlMenuMaps).map(menu => {
        let {url, name} = menu;
        // 如果以'/'开头
        let split = url.split('/').filter(item => item != '');
        let path = split.join('/');

        let route = {path, component: importLocale(path, menu), name: menu.name};
        router.addRoute(MainName, route)
    })
}

export {resolverMenuToRoutes, initStaticRoutesToMenus}
export default router
