import {createRouter, createWebHashHistory, useRoute} from 'vue-router'
import Index from '@msn/index/index.vue'
import NotFound from '@msn/error/404.vue'

let routes = [
    {
        path: '/', component: Index, name: 'index', children: [
            {path: 'core/menu', component: ()=>import('@msn/core/menu/menu.vue')},
            {path: 'core/role', component: ()=>import('@msn/core/role/role.vue')},
            {path:'/:chapters+', component: NotFound}
        ]
    },{
        path: '/login', component: ()=>import('@msn/login/login.vue'), name: 'login'
    }
]

const router = createRouter({
    routes,
    history: createWebHashHistory()
});

export default router
