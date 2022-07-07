import {createStore} from "vuex";
import {IvzOnlineStore} from "ivz-online";
import registerSysModule from "@/store/module/core";
import registerViewModule from "@/store/module/view";
let store = createStore({
    state: {

    },
    mutations: {

    },
    modules: {
        IvzOnlineStore
    }
});

/*注册系统核心模块*/
registerSysModule(store);
/*注册页级视图模块*/
registerViewModule(store);

export default store
