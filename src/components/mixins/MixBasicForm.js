/**
 * 基础表单
 * @type {{data(): *, created(), methods: {}, mounted(), props: {}}}
 */
import moment from 'moment'

export const MixBasicForm = {
    props: {
        bindType: {type: String, default: 'both'}, // 默认双向绑定
        formConfig: {type: Object, required: true}, // 配置
    },
    data () {
        return {
            model: {}, // 当前编辑的表单对象
            oriModel: {}, // 原始表单model对象
            fieldMetaMap: {},
        }
    },
    created () {
        this.handleFieldMetaMap();

        this.form = this.$form.createForm(this, {
            // name: 'IvzForm',
            mapPropsToFields: () => { // 将model对象同步到表单
                return this.syncModelToForm(this.model);
            }
        })
    },
    mounted () {
        this.oriModel = this.form.getFieldsValue();
        this.$emit('mountedFinished', this) // 挂载完成事件
    },
    methods: {
        viewForm (col) {
            if (typeof col['isForm'] === 'function') {
                return col.isForm(this.model, this)
            } else if (col.type === 'hidden') {
                return false
            } else {
                return col['isForm']
            }
        },
        resetForm (model) {
            this.model = model;
            this.form.resetFields();
        },
        getOriFormModel () {
            return this.$utils.clone(this.oriModel);
        },
        handleFieldMetaMap() {},
        disabledHandle (col) {
            if (!col.disabled) {
                return false
            } else if (typeof col.disabled === 'function') {
                return col.disabled(this.model)
            } else {
                return col.disabled
            }
        },
        // 验证表单
        validate () {
            return new Promise((resolve, reject) => {
                this.form.validateFieldsAndScroll(((errors, values) => {
                    if(errors) reject(errors);
                    else resolve(values)
                }))
            })
        },
        /**
         * @param param
         */
        setFieldsValue(param) {
            if(param) {
                Object.keys(param).forEach(key=>{
                    let meta = this.fieldMetaMap[key];
                    if(meta) {
                        let fieldsValue = {};
                        fieldsValue[key] = param[key];
                        this.form.setFieldsValue(fieldsValue);
                        this.$utils.deepSetValue(key, param[key], this.getEditModel());
                    }
                });
            }
        },
        /**
         * 同步model数据到表单
         */
        syncModelToForm (newModel) {
            if (!newModel) return;
            return this.doSyncModelToForm(newModel, {})
        },
        doSyncModelToForm (newModel, formValues) {
            if (this.$utils.isBlank(newModel)) return null;

            let metas = Object.values(this.fieldMetaMap);
            metas.forEach(meta=>{
                let value = this.$utils.getDeepValue(meta.field, newModel);
                if(this.$utils.isDate(meta.type) && typeof value === 'string') {
                    formValues[meta.field] = this.$form.createFormField({value: moment(value)});
                } else if(meta.type == 'tree') { // 树节点并非表单, 需要单独设置
                    meta.config.checkedKeys = value || meta.config.checkedKeys;
                    if(meta.config.expandedAll) {
                        this.$nextTick(()=>{
                            meta.config.expandedKeys = this.getTreeAllKeys(meta.data, []);
                        })
                    }
                } else if(meta.type == 'stree') {
                    if(value) {
                        // 默认展开已经选中的
                        meta.config.treeExpandedKeys = this.$utils.isArray(value) ? value : [value];
                    }

                    if(meta.config.expandedAll) {
                        this.$nextTick(()=>{
                            meta.config.treeExpandedKeys = this.getTreeAllKeys(meta.data, []);
                        })
                    }
                    formValues[meta.field] = this.$form.createFormField({value: value});
                } else {
                    formValues[meta.field] = this.$form.createFormField({value: value});
                }
            });

            return formValues
        },
        getTreeAllKeys(data, keys) {
            data.forEach(node=>{
                if(node.children) {
                    keys.push(node['value']);
                    this.getTreeAllKeys(node.children, keys);
                }
            });
            return keys;
        },
        changeHandle(val, col) {
            if(val instanceof Event) {
                val = val.target.value;
            } else if(col.type == 'radio') {
                val = val.target.value;
            }

            this.$utils.deepSetValue(col.field, val, this.model);
            let onChange = col.event['change'];
            if(onChange) onChange(val, this.model, col);
        },
        treeCheck(checkedKeys, col, node) {
            col.event.check(checkedKeys, this.model, col, node);
            this.changeHandle(checkedKeys, col);
        },
        /**
         * 返回当前正在编辑的对象
         * @returns {null|*|undefined}
         */
        getEditModel () {
            return this.model
        },
        getFieldValue(field) {
            return this.form.getFieldValue(field);
        },
        // 重置表单值对象
        setEditModel (newModel) {
            this.model = newModel;
            this.form.updateFields()
        }
    }
};
