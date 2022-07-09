import {computed, watch} from 'vue'
import store from "@/store";
import {createRouter, createWebHashHistory} from 'vue-router'
import Main from '@msn/main/index.vue'
import Login from '@msn/login/login.vue'
import NotFound from '@msn/error/404.vue'
import Index from '@msn/core/index/index.vue'

let routes = [
    {path: '/', component: Main, name: '主页', children: [
            {path: '', component: Index, name: '首页'}
        ]
    },
    {path: '/login', component: Login, name: '登录'},
]

const router = createRouter({
    routes,
    history: createWebHashHistory()
});

/**
 * 增加404路由
 * 如果系统菜单还没有加载完成则先跳回首页, 等待菜单加载完成之后在跳转回去
 */
router.addRoute({path:'/:chapters+', name: '404', component: NotFound,
    beforeEnter({path}, from, next) {
        let init = store.getters["sys/init"];
        if(!init) {
            init = computed(() => store.getters["sys/init"]);
            watch(init, (val) => {
                let urlMenuMaps = store.getters['sys/urlMenuMaps'];
                let menu = urlMenuMaps[path];
                if(menu) { // 当前url对应的菜单, 如果存在激活
                    store.commit('sys/putMenuToTaskBars', menu)
                    store.commit('sys/switchActiveMenuTo', path)
                }

                router.push(path).then()
            });

            next({path: '/'})

        } else {
            next();
        }
    }
})

// 必须在菜单初始化之后才能使用
router.beforeEach((to, form, next) => {
    next();
});

/**
 * 注册系统菜单路由信息
 * @see /src/store/core.js
 */
const registerMenusRoutes = (routes) => {
    // 注册到index下面
    routes.forEach(route => router.addRoute('主页', route))
}

export {registerMenusRoutes}
export default router
