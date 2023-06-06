<template>
    <a-layout class="ivz-layout" :class="'ivz-theme-'+theme">
        <!--侧边菜单栏-->
        <LayoutSider />

        <a-layout class="ivz-layout-view">
            <!--右侧头栏-->
            <LayoutHeader :reload="reload" />

            <!--右侧视图页-->
            <a-layout-content class="ivz-main-container">
                <router-view v-slot="{ Component }">
                    <transition name="slide-fade" mode="out-in">
                        <keep-alive :include="alive">
                            <component :is="Component" />
                        </keep-alive>
                    </transition>
                </router-view>

                <!-- 用户中心 -->
                <UserCenter />
            </a-layout-content>
            <!--      <a-layout-footer style="text-align: center; height: 36px; line-height: 36px; padding: 0px">-->
            <!--        ivzone ©2020 Created by 厦门由创源科技  <a href="https://beian.miit.gov.cn/" target="_blank">闽ICP备16015055号</a>-->
            <!--      </a-layout-footer>-->
        </a-layout>
    </a-layout>
</template>

<script>
import { provide, ref } from 'vue'
import { mapGetters, useStore } from "vuex";
import LayoutSider from "@msn/main/LayoutSider.vue";
import LayoutHeader from "@msn/main/LayoutHeader.vue";
import UserCenter from "@msn/main/UserCenter.vue";
import { RowContextKey, ViewContextKey } from "@/utils/ProvideKeys";

export default {
    name: "index",
    components: { UserCenter, LayoutSider, LayoutHeader },
    setup () {

        // 初始化后台菜单信息到路由
        useStore().dispatch('sys/initMenus')

        // 初始化当前登入的用户信息
        useStore().dispatch('sys/initUser')

        /**
         * URow组件将覆盖此对象, 使用在表单组件(表单组件使用了ACol)
         */
        provide(RowContextKey, {});

        /**
         * 视图组件使用的上下文
         * @see UView.jsx
         * @see IvzFuncView.vue
         * @see IvzMenuView.vue
         * @param value 必须为 null
         */
        provide(ViewContextKey, null);

        let aliveComponents = ref([]);
        return { aliveComponents };
    },

    computed: {
        ...mapGetters({
            theme: 'sys/theme',
            taskBarData: 'sys/taskBarData',
        }),
        // 用于缓存视图页
        alive () {
            return this.taskBarData
                .filter(route => route.meta['keepAlive'] != null)
                .map(route => route.meta.keepAlive)
        }
    },
    methods: {
        // 刷新功能
        reload (route) {
            let keepAlive = route.meta.keepAlive;
            route.meta.keepAlive = null;
            this.$router.push('/refresh').then(() => {
                route.meta.keepAlive = keepAlive;
            })
        }
    }
}
</script>

<style>
.ivz-layout {
    width: 100%;
    height: 100%;
}
.ivz-opera-more {
    margin-right: -6px;
    line-height: 46px;
}
.ivz-opera-more .ant-avatar {
    vertical-align: -9px;
}
.iz-menu-item-title {
    margin-left: 8px;
}
/*通知抽屉*/
#slider-drawer .ant-drawer {
    top: 46px;
}
#slider-drawer .ant-drawer-content {
    background-color: #fefefe;
}
#slider-drawer .ant-drawer-mask {
    background-color: rgba(0, 0, 0, 0.08);
}
/*任务栏样式*/
.ivz-main-container {
    width: 100%;
    height: 100%;
    display: flex;
    display: -ms-flex;
    overflow: hidden;
    position: relative;
    background: #ffffff;
    flex-direction: column;
    display: -webkit-flex; /* Safari */
    justify-content: flex-start;
}
.ivz-main-container ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.ivz-main-container ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: hsl(0deg 0% 0% / 22%);
    -webkit-box-shadow: inset 0 0 5px hsl(0deg 0% 100% / 5%);
}

.ivz-main-container ::-webkit-scrollbar-track {
    border-radius: 3px;
    background: hsl(0deg 0% 83%);
    -webkit-box-shadow: inset 0 0 5px rgb(37 37 37 / 5%);
}
.ivz-ilv-user {
    /*height: 200px;*/
    overflow: hidden;
    position: relative;
    border: 1px solid #ebedf0;
    padding: 48px;
    background: #fafafa;
    width: 100%;
}

.ivz-theme-dark .ivz-avatar {
    background-color: #001529;
}
.ivz-theme-dark .ivz-avatar .ivz-avatar-name {
    color: #ffffff;
}
.ivz-theme-dark .ivz-avatar .ant-avatar {
    background-color: #ffffff;
}

/*动画*/
.slide-fade-enter-active {
    transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>
