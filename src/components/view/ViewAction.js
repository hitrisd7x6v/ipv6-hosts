import {GET, POST} from "@/utils/request";
import {FunMetaMaps} from "@/utils/MetaUtils";
function Unmount() {

}

function defaultAddCall({resp, context}) {

}

function Config(method, postCall) {
    this.url = url;
    this.data = data;
    this.preCall = (model, parent, context) => true;
    this.method = method;
    this.postCall = postCall;
    this.errorCall = (reason, context) => {
        console.error(`请求[${this.url}]失败[${reason}]`)
    }
}

function ConfigChain(config) {

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

    this.POST = function () {
        this.getConfig().method = POST;
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
        return this;
    }

}
function SearchConfig() {
    this.AddConfig = new ConfigChain(new Config(POST, defaultAddCall))
    this.DelConfig = new ConfigChain(new Config(POST))
    this.EditConfig = new ConfigChain(new Config(GET))
    this.QueryConfig = new ConfigChain(new Config(GET))
    this.ResetConfig= new ConfigChain(new Config())
    this.ImportConfig = new ConfigChain(new Config(POST))
    this.ExportConfig = new ConfigChain(new Config(POST))

    /**
     * id用来作为整个试图的唯一id
     * 1. 可以用来区分是新增还是修改
     * 2. 可以作为table组件的rowKey
     * @param id
     */
    this.setId = function (id) {
        this.id = id;
        return this;
    }

    /**
     * 此动作将打开编辑表单
     * @param url 作为提交的地址
     * @returns {ConfigChain}
     * @constructor
     */
    this.add = function (url) {
        this.AddConfig.getConfig().url = url;
        return this.AddConfig;
    }

    /**
     * 删除
     * @param url 删除地址
     * @returns {ConfigChain}
     * @constructor
     */
    this.del = function (url) {
        this.DelConfig.getConfig().url = url;
        return this.DelConfig;
    }

    /**
     * 编辑表单 此动作将打开编辑表单
     * @param url 此url作为获取编辑记录的地址和提交编辑的地址
     * @returns {ConfigChain}
     * @constructor
     */
    this.edit = function (url) {
        this.EditConfig.getConfig().url = url;
        return this.EditConfig;
    }

    /**
     * 搜索栏查询功能
     * @param url 查询数据地址
     * @returns {ConfigChain}
     * @constructor
     */
    this.query = function (url) {
        this.QueryConfig.getConfig().url = url;
        return this.QueryConfig;
    }

    /**
     * 导入
     * @param url
     * @returns {ConfigChain}
     * @constructor
     */
    this.import = function (url) {
        this.ImportConfig.getConfig().url = url;
        return this.ImportConfig;
    }

    /**
     * 导出
     * @param url
     * @returns {ConfigChain}
     * @constructor
     */
    this.export = function (url) {
        this.ExportConfig.getConfig().url = url;
        return this.ExportConfig;
    }

    /**
     * 重置编辑表单
     * @returns {ConfigChain}
     * @constructor
     */
    this.reset = function () {
        return this.ResetConfig;
    }
}
function ViewConfig(view) {

    this.id = "id";
    this.AddConfig = new ConfigChain(new Config(POST, defaultAddCall))
    this.DelConfig = new ConfigChain(new Config(POST))
    this.EditConfig = new ConfigChain(new Config(GET))
    this.QueryConfig = new ConfigChain(new Config(GET))
    this.ResetConfig= new ConfigChain(new Config())
    this.DetailConfig = new ConfigChain(new Config(GET))
    this.ImportConfig = new ConfigChain(new Config(POST))
    this.ExportConfig = new ConfigChain(new Config(POST))
    this.CancelConfig = new ConfigChain(new Config())
    this.SubmitConfig = new ConfigChain(new Config())

    /**
     * id用来作为整个试图的唯一id
     * 1. 可以用来区分是新增还是修改
     * 2. 可以作为table组件的rowKey
     * @param id
     */
    this.setId = function (id) {
        this.id = id;
        return this;
    }

    /**
     * 此动作将打开编辑表单
     * @param url 作为提交的地址
     * @returns {ConfigChain}
     * @constructor
     */
    this.add = function (url) {
        this.AddConfig.getConfig().url = url;
        return this.AddConfig;
    }

    /**
     * 删除
     * @param url 删除地址
     * @returns {ConfigChain}
     * @constructor
     */
    this.del = function (url) {
        this.DelConfig.getConfig().url = url;
        return this.DelConfig;
    }

    /**
     * 编辑表单 此动作将打开编辑表单
     * @param url 此url作为获取编辑记录的地址和提交编辑的地址
     * @returns {ConfigChain}
     * @constructor
     */
    this.edit = function (url) {
        this.EditConfig.getConfig().url = url;
        return this.EditConfig;
    }

    /**
     * 搜索栏查询功能
     * @param url 查询数据地址
     * @returns {ConfigChain}
     * @constructor
     */
    this.query = function (url) {
        this.QueryConfig.getConfig().url = url;
        return this.QueryConfig;
    }

    /**
     * 导入
     * @param url
     * @returns {ConfigChain}
     * @constructor
     */
    this.import = function (url) {
        this.ImportConfig.getConfig().url = url;
        return this.ImportConfig;
    }

    /**
     * 导出
     * @param url
     * @returns {ConfigChain}
     * @constructor
     */
    this.export = function (url) {
        this.ExportConfig.getConfig().url = url;
        return this.ExportConfig;
    }

    /**
     * 取消表单编辑
     * @returns {ConfigChain}
     * @constructor
     */
    this.cancel = function () {
        return this.CancelConfig;
    }

    /**
     * 重置编辑表单
     * @returns {ConfigChain}
     * @constructor
     */
    this.reset = function () {
        return this.ResetConfig;
    }

    /**
     * 提交编辑表单
     * @see Add 使用此url作为新增的地址
     * @see Edit 使用此url作为编辑的地址
     * @returns {ConfigChain}
     * @constructor
     */
    this.submit = function () {
        return this.SubmitConfig;
    }

    /**
     *  打开一个详情页面
     * @param url 获取详情也数据地址
     * @returns {ConfigChain}
     * @constructor
     */
    this.detail = function (url) {
        this.DetailConfig.getConfig().url = url;
        return this.DetailConfig;
    }
}

/**
 * 执行动作
 * @param config
 */
function exec(config, context) {
    let isRequest = config.preCall() == false ? false : true;

    if(isRequest) {
        config.method(config.url, config.data, null).then(resp => {
            if(config.postCall instanceof Function) {
                config.postCall({resp, context});
            }

            return resp;
        }).catch(reason => {
            if(config.errorCall instanceof Function) {
                config.errorCall(reason);
            }
        })
    }
}
export function ViewAction($view) {
    const config = $view.config;
    const content = $view.context;

    this.execAdd = function () {
        exec(config.AddConfig, context)
    }

    this.execDel = function () {
        exec(config.DelConfig, context)
    }

    this.query = function () {
        exec(config.QueryConfig, context)
    }


}

export function $View() {

    this.context = new ViewContext();
    this.config = new ViewConfig(this)
    this.actions = new ViewAction(this);

    this.getSearchContext = function () {
        return this.context.searchContext;
    }

    this.getEditContext = function () {
        return this.context.editContext;
    }

    this.getTableContext = function () {
        return this.context.tableContext;
    }

    this.getDetailContext = function () {
        return this.context.detailContext;
    }
}


/**
 * 主搜索栏上下文
 * @constructor
 */
function SearchContext() {
    this.getModel = Unmount;
    this.resetModel = Unmount;

    this.config = function () {
        // this.
    }
}
function EditContext() {
    this.getModel = Unmount;
    this.resetModel = Unmount;
}
export function ViewContext () {
    this.editContext = new EditContext();
    this.tableContext = null;
    this.detailContext = null;
    this.searchContext = new SearchContext();
}