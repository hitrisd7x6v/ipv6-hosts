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
            console.log(this)
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

export {buildModelFromMetas, cloneModel, createMetasMap, getMetaValue
    , setMetaValue, createFormMetaInfo, getMetaByProp}
