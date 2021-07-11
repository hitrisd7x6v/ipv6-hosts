/* 日志工具类 */
const Logger = {
    getLogContent (prefix, title, desc, arg) {
        arg = arg || {};
        switch (prefix) {
            case 'debug': return `--debug ${title} - 描述：${desc} - 参数：${JSON.stringify(arg)}`;
            case 'info': return `--info ${title} - 描述：${desc} - 参数：${JSON.stringify(arg)}`;
            case 'warning' : return `--warning ${title} - 修改方案：${desc} - 参数：${JSON.stringify(arg)}`;
            case 'error': return `--error ${title} - 解决方案：${desc} - 参数：${JSON.stringify(arg)}`;
        }
    },
    debugLog (title, desc, arg) {
        if(this.isDebug())
            console.debug(this.getLogContent('debug', title, desc, arg));
    },
    /* 日志 */
    infoLog (title, desc, arg) {
        console.log(this.getLogContent('info', title, desc, arg));
    },

    errorLog (title, desc, arg) {
        console.error(this.getLogContent('error', title, desc, arg));
        throw new Error(title)
    },
    errorNELog(title, desc, arg) {
        console.error(this.getLogContent('error', title, desc, arg));
    },
    warningLog (title, desc, arg) {
        console.warn(this.getLogContent('warning', title, desc, arg))
    },
    isDebug() {
        // let env = window.CacheApi || window.CacheApi.env;
        // if(env) {
        //     let profiles = env['profiles'];
        //     return profiles ? profiles.includes['dev'] : false;
        // } else {
        //     return true;
        // }
        return true;
    }
}

export default Logger
