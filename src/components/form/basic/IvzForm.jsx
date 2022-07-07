import {defineComponent, isProxy, mergeProps, provide, reactive} from "vue";
import {createMetasMap, getMetaByProp, getMetaValue, setMetaValue} from "@/utils/MetaUtils";
import {cloneDeep} from "lodash-es";

const unMounted = () => console.log('IvzForm组件未完成挂载')
export default defineComponent({
    name: 'IvzForm',
    props: {
        rules: Array,
        name: String,
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
    setup({metas}) {
        const defaultModel = {};
        const metasMap = createMetasMap(metas);

        let formRef;
        let editModel = reactive({});
        const formContext = reactive({
            validate: unMounted,
            resetFields: unMounted,
            getEditModel: unMounted,
            setEditModel: unMounted,
            scrollToField: unMounted,
            clearValidate: unMounted,
            validateFields: unMounted,
            getFieldValue: (namePath) => null,
            setFieldValue: (namePath, value) => null,
            getFormMeta: (props) => getMetaByProp(props, metasMap),
        })

        provide('initModel', (namePath, value) =>
            setMetaValue(namePath, editModel, value))
        provide('formContext', formContext);

        let proxy = reactive({editModel});
        return {defaultModel, metasMap, formContext, formRef, proxy}
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
        this.formContext.scrollToField = this.scrollToField;
        this.formContext.clearValidate = this.clearValidate;
        this.formContext.validateFields = this.validateFields;
    },
    mounted() {
        this.defaultModel = cloneDeep(this.proxy.editModel);
    },
    render() {
        let editModel = this.proxy.editModel;
        let props = mergeProps(this.$attrs, {model: editModel});
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
            this.getFormRef().validate();
        },

        getFormContext() {
            return this.formContext;
        },
        resetFields() {
            this.getFormRef().resetFields();
            let model = this.getDefaultModel();
            this.proxy.editModel = reactive(model);
        },
        scrollToField() {
            this.getFormRef().scrollToField();
        },

        validateFields() {
            this.getFormRef().validateFields();
        },

        clearValidate() {
            this.getFormRef().clearValidate();
        },

        getDefaultModel() {
            return cloneDeep(this.defaultModel);
        },

        getEditModel() {
            return this.proxy.editModel;
        },

        setEditModel(editModel) {
            this.defaultModel = cloneDeep(editModel);

            if(!isProxy(editModel)) {
                this.proxy.editModel = reactive(editModel);
            }else {
                this.proxy.editModel = editModel;
            }
        }
    }
})
