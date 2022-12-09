// 安装事件总线
import mitt from "mitt";
export const EventBus = new mitt();

export default {
    install(app) {
        app.config.globalProperties.$bus = EventBus;
    }
}