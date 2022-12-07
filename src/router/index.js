import store from "@/store";
import {computed, watch} from 'vue'
import Main from '@msn/main/index.vue'
import Login from '@msn/login/login.vue'
import NotFound from '@msn/error/404.vue'
import Refresh from "@msn/main/Refresh.vue";
import Index from '@msn/core/index/index.vue'
import {createRouter, createWebHashHistory} from 'vue-router'

// 用来处理组件缓存(KeepAlive)
const KeepAliveMaps = {};

// 主页路由名称            // 首页路径
const MainName = "Main";

const router = createRouter({
    routes: [
        {path: '/', component: Main, name: MainName, children: [
                {path: '', component: Index, name: '首页', meta: {closable: false}},
                {path: 'refresh', name: 'refresh', component: Refresh}, // 页面刷新功能中做路由中转
                {path: 'dict/data', component: ()=>import("@msn/core/dict/DictData.vue")
                    , name: '字典数据', meta: {keepAlive: 'DictData', closable: true}},

                {path:'/:chapters+', name: '404', component: NotFound, beforeEnter(to, from, next) {
                        let path = to.path;
                        let init = store.getters["sys/init"];
                        if(!init) {
                            // 先移除任务
                            store.commit('sys/removeTask', path);
                            init = computed(() => store.getters["sys/init"]);
                            watch(init, (val) => {
                                let urlMenuMaps = store.getters['sys/urlMenuMaps'];
                                let menu = urlMenuMaps[path];
                                if(menu) { // 当前url对应的菜单, 如果存在激活
                                    router.push(path).catch(reason => console.error(`${reason}`))
                                }
                            });

                            // 调到首页进行初始化
                            next({path: '/'})

                        } else {
                            next();
                        }
                    }
                }
            ]
        },
        {path: '/login', component: Login, name: '登录'},
    ],
    history: createWebHashHistory()
});

/**
 * 1. 切换路由时同步切换任务栏
 */
router.beforeEach((to, form, next) => {
    if(to.name != 'refresh') {
        store.commit('sys/openOrSwitchTask', to)
    }

    next();
});


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
                console.warn(`菜单[${menu.url}]没有设置[name]属性`);
            }

            // 注意：每个组件的名称都不能重复, 否则会导致KeepAlive缓存清除失败
            let existsMenu = KeepAliveMaps[componentName];
            if(existsMenu) {
                console.warn(`菜单[${menu.name}]和[${existsMenu.name}]的组件名都是[${componentName}], 会导致KeepAlive组件缓存失效`)
            } else {
                KeepAliveMaps[componentName] = menu;
                store.commit('sys/setRouteKeepAlive', {url: menu.url, componentName})
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

        let route = {path, component: importLocale(path, menu)
            , name: menu.name, meta: {closable: true}};

        router.addRoute(MainName, route)
    })
}

export {resolverMenuToRoutes}
export default router
