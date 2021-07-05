import Qs from 'qs'
import moment from 'moment'
import log from './logger.utils'
const Utils = {
    isDate (type) {
        return type && (type === 'date' || type === 'month' || type === 'week' || type === 'dateRange')
    },
    isObject (val) {
        return val != null && typeof val === 'object' && Array.isArray(val) === false
    },
    isArray (val) {
        return Array.isArray(val)
    },
    /**
     * resolveType 字符串类型：元数据解析标记可选值：1(common) 2(form) 3(table) 12(form 和 common) 13(common和table) 23(table和form) 123(所有都初始化)
     */
    /**
     * 是否已经做了表单解析
     * @param meta
     */
    isResolveForm (meta) {
        if (!meta['resolveType']) return false
        return meta['resolveType'].indexOf('2') !== -1
    },
    /**
     * 是否已经做了common的解析
     * @param meta
     */
    isResolveCommon (meta) {
        if (!meta['resolveType']) return false
        return meta['resolveType'].indexOf('1') !== -1
    },
    /**
     * 是否已经做了table的解析
     * @param meta
     */
    isResolveTable (meta) {
        if (!meta['resolveType']) return false
        return meta['resolveType'].indexOf('3') !== -1
    },
    //转成驼峰写法
    toHump(name) {
        return name.replace(/_(\w)/g, (all, letter)=>letter.toUpperCase());
    },
    /**
     * 深度设置字段的值：e.g key=a.b model={a: null} value=3 => model={a: {b: 3}}
     * @param key a || a.b.c
     * @param value
     */
    deepSetValue (key, value, model) {
        let split = key.split('.');
        let length = split.length;
        if(length && length == 1) return model[key] = value;

        let temp = model;
        for(let i=0; i<length; i++) {
            if(i === length -1) {
                temp[split[i]] = value; break;
            } else {
                temp = model[split[i]] || {};
                model[split[i]] = temp;
            }
        }
    },
    /**
     * 首字母大写
     * @param str
     * @returns {string}
     */
    firstUpperCase (str) {
        if (!str) return ''
        return str.toLowerCase().replace(/\b([\w|']+)\b/g, function (word) {
            return word.replace(word.charAt(0), word.charAt(0).toUpperCase())
        })
    },
    /**
     * 截取去除查询参数的地址
     * @param url
     */
    getUrlNotParam (url) {
        if (!url) return log.warningLog('页缓存url不存在', '请使用正确的地址')
        let indexOf = url.indexOf('?')
        return indexOf === -1 ? url : url.substring(0, indexOf)
    },
    /**
     * 返回url参数对象
     */
    getUrlParam (url) {
        if (Utils.isNotBlank(url)) {
            let indexOf = url.indexOf('?')
            if (indexOf === -1) return {}
            let s = url.substring(indexOf)
            if (Utils.isNotBlank(s)) return Qs.parse(s, {ignoreQueryPrefix: true})
            else return {}
        } else {
            return {}
        }
    },
    /**
     * 返回一个对象, 包含url的uri部分和参数部分
     * @param url
     * @returns {{params: {}, uri: *}|{params: {}, uri: string}|{}}
     */
    resolverUrl (url) {
        if(Utils.isNotBlank(url)) {
            let indexOf = url.indexOf('?')
            if(indexOf !== -1) {
                let uri = url.substring(0, indexOf);
                let params  = Qs.parse(url.substring(indexOf), {ignoreQueryPrefix: true});
                return {uri, params}
            } else {
                return {uri: url, params: {}}
            }
        } else {
            return {}
        }
    },
    getPromiseResolve (resp) {
        return resp ? {success: resp.success, fail: resp.fail, tipTitle: resp.tipTitle, tipContent: resp.tipContent}
            : {success: null, fail: null, tipTitle: null, tipContent: null}
    },
    /**
     * 删除数组元数
     * @param arr
     * @param del
     * @param key
     */
    delArrayEle (arr, del, key) {
        if (this.isBlank(arr) || this.isBlank(del)) return
        if (Utils.isObject(del)) {
            for (let i = 0; i < arr.length; i++) {
                if (del === arr[i]) {
                    return arr.splice(i, 1)
                }
            }
        } else if (key) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i][key] === del) {
                    let ts = arr.splice(i, 1)
                    return ts[0]
                }
                if (del === arr[i]) {
                    return arr.splice(i, 1)
                }
            }
        } else {
            for (let i = 0; i < arr.length; i++) {
                if (del === arr[i]) {
                    return arr.splice(i, 1)
                }
            }
        }
    },
    /**
     * 判断是否为空
     * @param obj 字符串、数组、对象
     */
    isBlank: function (obj) {
        if (obj == null) return true
        if (Utils.isObject(obj)) {
            return Object.keys(obj).length === 0
        } else if (Utils.isArray(obj)) {
            return obj.length === 0
        } else if (typeof obj === 'string') {
            return obj.trim().length === 0
        } else {
            return obj === 0
        }
    },
    /**
     * 判断各类对象不为空
     * @param obj 字符串、数组、对象
     * @returns {boolean}
     */
    isNotBlank (obj) {
        return !Utils.isBlank(obj)
    },
    assignVueProperty (ori, target, vue) {
        if (!ori || !vue) return
        if (!target) return ori

        Object.keys(target).forEach(key => {
            if (Utils.isArray(target[key])) {
                vue.$set(ori, key, [...target[key]])
            } else if (moment.isMoment(target[key])) {
                vue.$set(ori, key, moment(target[key]))
            } else if (Utils.isObject(target[key])) {
                if (!ori[key]) { // 原对象不存在赋值新的空对象
                    vue.$set(ori, key, {})
                }
                this.assignVueProperty(ori[key], target[key], vue)
            } else {
                vue.$set(ori, key, target[key])
            }
        })
        return ori
    },
    assignProperty (ori, target) {
        if (!ori) return
        if (!target) return ori

        Object.keys(target).forEach(key => {
            if (Utils.isArray(target[key])) {
                ori[key] = [...target[key]]
            } else if (moment.isMoment(target[key])) {
                ori[key] = moment(target[key])
            } else if (Utils.isObject(target[key])) {
                if (!ori[key]) { // 源对象不存在赋值空对象
                    ori[key] = {}
                }
                Utils.assignProperty(ori[key], target[key])
            } else {
                ori[key] = target[key]
            }
        });
        return ori
    },
    clone(ori) {
        if(!ori) return null;
        let _this = this;
        function doClone(origin) {
            if(_this.isObject(origin)) {
                let retObj = {};
                Object.keys(origin).forEach(key=>{
                    let value = origin[key];
                    if(_this.isObject(value)) {
                        if(moment.isMoment(value)) {
                            retObj[key] = value;
                        } else {
                            retObj[key] = doClone(value);
                        }
                    } else if(_this.isArray(value)) {
                        retObj[key] = doClone(value);
                    } else {
                        retObj[key] = value;
                    }
                });
                return retObj;
            } else if(_this.isArray(origin)) {
                let retArr = [];
                origin.forEach(item=>{
                    retArr.push(doClone(item));
                })
                return retArr;
            } else {
                return origin;
            }
        }
        return doClone(ori);
    },
    /**
     * 合并默认的对象
     *  如果ori的值存在则不覆写
     *  如果ori值不存在则合并target的值
     *  如果是嵌套对象, 则嵌套覆写
     * @param ori
     * @param target
     * @param _this
     */
    mergeObject (ori, target) {
        if (!ori || !target) return

        Object.keys(target).forEach((item) => {
            if (ori[item] === undefined) { // 源不存在直接合并
                if (typeof target[item] === 'function') {
                    ori[item] = target[item]
                } else if (Utils.isArray(target[item])) {
                    ori[item] = [...target[item]]
                } else if (Utils.isObject(target[item])) {
                    if(moment.isMoment(target[item])) {
                        ori[item] = target[item];
                    } else {
                        ori[item] = Object.assign({}, target[item])
                    }
                } else {
                    ori[item] = target[item]
                }
            } else { // 源存在, 判断源是否是对象, 是对象则继续合并
                if (this.isArray(ori[item])) {

                } else if (Utils.isObject(ori[item])) {
                    if(moment.isMoment(target[item])) {
                        ori[item] = target[item];
                    } else {
                        this.mergeObject(ori[item], target[item])
                    }
                }
            }
        })
    },
    isIe() {
        let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
        let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        return isIE || isIE11;
    },
    /*
    *  无任何功能的函数
    */
    VoidFunction () {},
    /**
     * 作为标记函数使用
     * @constructor
     */
    FlagFunction () {},

    resolverSearchModel(searchModel) {
        if(!this.isObject(searchModel)) return searchModel;
        let returnModel = {};
        Object.keys(searchModel).forEach(key=>{
            let value = searchModel[key];
            if(moment.isMoment(value)) {
                returnModel[key] = value.format("YYYY-MM-DD HH:mm:ss");
            } else {
                returnModel[key] = value;
            }
        });
        return returnModel;
    }
}

export default Utils
