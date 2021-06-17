/* 消息工具类 */
/* 创建一个空Vue对象, 用于处理全局提醒、通知等 */
import Vue from 'vue'
import {message, notification} from 'ant-design-vue'
Vue.prototype.$message = message
Vue.prototype.$notification = notification
let VoidFun = () => {}
const respTitle = '数据操作通知'
const messageVue = new Vue()
/* 通知全局配置 */
messageVue.$notification.config({
    top: '10px', // 消息从顶部弹出时，距离顶部的位置，单位像素。
    bottom: '30px', // 消息从底部弹出时，距离底部的位置，单位像素
    duration: 4.5, // 多少秒后关闭 配置为 null 则不自动关闭
    placement: 'topRight'
    // getContainer: messageVue.$getModalContainer()

})
messageVue.$message.config({
    top: '24px', // 消息距离顶部的位置
    duration: 4.5, // 延迟2秒关闭
    maxCount: 3 // 最大显示数, 超过限制时，最早的消息会被自动关闭
})
export default {
    notifyMsg (type, message) {
        switch (type) {
            case 'success': return message || '操作成功'
            case 'error': return message || '操作失败'
            case 'warn': return message || '操作警告'
        }
    },
    errorMessage (desc, duration, onClose) {
        return messageVue.$message.error(desc, duration, onClose)
    },
    warningMessage (desc, duration, onClose) {
        return messageVue.$message.warn(desc, duration, onClose)
    },
    successMessage (desc, duration, onClose) {
        return messageVue.$message.success(desc, duration, onClose)
    },

    successNotify (title, content, options) {
        messageVue.$notification.success({
            message: title,
            description: this.notifyMsg('success', content)
        })
    },

    errorNotify (title, content, options) {
        let notifyMsg = this.notifyMsg('error', content)
        messageVue.$notification.error({
            message: title,
            description: notifyMsg.toString()
        })
    },

    warningNotify (title, content, options) {
        messageVue.$notification.warning({
            message: title,
            description: this.notifyMsg('warn', content)
        })
    },

    confirm (title, content, options) {
        return new Promise((resolve, reject) => {
            messageVue.$confirm({
                    title: title,
                    content: content,
                    onOk () {
                        resolve()
                    },
                    onCancel () {
                        reject(new Error())
                    },
                    getContainer: messageVue.$getModalContainer
                })
        })
    },
    /**
     * @param resolve 回调函数传入的参数对象
     * @param resp  服务器响应的对象
     * @param vue   当前操作的vue对象
     * @param model 提交给服务器的数据
     * @param title
     * @param content
     * @param callBack
     */
    responseSuccessNotify (resolve, resp, vue, model, title, content, callBack) {
        if (typeof resolve.success === 'function') {
            resolve.success({model: model, resp: resp, vue: vue})
        } else {
            callBack()
            this.successNotify(title || respTitle, content)
        }
    },
    responseFailNotify (resolve, reason, vue, model, title, callBack) {
        if (typeof resolve.fail === 'function') {
            resolve.fail({model: model, resp: reason, vue: vue})
        } else {
            callBack()
            this.errorNotify(title || respTitle, reason)
        }
    },
    delFailNotify (resolve, resp, vue, model, callBack) {
        this.responseFailNotify(resolve, resp, vue, model
            , '删除操作提示', '删除失败', callBack || VoidFun)
    },
    delSuccessNotify (resolve, resp, vue, model, callBack) {
        this.responseSuccessNotify(resolve, resp, vue, model
            , '删除操作提示', resp['IzMsg'] || '删除成功', callBack || VoidFun)
    },
    submitFailNotify (resolve, resp, vue, model, callBack) {
        this.responseFailNotify(resolve, resp, vue, model
            , '提交操作提示', '提交失败', callBack || VoidFun)
    },
    submitSuccessNotify (resolve, resp, vue, model, callBack) {
        this.responseSuccessNotify(resolve, resp, vue, model
            , '提交操作提示', resp['IzMsg'] || '提交成功', callBack || VoidFun)
    },
    defaultFailNotify (resolve, resp, vue, model, callBack) {
        this.responseFailNotify(resolve, resp, vue, model
            , '操作失败提示', resp, callBack || VoidFun)
    },
    defaultSuccessNotify (resolve, resp, vue, model, callBack) {
        this.responseSuccessNotify(resolve, resp, vue, model
            , '操作成功提示', resp['IzMsg'], callBack || VoidFun)
    }
}
