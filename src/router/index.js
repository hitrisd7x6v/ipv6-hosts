import {createRouter, createWebHashHistory, useRoute} from 'vue-router'

let routes = [
    {
        path: '/', component: () => import('@/views/index/index.vue')
    },
]

const router = createRouter({
    routes,
    history: createWebHashHistory()
});

export default router
