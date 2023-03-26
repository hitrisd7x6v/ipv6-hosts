import qs from "qs";

export default {
    /**
     * 是否是生产环境
     * @return {boolean}
     */
    isProd() {
        return import.meta.env.PROD
    },
    clone(obj) {
        let stringify = JSON.stringify(obj);
        return JSON.parse(stringify);
    },
    resolverQueryOfUrl(url) {
        let queryStr = url.split('?')[1];
        return qs.parse(queryStr);
    }
}
