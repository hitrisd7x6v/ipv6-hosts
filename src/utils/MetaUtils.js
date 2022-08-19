import {cloneDeep} from "lodash-es";
import {FunMetaMaps} from "@/utils/SysUtils";
import {h} from "vue";
import {DoubleLeftOutlined} from "@ant-design/icons-vue";

function buildModelFromMetas(metas) {
    let model = {};
    let doBuildModel = (model, items) => {
        items.forEach(meta => {
            if(meta.children) {
                doBuildModel(model, meta.children);
            } else {
                model[meta.key] = null
            }
        });

        return model;
    }

    return doBuildModel(model, metas);
}
function createFormMetaInfo(editModel, metasMap) {
    return {
        editModel: editModel,
        getMetaValue: function (key) {
            return getMetaValue(key, editModel);
        },
        getFormMeta: function (key) {
            let meta = metasMap[key];
            return meta ? meta : console.warn(`没有找到对应的元数据[${key}]`);
        }
    }
}
function createMetasMap(metas) {
    if(!metas) {
        throw new Error("IvzForm组件未指定元数据信息[metas]")
    }

    let metaMap = {};
    metas.forEach(meta => {
        metaMap[meta.key] = meta;
    });

    return metaMap;
}
function getMetaByProp(prop, metasMap) {
    let meta = metasMap[prop];
    return meta ? meta : console.warn(`没有找到对应的元数据[${prop}]`);
}
function getMetaValue(keyPath, model) {
    let temp = model;
    for(let i=0; i<= keyPath.length - 1; i++) {
        temp = temp[keyPath[i]]
        if(!temp) return temp;
    }

    return temp;
}

function setMetaValue(keyPath, model, value) {
    let temp = model;
    for(let i=0; i < keyPath.length - 1; i++) {
        if(!temp[keyPath[i]]) {
            temp = temp[keyPath[i]] = {}
        } else {
            temp = temp[keyPath[i]];
        }
    }

    temp[keyPath[keyPath.length - 1]] = value;
}

function cloneModel(model) {
    let stringify = JSON.stringify(model);
    return JSON.parse(stringify);
}

function clone(target) {
    return cloneDeep(target);
}

const MetaConst = {
    PageSize: 'pageSize',
    PageCurrent: 'current',

    EditFormType: 'edit',
    SearchFormType: 'search',
}
const FunBtnConfig = {
    Add: {type: 'default', class: 'ivz-fm-add'},
    Del: {type: 'danger', class: 'ivz-fm-del', style: {color: 'red'}},
    Edit: {type: 'link', class: 'ivz-fm-edit'},
    View: {type: 'primary', class: 'ivz-fm-view'},
    Reset: {type: 'dashed', class: 'ivz-fm-reset'},
    Import: {type: 'default', class: 'ivz-fm-import'},
    Export: {type: 'default', class: 'ivz-fm-export'},
    Detail: {type: 'default', class: 'ivz-fm-detail'},
    Cancel: {type: 'link', class: 'ivz-fm-cancel'},
    Submit: {type: 'primary', class: 'ivz-fm-submit'},
    Expanded: {type: 'default', class: 'ivz-fm-expanded'},
    __Default: {type: 'default', class: 'ivz-fm-default'},
}

const DefaultMetas = { }
DefaultMetas[FunMetaMaps.View] = {sort: 10}
DefaultMetas[FunMetaMaps.Reset] = {sort: 20}
DefaultMetas[FunMetaMaps.Add] = {sort: 30}

DefaultMetas[FunMetaMaps.Edit] = {sort: 60}
DefaultMetas[FunMetaMaps.Del] = {sort: 70}
DefaultMetas[FunMetaMaps.Detail] = {sort: 80}

DefaultMetas[FunMetaMaps.Submit] = {sort: 110}
DefaultMetas[FunMetaMaps.Cancel] = {sort: 120}
DefaultMetas[FunMetaMaps.Import] = {sort: 150}
DefaultMetas[FunMetaMaps.Export] = {sort: 160}
DefaultMetas[FunMetaMaps.Expanded] = {sort: 230}

const getMetaConfig = function (field, props) {
    let config = FunBtnConfig[field];
    if(config == null) {
        config = FunBtnConfig["__Default"];
    }

    let cloneConfig = cloneDeep(config);
    if(props) {
        return Object.assign(cloneConfig, props)
    }

    if(FunMetaMaps.Expanded == field) {
        // 旋转角度
        cloneConfig['rotate'] = 90;
        // 给展开增加操作图标
        cloneConfig.icon = () => h(DoubleLeftOutlined, {rotate: cloneConfig.rotate})
    }
    return cloneConfig;
}


const mergeMetaOfDefault = function (meta) {
    if(!meta.field) return;
    let defaultMeta = DefaultMetas[meta.field];
    if(!defaultMeta) return;

    Object.keys(defaultMeta).forEach(key => {
        meta[key] = meta[key] || defaultMeta[key]
    })

    meta.props = getMetaConfig(meta.field, meta.props);
}

export {buildModelFromMetas, cloneModel, createMetasMap, getMetaValue
    , setMetaValue, createFormMetaInfo, getMetaByProp, clone, MetaConst, mergeMetaOfDefault}
