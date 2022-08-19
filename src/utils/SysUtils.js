import qs from "qs";
import {h} from "vue";
import {GET, POST} from "@/utils/request";
import {cloneDeep} from "lodash-es";
import {DoubleLeftOutlined} from '@ant-design/icons-vue'

const TypeMethodMaps = {
    Add: null, Edit: GET, Del: POST, View: GET,
    Import: POST, Export: POST, Detail: GET, Submit: POST
}

const FunMetaMaps = {
    Add: 'Add', Del: 'Del', Edit: 'Edit', View: 'View',
    Import: 'Import', Export: 'Export', Detail: 'Detail',
    Cancel: 'Cancel', Submit: 'Submit', Reset: 'Reset',
    Expanded: 'Expanded', // 展开/折叠
    getFunMeta: (field, funMetas) => {
        if(funMetas instanceof Array) {
            return funMetas.find(item => item.field == field)
        }
    }
}

export {TypeMethodMaps, FunMetaMaps}

export default {
    /**
     * 是否是生产环境
     * @return {boolean}
     */
    isProd() {
        return import.meta.env.PROD
    },

    resolverQueryOfUrl(url) {
        let queryStr = url.split('?')[1];
        return qs.parse(queryStr);
    }
}
