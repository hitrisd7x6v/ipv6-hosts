import {default as Test} from '/src/components/Test.vue'
export {Test}
export default {
    install(app) {
        app.component("Test", Test);
    }
}
