import {computed, defineComponent, inject, mergeProps, reactive} from "vue";
import {RowContextKey} from "@/utils/ProvideKeys";
import ACol from "ant-design-vue/es/grid/Col";

export default defineComponent({
    props: ['name', 'label', 'labelCol', 'wrapperCol', 'colon', 'extra', 'hasFeedback'
        , 'help', 'labelAlign', 'validateStatus', 'validateFirst', 'validateTrigger'
        , 'extra', 'autoLink', 'required', 'field', 'class', 'style'],
    data() {
        return {
            attrs: null,
            namePath: [],
            colConfig: inject(RowContextKey),
            formContext: inject('formContext'),
        }
    },
    created() {
        if(this.$attrs.span) { // 以span为主
            this.colConfig = {span: this.$attrs.span};
        }

        if(this.name) {
            if(!(this.name instanceof Array)) {
                console.warn(`[name]必须是数组或者用[field]替代[name]; :name="['${this.name}']`)
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
            Object.keys(ACol.props).forEach(key => {
                if(this.$attrs[key]) {
                    this.colConfig[key] = this.$attrs[key];
                }
            });

            return this.colConfig;
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
                    }, ...options, class: this.$props.class, style: this.$props.style}
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
