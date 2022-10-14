import {defineComponent, isProxy, mergeProps, provide, reactive} from "vue";
import {cloneDeep} from "lodash-es";
import {Form} from "ant-design-vue";
import {createMetasMap, getMetaByProp, getMetaValue, setMetaValue} from "@/utils/MetaUtils";

const unMounted = () => console.log('IvzForm组件未完成挂载')
export default defineComponent({
    name: 'IvzForm',
    props: {
        rules: Object,
        name: String,
        span: Array, // labelCol wrapperCol eg: [3, 21]
        labelCol: Object,
        wrapperCol: Object,
        hideRequiredMark: Boolean,
        colon: {type: Boolean, default: true},
        validateTrigger: {type: String | Array},
        labelAlign: {type: String, default: 'right'},
        layout: {type: String, default: 'horizontal'},
        scrollToFirstError: {type: Boolean, default: false},
        validateOnRuleChange: {type: Boolean, default: true},
        metas: {type: Array, required: false, default: () => []},
    },
    setup({metas, rules}) {
        const resetModel = {}, initModel = {};
        const metasMap = createMetasMap(metas);

        let formRef;
        let editModel = reactive({});
        const formContext = reactive({
            validate: unMounted,
            resetFields: unMounted,
            getEditModel: unMounted,
            setEditModel: unMounted,
            getInitModel: unMounted,
            getResetModel: unMounted,
            scrollToField: unMounted,
            clearValidate: unMounted,
            validateFields: unMounted,
            getDefaultModel: unMounted,
            getFieldValue: (namePath) => null,
            setFieldValue: (namePath, value) => null,
            getFormMeta: (props) => getMetaByProp(props, metasMap),
        })

        provide('initModel', (namePath, value) =>
            setMetaValue(namePath, editModel, value))


        let proxy = reactive({editModel});
        if(rules instanceof Object) {
            Object.keys(rules).forEach(key => {
                let rule = rules[key];
                rules[key] = rule instanceof Array ? rule : [rule];
            })
            formContext['useForm'] = Form.useForm(proxy.editModel, reactive(rules));
        } else {
            formContext['useForm'] = {};
        }

        provide('formContext', formContext);
        return {resetModel, metasMap, formContext, formRef, proxy, initModel}
    },
    created() {
        this.formRef = this.$refs['formRef']
        // 必须在匿名函数里面引用editModel 才能触发editModel的改变
        this.formContext.getFieldValue = (namePath) =>
            getMetaValue(namePath, this.proxy.editModel);
        this.formContext.setFieldValue = (namePath, value) =>
            {setMetaValue(namePath, this.proxy.editModel, value)};

        this.formContext.validate = this.validate;
        this.formContext.resetFields = this.resetFields;
        this.formContext.getEditModel = this.getEditModel;
        this.formContext.setEditModel = this.setEditModel;
        this.formContext.getInitModel = this.getInitModel;
        this.formContext.getResetModel = this.getResetModel;
        this.formContext.scrollToField = this.scrollToField;
        this.formContext.clearValidate = this.clearValidate;
        this.formContext.validateFields = this.validateFields;
    },
    mounted() {
        this.initModel = cloneDeep(this.proxy.editModel);
        this.resetModel = cloneDeep(this.proxy.editModel);
    },
    render() {
        let editModel = this.proxy.editModel;
        let labelCol = this.labelCol, wrapperCol = this.wrapperCol;
        if(this.span instanceof Array) {
            labelCol = {span: this.span[0]};
            wrapperCol = {span: this.span[1]}
        }

        let props = mergeProps(this.$props, {model: editModel, labelCol, wrapperCol});
        return (
            <a-form {...props} ref="formRef">
                {this.$slots.default({model: editModel})}
            </a-form>)
    },
    methods: {
        // 元表单引用对象
        getFormRef() {
            return this.formRef;
        },
        validate() {
            return this.getFormRef().validate();
        },

        getFormContext() {
            return this.formContext;
        },
        resetFields() {
            this.getFormRef().resetFields();
            let model = this.getResetModel();
            this.proxy.editModel = reactive(model);
        },
        scrollToField() {
            this.getFormRef().scrollToField();
        },

        validateFields() {
            return this.getFormRef().validateFields();
        },

        clearValidate() {
            this.getFormRef().clearValidate();
        },

        getInitModel() {
            return cloneDeep(this.initModel);
        },

        getResetModel() {
            return cloneDeep(this.resetModel);
        },

        getEditModel() {
            return this.proxy.editModel;
        },

        setEditModel(editModel) {
            if(!isProxy(editModel)) {
                this.proxy.editModel = reactive(editModel);
            }else {
                this.proxy.editModel = editModel;
            }

            this.resetModel = cloneDeep(editModel);
        }
    }
})
