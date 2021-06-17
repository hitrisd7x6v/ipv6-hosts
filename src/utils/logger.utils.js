/* 日志工具类 */
const Logger = {
    getLogContent (prefix, title, desc, arg) {
        arg = arg || {};
        switch (prefix) {
            case 'info': return `${title} - 描述：${desc} - 参数：${JSON.stringify(arg)}`;
            case 'warning' : return `警告：${title} - 修改方案：${desc} - 参数：${JSON.stringify(arg)}`;
            case 'error': return `错误：${title} - 解决方案：${desc} - 参数：${JSON.stringify(arg)}`;
        }
    },

    /* 日志 */
    infoLog (title, desc, arg) {
        console.log(this.getLogContent('info', title, desc, arg))
    },

    errorLog (title, desc, arg) {
        console.error(this.getLogContent('error', title, desc, arg))
        throw new Error(title)
    },

    warningLog (title, desc, arg) {
        console.warn(this.getLogContent('warning', title, desc, arg))
    }
}

export default Logger
