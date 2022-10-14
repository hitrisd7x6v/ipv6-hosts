import {GET, POST} from "@/utils/request";
import {FunMetaMaps} from "@/utils/MetaUtils";

function query() {
    console.log(this)
}

function preCall(context) {

}
function ChainConfig(url, method, data) {
    this.url = url;
    this.data = data;
    this.preCall = null;
    this.method = method;
    this.postCall = null;
    this.errorCall = null;
}

function ViewBasicChain(config) {

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
        config.method = POST;
    }

    this.GET = function () {
        config.method = GET;
    }

    this.request = function () {
        let isRequest = true;
        if(config.preCall instanceof Function) {
            isRequest = config.preCall() == false ? false : true;
        }

        if(isRequest) {
            config.method(config.url, config.data, null).then(resp => {
                if(config.postCall instanceof Function) {
                    config.postCall(resp);
                }

                return resp;
            }).catch(reason => {
                if(config.errorCall instanceof Function) {
                    config.errorCall(reason);
                }
            })
        }
    }
}

export function ViewAction(viewContext) {

    this.Add = function (url) {
        let actionChain = viewContext[FunMetaMaps.Add];
        if(actionChain != null) {
            return actionChain;
        }

        let config = new ChainConfig(url, POST);
        return viewContext[FunMetaMaps.Add] = new ViewBasicChain(config)
    }

    this.ExecAdd = function () {
        let actionChain = viewContext[FunMetaMaps.Add];
        if(actionChain) {
            actionChain.request();
        } else {
            console.warn("未注册[新增]请求动作")
        }
    }

    this.Del = function () {

    }

    this.ExecDel = function () {

    }

    this.Query = function (url) {
        let actionChain = viewContext[FunMetaMaps.View];
        if(actionChain == null) {
            let config = new ChainConfig(url, GET);
            viewContext[FunMetaMaps.Add] =
                actionChain = new ViewBasicChain(config)
        }

        return actionChain;
    }

    this.ExecQuery = function () {
        let actionChain = viewContext[FunMetaMaps.View];
        if(actionChain) {
            actionChain.request();
        } else {
            console.warn("未注册查询请求处理器")
        }
    }
}
