import {computed, watch} from 'vue'
import store from "@/store";
import {createRouter, createWebHashHistory} from 'vue-router'
import Main from '@msn/main/index.vue'
import Login from '@msn/login/login.vue'
import NotFound from '@msn/error/404.vue'
import Index from '@msn/core/index/index.vue'
// 系统路由信息
const KeepAliveMaps = {};
// 获取组件名称(name) 用来处理组件缓存(KeepAlive)
let sysRoutes = [
    {path: '', component: Index, name: 'index'},
    {path: 'center/detail', name: '用户中心'}
]

const MainName = "主页"
/**
 * 路由的名称必须和组件的名称一致, 如果需要使用(KeepAlive)功能
 * @type {({path: string, component: {components: {LayoutSider: {components: {IvzSubMenu: {name: string, props: {menu: {default: function(): {}, type: Object | ObjectConstructor}}}}, computed: {taskBarData: Computed, selectedKeys: Computed, openKeys: Computed, menus: Computed}, methods: {openChange(*=): void, openUrlOrSwitchTask: MutationMethod, selectMenu(*): void, switchOpenSubMenuTo: MutationMethod, collapsedHandle(): void}, name: string, setup(): {collapsed: Ref<UnwrapRef<boolean>>, theme: Ref<UnwrapRef<string>>}}, UserCenter: {components: {UserDetail: {components: {UserOutlined: UserOutlinedIconType}, computed: {user: Computed}, methods: {submit(), handlePreview()}, name: string, setup(): {avatarUploadUri: string, rules: Ref<UnwrapRef<{phone: {message: string, required: boolean}, nickName: {message: string, required: boolean}, email: {message: string, required: boolean}}>> | Ref<any | undefined>, loading: Ref<UnwrapRef<boolean>> | Ref<any | undefined>, fileList: Ref<UnwrapRef<[]>> | Ref<any | undefined>}}, UserProfile: {components: {SettingOutlined: SettingOutlinedIconType, UserProfileItem: {components: {LoadingOutlined: LoadingOutlinedIconType, EditOutlined: EditOutlinedIconType}, methods: {changeHandle(*): void, editHandle(): void, blurHandle(): void}, name: string, setup({modelValue?: *}): {loading: Ref<UnwrapRef<boolean>> | Ref<any | undefined>, value: null, editing: Ref<UnwrapRef<boolean>> | Ref<any | undefined>}, updated(): void, props: [string, string, string]}, DeploymentUnitOutlined: DeploymentUnitOutlinedIconType, MailFilled: MailFilledIconType, FieldTimeOutlined: FieldTimeOutlinedIconType, EditOutlined: EditOutlinedIconType, UserOutlined: UserOutlinedIconType, EllipsisOutlined: EllipsisOutlinedIconType, PhoneFilled: PhoneFilledIconType}, computed: {user: Computed}, methods: {submit(*): Promise<unknown> | Promise<unknown>}, name: string, setup(): {avatar: Ref<UnwrapRef<boolean>> | Ref<any | undefined>, fileList: Ref<UnwrapRef<[]>> | Ref<any | undefined>}}, UserOperaHistory: {name: string, setup(): {getMonthData: function(*): (number|undefined), getListData: function(*): *, value: Ref<UnwrapRef<object>> | Ref<UnwrapRef<unknown>> | Ref<any | undefined>}}, UserEditPwd: {methods: {submit(): void}, name: string, setup(): {pwdModel: UnwrapNestedRefs<{surePwd: string, newPwd: string, oldPwd: string}>, rules: UnwrapNestedRefs<{surePwd: [{message: string, required: boolean}, {validator: function(*, *): Promise<void>|Promise<never>}], newPwd: {message: string, required: boolean}, oldPwd: {message: string, required: boolean}}>, loading: Ref<UnwrapRef<boolean>> | Ref<any | undefined>}}, UserNotifyList: {name: string, setup(): {dataSource: Ref<UnwrapRef<[]>> | Ref<any | undefined>}}}, computed: {visible: Computed, activeKey: Computed}, methods: {toggleUserVisible: MutationMethod, tabChange(*): void, afterVisibleChange(), closeHandle(): void}, name: string}, LayoutHeader: {components: {NotificationFilled: NotificationFilledIconType, LogoutOutlined: LogoutOutlinedIconType, ReloadOutlined: ReloadOutlinedIconType, LockFilled: LockFilledIconType}, computed: {taskBarData: Computed, activityView: Computed, selectedKeys: Computed, activityMenu: Computed, user: Computed, views: Computed}, methods: {closeTask(*, *): void, switchActiveViewTo: MutationMethod, openUrlOrSwitchTask: MutationMethod, toggleUserVisible: MutationMethod, switchTask(*=): void, loadError(): void, taskBarCloseMoreOpera(*): void, viewHandler(*=): void, quickOpera({key: *}): void}, name: string, setup(): {workMenu: {}}}}, computed: {taskBarData: Computed, alive(): *}, methods: {}, name: string, setup(): void}, children: ({path: string, component: {name: string}, name: string}|{path: string, name: string})[], name: string}|{path: string, component: {data(): {form: null, loginModel: {izCaptcha: boolean, errMsg: string, captchaImg: string, loading: boolean, class: string}, iconStyle: {cursor: string, fontSize: string}}, methods: {oauth2Login(*=): void, clickImg(): void}, name: string, setup(): {submit: submit, loginModel: UnwrapNestedRefs<{izCaptcha: boolean, errMsg: string, captchaImg: string, loading: boolean, class: string}>, wrapperCol: {span: number}, labelCol: {span: number}, user: UnwrapNestedRefs<{password: null, captcha: null, rememberMe: boolean, userName: null}>, validateInfos: validateInfos}}, name: string})[]}
 */
let routes = [
    {path: '/', component: Main, name: MainName, children: sysRoutes},
    {path: '/login', component: Login, name: 'login'},
]

const router = createRouter({
    routes,
    history: createWebHashHistory()
});

/**
 * 添加用户中心和其他的路由到菜单列表
 */
const initSysRoutesToMenus = () => {
    // 添加用户中心菜单到菜单列表
    sysRoutes.forEach(({path, name, component}) => {
        let menu = {url: path, name, closable: true};

        if(component) {
            KeepAliveMaps[name] = component.name
            menu['componentName'] = component.name
        }

        store.commit('sys/addNewMenu', menu);
        if(path == '') { // 首页
            menu.closable = false; // 首页不支持关闭
            router.push('/').then(() => {
                store.commit('sys/openUrlOrSwitchTask', '');
            })
        }
    })
}


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
                    router.push(path).then(() => {
                        store.commit('sys/openUrlOrSwitchTask', path)
                    })
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
                menu['componentName'] = componentName;
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
export {resolverMenuToRoutes, initSysRoutesToMenus}
export default router
