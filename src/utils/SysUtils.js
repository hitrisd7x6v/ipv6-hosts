import {GET, POST} from "@/utils/request";

const TypeMethodMaps = {
    Add: null, Edit: GET, Del: POST, View: GET,
    Import: POST, Export: POST, Detail: GET, Submit: POST
}

const FunMetaMaps = {
    Add: 'Add', Del: 'Del', Edit: 'Edit', View: 'View',
    Import: 'Import', Export: 'Export', Detail: 'Detail',
    Cancel: 'Cancel', Submit: 'Submit', Reset: 'Reset'
}
const FunMetaConfig = {
    Add: {type: 'dashed'},
    Del: {type: 'danger'},
    Edit: {type: 'link'},
    View: {type: 'primary'},
    Reset: {},
    Import: {type: 'default'},
    Export: {type: 'default'},
    Detail: {type: 'default'},
    Cancel: {type: 'default'},
    Submit: {type: 'primary', shape: 'round'}
}

export {TypeMethodMaps, FunMetaMaps}

export default {
    /**
     * 是否是生产环境
     * @return {boolean}
     */
    isProd() {
        return import.meta.env.PROD
    }
}
