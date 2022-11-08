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
    ADD: '#2db7f5', DEL: '#f50', EDIT: '#3b5999', QUERY: '#108ee9', IMPORT: 'default'
    , EXPORT: 'orange',CANCEL: 'red', DETAIL: '#87d068', RESET: 'warning', DEF: 'default'
    , SUBMIT: 'blue'
}
export const IvzFuncTag = defineComponent({
    name: 'IvzFuncTag',
    props: {
        func: {type: String, default: 'def'}, // add, del, edit, query, import, export, cancel, detail, reset
        color: String,
        data: {type: Object}, // 行数据
        disabled: Function, // 是否禁用
    },
    computed: {
      tagColor() {
          let upperCase = this.func.toUpperCase();
          return this.color || colorMaps[upperCase]
      },
        tagDisabled() {
            return this.disabled != null ? this.disabled(this.data) : false;
        }
    },
    render() {
        let disabledClass = this.tagDisabled ? 'ivz-func-disabled' : 'ivz-func-tag'
        return <a-tag closable={false} visible={true} class={disabledClass} {...this.$attrs}
           class="ivz-func" color={this.tagColor} v-slots={this.$slots} onClick={this.clickHandle} />
    },
    methods: {
        clickHandle() {
            if(!this.tagDisabled) {
                this.$emit('handle', this.data);
            }
        }
    }
})
const typeMaps = {
    ADD: {type: 'dashed'},
    DEL: {danger: true},
    EDIT: {type: '#3b5999'},
    VIEW: {type: 'primary'},
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
