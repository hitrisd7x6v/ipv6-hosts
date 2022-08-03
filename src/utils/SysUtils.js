import qs from "qs";
import {GET, POST} from "@/utils/request";
import {cloneDeep} from "lodash-es";

const TypeMethodMaps = {
    Add: null, Edit: GET, Del: POST, View: GET,
    Import: POST, Export: POST, Detail: GET, Submit: POST
}

const FunMetaMaps = {
    Add: 'Add', Del: 'Del', Edit: 'Edit', View: 'View',
    Import: 'Import', Export: 'Export', Detail: 'Detail',
    Cancel: 'Cancel', Submit: 'Submit', Reset: 'Reset',
    Fold: 'Fold', // 折叠
    Unfold: 'Unfold',//展开
    getFunMeta: (field, funMetas) => {
        if(funMetas instanceof Array) {
            return funMetas.find(item => item.field == field)
        }
    }
}
const FunBtnConfig = {
    Add: {type: 'default', class: 'ivz-fm-add'},
    Del: {type: 'danger', class: 'ivz-fm-del', style: {color: 'red'}},
    Edit: {type: 'link', class: 'ivz-fm-edit'},
    View: {type: 'primary', class: 'ivz-fm-view', icon: 'iz-icon-daiban'},
    Reset: {type: 'dashed', class: 'ivz-fm-reset'},
    Import: {type: 'default', class: 'ivz-fm-import'},
    Export: {type: 'default', class: 'ivz-fm-export'},
    Detail: {type: 'default', class: 'ivz-fm-detail'},
    Cancel: {type: 'link', class: 'ivz-fm-cancel'},
    Submit: {type: 'primary', class: 'ivz-fm-submit'},
    Fold: {type: 'primary', class: 'ivz-fm-fold'},
    Unfold: {type: 'primary', class: 'ivz-fm-unfold'},
    __Default: {type: 'default', class: 'ivz-fm-default'},
}

const getMetaConfig = function (field) {
    let config = FunBtnConfig[field];
    if(config == null) {
        return cloneDeep(FunBtnConfig["__Default"])
    } else {
        return cloneDeep(config);
    }
}

export {TypeMethodMaps, FunMetaMaps, getMetaConfig}

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
