import {GET, POST} from "@/utils/request";
import {FormContext} from "@/components/form/basic/FormContext";
import {confirm, msgError, msgSuccess} from "@/utils/message";
import {TypeMethodMaps} from "@/utils/MetaUtils";

function Unmount() {

}
function NullData() {
    return null;
}
function Config(url, postCall, method) {
    this.url = url;
    this.http = null; // http配置
    this.preCall = (model, parent, context) => true;
    this.method = method;
    this.postCall = postCall;
    this.errorCall = ({reason, context}) => {
        console.error(`请求地址[${this.url}]失败[${reason}]`)
    }
}

function ConfigChain(config, context, getDataCall) {

    this.getData = getDataCall || NullData;

    this.getConfig = function () {
        return config;
    }

    this.preHandle = function (callback) {
        config.preCall = callback;
        return this;
    }

    this.postHandle = function (callback) {
        config.postCall = callback;
        return this;
    }

    this.errorHandle = function (callback) {
        config.errorCall = callback;
        return this;
    }

    this.POST = function (httpConfig) {
        this.getConfig().method = POST;
        this.getConfig().http = httpConfig;
        return this;
    }

    /**
     * 设置请求方法
     * @param httpConfig axios 请求配置
     * @returns {ConfigChain}
     * @constructor
     */
    this.GET = function (httpConfig) {
        this.getConfig().method = GET;
        this.getConfig().http = httpConfig;
        return this;
    }

    /**
     * 执行动作 add、del、edit、query、...
     */
    this.exec = function () {
        try {
            let data = this.getData();
            let isRequest = config.preCall({data, context}) == false ? false : true;

            if (isRequest) {
                // 调用http请求
                if (config.method) {
                    config.method(config.url, config.data, config.http)
                        .then(resp => {
                        config.postCall({resp, context});
                    }).catch(reason => {
                        config.errorCall({reason, context});
                    })
                } else { // 直接调用postCall方法
                    let resp = null;
                    config.postCall({resp, context});
                }
            }
        } catch (e) {
            config.errorCall({e, context});
        }
    }
}

export function $View(context) {

    this.context = context;
    this.context['__this'] = this;

    /**
     * 打开编辑框
     * @param callback 用来对数据进行处理
     */
    this.add = function (callback) {
        let editContext = this.getEditContext();

        if(editContext['isPrimary']) {
            let initModel = editContext.getFormContext().getInitModel();
            editContext.asyncVisible().then((model) => {
                if(callback instanceof Function) {
                    callback(initModel);
                }

                editContext.getFormContext().setEditModel(initModel);
            })
        } else {
            console.warn('未声明标记为[primary]的编辑组件')
        }
    }

    /**
     * 删除指定记录
     * @param url 删除地址
     * @param data 删除的数据
     * @param confirmTitle 确认标题
     * @param confirmContext 确认内容
     */
    this.del = function (url, data, confirmTitle, confirmContext) {
        if(!url || !data) {
            return console.error("未指定删除的地址[url]或者删除的记录[data]")
        }

        let title = confirmTitle || "删除确认";
        let context = confirmContext || "确定删除数据吗？"
        confirm({title, context
            , onOk: () => {
                TypeMethodMaps.Del(url, data).then(({code, message, data}) => {
                    if(code == 200) {
                        msgSuccess(message || "删除成功");
                    } else {
                        msgError(message);
                    }
                }).catch(reason => console.error(reason))
            }
        })
    }

    /**
     * 批量删除
     * 将获取表格选中的行作为数据
     * @param url 删除地址
     * @param confirmTitle 删除的确认标题
     * @param confirmContext 删除的确认内容
     */
    this.batchDel = function (url, confirmTitle, confirmContext) {
        if(!url) {
            return console.error("未指定删除的地址[url]")
        }

        let title = confirmTitle || "删除确认";
        let context = confirmContext || "确定批量删除数据吗？";

        let tableContext = this.getTableContext();
        if(!tableContext.isPrimary) {
            return console.warn("未声明标记为[primary]的表组件")
        }

        confirm({title, context, onOk: () => {
                TypeMethodMaps.Del(url, data).then(({code, message, data}) => {
                    if(code == 200) {
                        msgSuccess(message || "删除成功");
                    } else {
                        msgError(message);
                    }
                }).catch(reason => console.error(reason))
            }
        })
    }

    /**
     * 打开编辑框
     * url > data
     * @param url 编辑地址
     * @param data 编辑数据
     */
    this.edit = function (url, data) {
        if(!data && !url) {
            return console.error("未指定要编辑数据的[url or data]")
        }

        let editContext = this.getEditContext();

        if(editContext['isPrimary']) {
            if(url) {
                editContext.asyncVisible().then(() => {
                    editContext.setLoading(true);
                    TypeMethodMaps.Edit(url).then(({code, message, data}) => {
                        if(code == 200) {
                            editContext.getFormContext().setEditModel(data);
                        } else {
                            msgError(message);
                        }
                    }).finally(editContext.setLoading(false))
                })
            } else {
                editContext.asyncVisible().then(() => {
                    editContext.getFormContext().setEditModel(data);
                })
            }
        } else {
            console.warn('没有声明[primary]的编辑组件')
        }
    }

    /**
     * 查询数据
     * @param url 查询地址
     */
    this.query = function (url) {
        let searchContext = this.getSearchContext();
        if(!searchContext.isPrimary) {
            return console.warn("未声明标记为[primary]的搜索组件");
        }

        if(!url) {
            return console.error("未指定查询地址[url]")
        }

        let tableContext = this.getTableContext();
        if(!tableContext.isPrimary) {
            return console.warn("未声明标记为[primary]的表组件")
        }

        let model = searchContext.getModel();
        tableContext.setLoading(true);
        TypeMethodMaps.View(url, model).then(({code, message, data}) => {
            if(code == 200) {
                if(data instanceof Array){
                    tableContext.setDataSource(data)
                } else if(data instanceof Object) { // 需要分页
                    let {records, total} = data;

                    tableContext.setTotalRows(total);
                    tableContext.setDataSource(records)
                }
            } else {
                msgError(message)
            }
        }).finally(() => {
            tableContext.setLoading(false);
        })
    }

    /**
     * 隐藏编辑框
     */
    this.cancel = function () {
        let editContext = this.getEditContext();
        if(!editContext.isPrimary) {
            return console.warn("未声明标记为[primary]的编辑组件")
        }

        editContext.setVisible(false);
    }

    /**
     * 提交编辑表单
     * @param url 编辑地址
     * @param queryUrl 查询地址 提交成功后重新刷新列表
     */
    this.submit = function (url, queryUrl) {
        if(!url) {
            return console.error("未指定提交地址[url]")
        }

        let editContext = this.getEditContext();
        if(!editContext.isPrimary) {
            return console.warn("未声明标记为[primary]的编辑组件")
        }

        editContext.getFormContext().validate().then(() => {
            let model = editContext.getModel();
            editContext.setLoading(true);
            TypeMethodMaps.Submit(url, model).then(({code, message, data}) => {
                if(code == 200) {
                    msgSuccess("数据提交成功");
                    editContext.setVisible(false);
                    if(queryUrl) {
                        this.query(queryUrl);
                    }
                } else {
                    msgError(message);
                }

            }).finally(() => editContext.setLoading(false))
        }).catch(reason => {})

    }

    /**
     * 重置编辑表单
     */
    this.resetEditModel = function () {
        let editContext = this.getEditContext();
        if(!editContext.isPrimary) {
            return console.warn("未声明标记为[primary]的编辑组件")
        }

        editContext.getFormContext().resetFields();
    }

    /**
     * 重置搜索表单
     */
    this.resetSearchModel = function () {
        let searchContext = this.getSearchContext();
        if(!searchContext.isPrimary) {
            return console.warn("未声明标记为[primary]的搜索组件")
        }

        searchContext.getFormContext().resetFields();
    }

    // this.import = importAction;
    // this.export = exportAction;

    /**
     * @param id 元素的唯一id
     * @return {SearchContext|*}
     */
    this.getSearchContext = function (id) {
        if(id) {
            let context = this.context.getContextById(id)
            if(context) {
                return context;
            } else {
                return console.warn(`查找不到id=${id}的编辑上下文`)
            }
        }

        return this.context.primarySearchContext;
    }

    /**
     * @param id 元素的唯一id
     * @return {EditContext|*}
     */
    this.getEditContext = function (id) {
        if(id) {
            let contextById = this.context.getContextById(id);
            if(contextById) {
                return contextById;
            } else {
                return console.warn(`查找不到id=${id}的编辑上下文`)
            }
        }

        return this.context.primaryEditContext;
    }

    /**
     * @param id 元素的唯一id
     * @return {TableContext|*}
     */
    this.getTableContext = function (id) {
        if(id) {
            let contextById = this.context.getContextById(id);
            if(contextById) {
                return contextById;
            } else {
                return console.warn(`查找不到id=${id}的编辑上下文`)
            }
        }

        return this.context.primaryTableContext;
    }

    /**
     * @param id 元素的唯一id
     * @return {DetailContext|*}
     */
    this.getDetailContext = function (id) {
        if(id) {
            let contextById = this.context.getContextById(id);
            if(contextById) {
                return contextById;
            } else {
                return console.warn(`查找不到id=${id}的编辑上下文`)
            }
        }

        return this.context.primaryDetailContext;
    }

}

/**
 * 搜索栏
 * @param context 视图上下文
 * @constructor
 */
export function SearchContext(viewContext) {


    this.getModel = function () {
        if(this.getSearchModel) {
            return this.getSearchModel();
        }

        return console.warn('搜索组件未还未挂载')
    }

    this.getFormContext = () => new FormContext();

    this.get$View = function () {
        return viewContext['__this']
    }

    // 是否是主上下文
    this.isPrimary = false;
}

/**
 * 编辑
 * @param viewContext 视图上下文
 * @constructor
 */
export function EditContext(viewContext) {
    // 是否是主上下文
    this.isPrimary = false;

    this.getModel = function () {
        return this.getFormContext().getEditModel();
    }
    this.setModel = Unmount;

    this.reset = function () {
        this.getFormContext().resetFields();
    }

    this.submit = function (url) {

    }

    this.cancel = function () {
        this.setVisible(false);
    }

    this.setLoading = Unmount;
    this.setVisible = Unmount;

    this.asyncVisible = () => Promise.reject("未挂载");

    // 必须在相应的地方重新初始化
    // 表单上下文对象
    this.getFormContext = () => new FormContext();

    this.get$View = function () {
        return viewContext['__this']
    }
}

/**
 * 表格
 * @param viewContext 视图上下文
 * @constructor
 */
export function TableContext(viewContext) {
    this.getEditRow = Unmount;
    // 是否是主上下文
    this.isPrimary = false;

    this.del = function (url, data) {}

    this.get$View = function () {
        return viewContext['__this']
    }

    this.setLoading = null;
    // 设置数据源
    this.setDataSource = null;
}

/**
 * 详情
 * @param viewContext
 * @constructor
 */
export function DetailContext(viewContext) {
    // 是否是主上下文
    this.isPrimary = false;
    this.getViewContext = function () {
        return viewContext['__this']
    }
}
/**
 * 视图上下文
 * @constructor
 */
export function ViewContext () {
    this.IdContextMaps = {}

    this.primaryEditContext = new EditContext(this);
    this.primaryTableContext = new TableContext(this);
    this.primaryDetailContext = new DetailContext(this);
    this.primarySearchContext = new SearchContext(this);

    /**
     * 获取元数的id获取对应上下文
     * @param id
     * @return {*}
     */
    this.getContextById = function (id) {
        return this.IdContextMaps[id];
    }

    /**
     * 增加上下文
     * @param id
     * @param context
     */
    this.addContextById = function (id, context) {
        if(id && context) {
            if(!this.IdContextMaps[id]) {
                this.IdContextMaps[id] = context;
            } else {

            }
        } else {

        }
    }
}
