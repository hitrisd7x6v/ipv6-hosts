import {createStore} from "vuex";
import registerSysModule from "@/store/module/core";
import registerViewModule from "@/store/module/view";
let store = createStore({
    state: {

    },
    mutations: {

    },
    modules: {}
});

/*注册系统核心模块*/
registerSysModule(store);
/*注册页级视图模块*/
registerViewModule(store);

export default store
