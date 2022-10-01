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
    Add: {type: 'default', class: 'ivz-fm-add', color: '#2db7f5'},
    Del: {type: 'danger', class: 'ivz-fm-del', color: '#f50'},
    Edit: {type: 'link', class: 'ivz-fm-edit', color: '#108ee9'},
    View: {type: 'primary', class: 'ivz-fm-view'},
    Reset: {type: 'dashed', class: 'ivz-fm-reset'},
    Import: {type: 'default', class: 'ivz-fm-import'},
    Export: {type: 'default', class: 'ivz-fm-export'},
    Detail: {type: 'default', class: 'ivz-fm-detail', color: 'green'},
    Cancel: {type: 'link', class: 'ivz-fm-cancel'},
    Submit: {type: 'primary', class: 'ivz-fm-submit'},
    Expanded: {type: 'dashed', class: 'ivz-fm-expanded'},
    __Default: {type: 'default', class: 'ivz-fm-default'},
}

const DefaultMetas = { }, view = () => true;
DefaultMetas[FunMetaMaps.View] = {name: '搜索', sort: 10, view}
DefaultMetas[FunMetaMaps.Reset] = {name: '重置', sort: 20, view}
DefaultMetas[FunMetaMaps.Add] = {name: '新增', sort: 30, view}

DefaultMetas[FunMetaMaps.Edit] = {name: '编辑', sort: 60, view}
DefaultMetas[FunMetaMaps.Del] = {name: '删除', sort: 70, view}
DefaultMetas[FunMetaMaps.Detail] = {name: '详情', sort: 80, view}

DefaultMetas[FunMetaMaps.Submit] = {name: '提交', sort: 110, view}
DefaultMetas[FunMetaMaps.Cancel] = {name: '取消', sort: 120, view}
DefaultMetas[FunMetaMaps.Import] = {name: '导入', sort: 150, view}
DefaultMetas[FunMetaMaps.Export] = {name: '导出', sort: 160, view}
DefaultMetas[FunMetaMaps.Expanded] = {name: '展开/折叠', sort: 230, view}

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
