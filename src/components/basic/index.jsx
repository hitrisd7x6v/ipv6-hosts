import {defineComponent, mergeProps, provide} from "vue";
import {RowContextKey} from "@/utils/ProvideKeys";

export const IvzRow = defineComponent({
    name: 'IvzRow',
    props: ['span'],
    setup(props) {
        provide(RowContextKey, {
            span: props.span
        })
    },
    render() {
        return <a-row {...this.$attrs} v-slots={this.$slots} />
    }
})

const colorMaps = {
    add: '#2db7f5', del: '#f50', edit: '#3b5999', query: '#108ee9', import: 'default'
    , export: 'orange',cancel: 'red', detail: '#87d068', reset: 'warning', def: 'default'
}
export const IvzFuncTag = defineComponent({
    name: 'IvzFuncTag',
    props: {
        type: {type: String, default: 'def'}, // add, del, edit, query, import, export, cancel, detail, reset
        color: String,
        data: {type: Object}, // 行数据
        disabled: {type: Boolean, default: false}, // 是否禁用
    },
    render() {
        let disabledClass = this.disabled ? 'ivz-func-disabled' : 'ivz-func-tag'
        let color = this.color || colorMaps[this.type];
        return <a-tag closable={false} visible={true} class={disabledClass} {...this.$attrs}
           class="ivz-func" color={color} v-slots={this.$slots} onClick={this.clickHandle} />
    },
    methods: {
        clickHandle() {
            this.$emit('handle', this.data);
        }
    }
})
const typeMaps = {
    ADD: {type: 'dashed'},
    DEL: {danger: true},
    EDIT: {type: '#3b5999'},
    QUERY: {type: 'primary'},
    IMPORT: {type: 'default'},
    EXPORT: 'orange',
    CANCEL: {type: 'default'},
    DETAIL: {type: '#87d068'},
    RESET: {type: 'primary', ghost: true},
    DEFAULT: {type: 'default'},
    SUBMIT: {type: 'primary'}
}

export const IvzFuncBtn = defineComponent({
    name: 'IvzFuncBtn',
    props: {
        meta: {type: Object, default: function () { return {} }},
        func: {type: String, default: 'default'},  // add, del, edit, query, import, export, cancel, detail, reset
    },
    computed: {
        typeCompute() {
            return this.func.toUpperCase();
        }
    },
    render() {
        let type = typeMaps[this.typeCompute];
        let props = mergeProps(type, this.meta.props, this.$attrs);
        return <a-button {...props} v-slots={this.$slots} style="margin: 0px 3px"></a-button>
    },
    methods: {

    }
})

export default {
    install(app) {
        app.component(IvzRow.name, IvzRow)
        app.component(IvzFuncBtn.name, IvzFuncBtn)
        app.component(IvzFuncTag.name, IvzFuncTag)
    }
}