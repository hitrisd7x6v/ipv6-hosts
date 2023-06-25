import {computed, defineComponent, inject, mergeProps, reactive} from "vue";
import {RowContextKey} from "@/utils/ProvideKeys";
import ACol from "ant-design-vue/es/grid/Col";
import AFormItem from 'ant-design-vue/es/form/FormItem'
export default defineComponent({
    props: ['name', 'label', 'labelCol', 'wrapperCol', 'colon', 'extra', 'hasFeedback'
        , 'help', 'labelAlign', 'validateStatus', 'validateFirst', 'validateTrigger'
        , 'extra', 'autoLink', 'required', 'field', 'class', 'style'],
    data() {
        return {
            meta: {},
            attrs: null,
            namePath: [],
            realSpan: null,
            formContext: inject('formContext'),
        }
    },
    created() {
        let rowContext = inject(RowContextKey);
        this.realSpan = this.span || rowContext.span;

        if(this.name) {
            if(!(this.name instanceof Array)) {
                console.warn(`[name]必须是数组或者用[field]替代[name]; 正确用法 :name="['${this.name}']`)
            } else {
                this.namePath = this.name;
            }
        } else if(this.field){
            this.namePath = this.field.split('.');
        } else {
            return console.warn(`表单组件未设置属性[field or name]`)
        }

        if(this.formContext && this.namePath && this.namePath.length > 0) {
            let initModel = inject('initModel');
            let defaultValue = this.$attrs.defaultValue;
            initModel(this.namePath, this.getDefaultValue(defaultValue));
        }
    },
    methods: {
        getDefaultValue(defaultValue) {
            return defaultValue != undefined ? defaultValue : null;
        },
        getFormItemProps() {
            return {...this.$props, name: this.namePath, style: null, class: null}
        },
        getColProps() {
            let colProps = {span: this.realSpan};
            Object.keys(ACol.props).forEach(key => {
                if(this.$props[key]) {
                    colProps[key] = this.$props[key];
                }
            });

            return colProps;
        },
        getFormAttrs(options) {
            if(this.attrs) {
                return mergeProps(this.attrs, this.$attrs, options);
            }

            this.attrs = this.$attrs;
            if(this.formContext && !this.attrs['onUpdate:value']) {
                let value = computed(() => this.formContext.getFieldValue(this.namePath));
                this.attrs = {...this.$attrs, value: value, 'onUpdate:value': (val) => {
                        this.formContext.setFieldValue(this.namePath, val);
                    }, ...options}
            }

            return this.attrs;
        },
        getCheckedAttrs() {
            if(this.attrs) {
                return this.attrs;
            }

            this.attrs = this.$attrs;
            let value = computed(() => this.formContext.getFieldValue(this.namePath));
            if(this.formContext && !this.attrs['onUpdate:checked']) {
                this.attrs = reactive(mergeProps(this.$attrs, {
                    checked: value, 'onUpdate:checked': (val) => {
                        this.formContext.setFieldValue(this.namePath, val);
                    }
                }));
            }

            return this.attrs;
        }
    }
})
