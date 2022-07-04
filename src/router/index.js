import {createRouter, createWebHashHistory, useRoute} from 'vue-router'

let routes = [
    {
        path: '/', component: () => import('@/views/index/index.vue')
    },
    {
        path: '/login', component: () => import('@/views/login/login.vue')
    }
]

const router = createRouter({
    routes,
    history: createWebHashHistory()
});

export default router
