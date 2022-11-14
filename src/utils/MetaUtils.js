import {h, ref} from "vue";
import {cloneDeep} from "lodash-es";
import {GET, POST} from "@/utils/request";
import {DoubleLeftOutlined} from "@ant-design/icons-vue";

const TypeMethodMaps = {
    Add: null, Edit: GET, Del: POST, View: GET,
    Import: POST, Export: POST, Detail: GET, Submit: POST
}

const FunMetaMaps = {
    Add: 'Add', Del: 'Del', Edit: 'Edit', View: 'View',
    Import: 'Import', Export: 'Export', Detail: 'Detail',
    Cancel: 'Cancel', Submit: 'Submit', Reset: 'Reset',
    Expanded: 'Expanded', __Default: 'Default',
    getFunMeta: (field, funMetas) => {
        if(funMetas instanceof Array) {
            return funMetas.find(item => item.field == field)
        }
    }
}

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
    if(keyPath.length == 0) {
        return null;
    }

    let temp = model;
    for(let i=0; i<= keyPath.length - 1; i++) {
        temp = temp[keyPath[i]]
        if(!temp) return temp;
    }

    return temp;
}

function setMetaValue(keyPath, model, value) {
    if(keyPath.length == 0) {
        return;
    }

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

    DefaultLabelField: 'label',
    DefaultValueField: 'value',
}
const FunBtnConfig = {
    Add: {class: 'ivz-fm-add', color: '#2db7f5'},
    Del: {class: 'ivz-fm-del', color: '#f50'},
    Edit: {class: 'ivz-fm-edit', color: '#108ee9'},
    View: {class: 'ivz-fm-view'},
    Reset: {class: 'ivz-fm-reset'},
    Import: {class: 'ivz-fm-import'},
    Export: {class: 'ivz-fm-export'},
    Detail: {class: 'ivz-fm-detail', color: 'green'},
    Cancel: {class: 'ivz-fm-cancel'},
    Submit: {class: 'ivz-fm-submit', loading: ref(false)},
    Expanded: {class: 'ivz-fm-expanded'},
    __Default: {class: 'ivz-fm-default'},
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
DefaultMetas['__Default'] = {sort: 680, view}

const getMetaConfig = function (field, props) {
    let config = FunBtnConfig[field];
    if(config == null) {
        config = FunBtnConfig.__Default;
    }

    let cloneConfig = cloneDeep(config);
    if(props) {
        return Object.assign(cloneConfig, props)
    }

    if(FunMetaMaps.Expanded == field) {
        // 旋转角度
        cloneConfig['rotate'] = 90;
        cloneConfig['slots'] = {}
        // 给展开增加操作图标
        cloneConfig.slots.icon = () => h(DoubleLeftOutlined, {rotate: cloneConfig.rotate})
    }
    return cloneConfig;
}


const mergeMetaOfDefault = function (meta) {
    if(!meta.field) return;
    let defaultMeta = DefaultMetas[meta.field];
    if(!defaultMeta) {
        defaultMeta = DefaultMetas.__Default;
    }

    Object.keys(defaultMeta).forEach(key => {
        meta[key] = meta[key] || defaultMeta[key]
    })

    meta.props = getMetaConfig(meta.field, meta.props);
}

let callbackMaps = { }

// 搜索按钮点击回调
callbackMaps[FunMetaMaps.View] = (meta, viewInfo) => {
    meta.props.onClick = (e) => {
        if(meta.callback instanceof Function) {
            let model = viewInfo.get$View().getEditModel();
            meta.callback(model, meta, viewInfo);
        } else {
            viewInfo.get$View().query(meta.url);
        }
    }
}
// 取消按钮点击回调
callbackMaps[FunMetaMaps.Cancel] = (meta, viewInfo, type) => {
    meta.props.onClick = (e) => {
        if(meta.callback instanceof Function) {
            let model = null;
            if(type == 'edit') {
                model = viewInfo.get$View().getEditModel();
            } else if(type == 'search') {
                model = viewInfo.get$View().getSearchModel();
            }
            meta.callback(model, meta, viewInfo)
        } else {
            viewInfo.get$View().cancel();
        }
    }
}
// 提交表单点击回调
callbackMaps[FunMetaMaps.Submit] = (meta, viewInfo) => {
    meta.props.onClick = (e) => {
        let model = viewInfo.get$View().getEditModel();
        if(meta.callback instanceof Function) {
            meta.callback(model, meta, viewInfo)
        } else {
            let url = viewInfo.get$View().isEdit(model) ? meta['editUrl'] : meta['addUrl'];
            // 将提交按钮设置为加载状态
            meta.props['loading'] = true;
            viewInfo.get$View().submit(url)
                .then(() => viewInfo.get$View().query())
                // 取消加载按钮的加载状态
                .finally(() => meta.props['loading'] = false);
        }
    }
}
// 新增按钮点击回调
callbackMaps[FunMetaMaps.Add] = (meta, viewInfo) => {
    meta.props.onClick = (e) => {
        if(meta.callback instanceof Function) {
            let model = viewInfo.get$View().getEditModel();
            meta.callback(model, meta, viewInfo)
        } else {
            viewInfo.get$View().openForAdd();
        }
    }

}
// 编辑按钮点击回调
callbackMaps[FunMetaMaps.Edit] = (meta, viewInfo) => {
    meta.props.onClick = (row) => {
        if(meta.callback instanceof Function) {
            meta.callback(row, meta)
        } else {
            let data = {};
            let rowKey = viewInfo.get$View().getRowKey();
            data[rowKey] = row[rowKey];
            viewInfo.get$View().openForEdit(meta.url, data)
        }
    }
}
// 重置按钮点击回调
callbackMaps[FunMetaMaps.Reset] = (meta, viewInfo, type) => {
    meta.props.onClick = (event) => {
        if(meta.callback instanceof Function) {
            let model = null;
            if(type == 'search') {
                model = viewInfo.get$View().getSearchContext().getModel();
            } else {
                model = viewInfo.get$View().getEditContext().getModel();
            }

            meta.callback(model, meta, viewInfo)
        } else {
            if(type == 'search') {
                viewInfo.get$View().resetSearchModel();
                // 重新加载表数据
                let viewMeta = viewInfo.getSearchFunMeta(FunMetaMaps.View);
                viewInfo.get$View().query(viewMeta.url);
            } else {
                viewInfo.get$View().resetEditModel();
            }
        }
    }
}
// 删除按钮点击回调
callbackMaps[FunMetaMaps.Del] = (meta, viewInfo, type) => {
    meta.props.onClick = (model) => {
        if(meta.callback instanceof Function) {
            meta.callback(model, meta);
        } else {
            if(type == 'search') {
                viewInfo.get$View().batchDel(meta.url).then(resp=>{
                    viewInfo.get$View().query();
                });
            } else if(type == 'table') {
                let rowKey = viewInfo.get$View().getRowKey();
                let data = [model[rowKey]];
                viewInfo.get$View().del(meta.url, data).then(resp=>{
                    viewInfo.get$View().query();
                })
            }
        }
    }
}
// 文件导入导出功能
callbackMaps[FunMetaMaps.Import] = (meta, viewInfo) => {
    meta.props.onClick = (model) => {
        meta.callback(model, meta, viewInfo);
    }
}
// 表格的展开和折叠功能
callbackMaps[FunMetaMaps.Expanded] = (meta, viewInfo) => {
    meta.props.onClick = (model) => {
        if(meta.callback instanceof Function) {
            meta.callback(model, meta, viewInfo);
        } else {
            // 图标旋转
            if(meta.props.rotate == 90) {
                meta.props.rotate = 270;
            } else {
                meta.props.rotate = 90;
            }

            viewInfo.get$View().expanded();
        }
    }
}

callbackMaps[FunMetaMaps.__Default] = (meta, viewInfo) => {
    meta.props.onClick = (model) => {
        if(meta.callback instanceof Function) {
            meta.callback(model, meta, viewInfo);
        }
    }
}

function initMetaCallback(meta, viewInfo, type) {
    let callback = callbackMaps[meta.field]
        || callbackMaps[FunMetaMaps.__Default];

    callback(meta, viewInfo, type);
}

export {buildModelFromMetas, cloneModel, createMetasMap, getMetaValue,TypeMethodMaps, FunMetaMaps
    , setMetaValue, createFormMetaInfo, getMetaByProp, clone, MetaConst, mergeMetaOfDefault, initMetaCallback}
