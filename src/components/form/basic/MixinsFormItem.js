import {defineComponent, inject, mergeProps, reactive, computed} from "vue";

export default defineComponent({
    props: ['name', 'label', 'labelCol', 'wrapperCol', 'colon', 'extra', 'hasFeedback'
        , 'help', 'labelAlign', 'validateStatus', 'validateFirst', 'validateTrigger'
        , 'extra', 'autoLink', 'required', 'class', 'style', 'field'],
    data() {
        return {
            meta: {},
            attrs: null,
            namePath: [],
            formContext: inject('formContext'),
        }
    },
    created() {
        this.namePath = this.name;
        if(this.name) {
            if(!(this.name instanceof Array)) {
                console.warn(`name属性必须是数组[${this.name}]或者用field替代name`)
            }
        } else {
            this.namePath = this.field.split('.');
            this.$props.name = this.namePath;
        }

        if(this.formContext) {
            let initModel = inject('initModel');
            let defaultValue = this.$attrs.defaultValue;
            initModel(this.namePath, this.getDefaultValue(defaultValue));
            // this.meta = this.formContext.getFormMeta(this.name) || this.meta;
        }
    },
    methods: {
        getDefaultValue(defaultValue) {
            return defaultValue || null;
        },
        getFormItemProps() {
            return mergeProps(this.$props, {name: this.namePath})
        },
        getFormAttrs(options) {
            if(this.attrs) {
                return this.attrs;
            }

            this.attrs = this.$attrs;
            let value = computed(() => this.formContext.getFieldValue(this.namePath));
            if(this.formContext && !this.attrs['onUpdate:value']) {
                this.attrs = reactive(mergeProps(this.$attrs, {
                    value: value, 'onUpdate:value': (val) => {
                        this.formContext.setFieldValue(this.namePath, val);
                    }
                }, options ? options : {}));
            }

            return this.attrs;
        },
        getCheckedAttrs() {
            if(this.attrs) {
                return this.attrs;
            }

            this.attrs = this.$attrs;
            let value = computed(() => this.formContext.getMetaValue(this.name));
            if(this.formContext && !this.attrs['onUpdate:checked']) {
                this.attrs = reactive(mergeProps(this.$attrs, {
                    checked: value, 'onUpdate:checked': (val) => {
                        this.formContext.setMetaValue(this.name, val);
                    }
                }));
            }

            return this.attrs;
        }
    }
})
