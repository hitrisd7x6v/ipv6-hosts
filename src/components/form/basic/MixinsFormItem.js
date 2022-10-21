import {defineComponent, inject, mergeProps, reactive, computed} from "vue";
import {RowContextKey} from "@/utils/ProvideKeys";
const defOptions = {};
export default defineComponent({
    props: ['name', 'label', 'labelCol', 'wrapperCol', 'colon', 'extra', 'hasFeedback'
        , 'help', 'labelAlign', 'validateStatus', 'validateFirst', 'validateTrigger'
        , 'extra', 'autoLink', 'required', 'class', 'field', 'span', 'order', 'flex'],
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
                console.warn(`name属性必须是数组[${this.name}]或者用field替代name`)
            } else {
                this.namePath = this.name;
            }
        } else if(this.field){
            this.namePath = this.field.split('.');
        } else {
            return console.warn(`存在表单组件未设置属性[field or name]`)
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
        getFormItemProps(options) {
            options = options ? options : defOptions;
            return mergeProps(this.$props, {
                name: this.namePath,
                span: this.realSpan,
                ...options
            })
        },
        getFormAttrs(options) {
            if(this.attrs) {
                return mergeProps(this.attrs, this.$attrs, options);
            }

            this.attrs = this.$attrs;
            if(this.formContext && !this.attrs['onUpdate:value']) {
                let value = computed(() => this.formContext.getFieldValue(this.namePath));
                this.attrs = mergeProps(this.$attrs, {
                    value: value, 'onUpdate:value': (val) => {
                        this.formContext.setFieldValue(this.namePath, val);
                    }
                }, options ? options : {});
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
