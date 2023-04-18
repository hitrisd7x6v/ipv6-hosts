import qs from "qs";

export default {
    /**
     * 是否是生产环境
     * @return {boolean}
     */
    isProd() {
        return import.meta.env.PROD
    },
    /**
     * 克隆对象
     * @param obj
     * @return {Object} obj
     */
    clone(obj) {
        let stringify = JSON.stringify(obj);
        return JSON.parse(stringify);
    },
    /**
     * 校验此path是否存在任务栏数据里
     * @param path {String}
     * @param taskBarData {Array<_RouteRecordBase>}
     * @return {Boolean}
     */
    existsRouteAtTaskBar(path, taskBarData) {
        return taskBarData.find(item => item.path == path) != undefined
    },
    /**
     * 解析url的参数
     * @param url /test?a=1&b=2
     * @return {Object} {a: "1", b: "2"}
     */
    resolverQueryOfUrl(url) {
        let queryStr = url.split('?')[1];
        return qs.parse(queryStr);
    },

    /**
     * 截取url部分
     * @param url {String}
     */
    cutUrlToUri(url) {
        let number = url.indexOf("?");
        return number > -1 ? url.substring(0, number) : url;
    }
}
