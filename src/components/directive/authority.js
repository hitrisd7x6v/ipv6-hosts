import store from "@/store";
function auth(el, content) {
    let auth = store.getters['sys/authMenuMap'];
    if(auth == null) return;

    // 获取所有的权限菜单
    let isArray = content.value instanceof Array;

    let arg = content.arg ? content.arg : 'and';
    let value = isArray ? content.value : [content.value];

    // e.g v-auth:and="['a:b:c', 'd:e:f']"
    if(arg == 'and') {
        // 有一个不包含说明没有权限 直接移除
        for(let item of value) {
            if(!auth[item]) { // 不包含
                el.remove();
            }
        }
    } else if(arg == 'or') { // e.g v-auth:or="['a:b:c', 'd:e:f']"
        let contain = false;
        // 只要包含其中一个就是有权限
        for(let item of value) {
            if(auth[item]) { // 包含
                contain = true; break;
            }
        }

        // 一个也不包含直接移除
        if(!contain) {
            el.remove();
        }
    } else {
        console.warn(`v-auth指令只支持 e.g[v-auth:and="[...]" or v-auth:or=[...]] 默认and`)
    }
}
/**
 * 权限指令 v-auth
 */
export default {
    created() { },
    mounted(el, content) {
        auth(el, content);
    },
    updated(el, content) {
        auth(el, content);
    },
    unmounted() { }
}
