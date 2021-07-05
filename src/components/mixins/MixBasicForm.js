/**
 * 基础表单
 * @type {{data(): *, created(), methods: {}, mounted(), props: {}}}
 */
import moment from 'moment'

export const MixBasicForm = {
    props: {
        oriModel: {type: Object, required: true},
        bindType: {type: String, default: 'both'}, // 默认双向绑定
        formConfig: {type: Object, required: true}, // 配置
        fieldMetaMap: {type: Object, required: true},
    },
    data () {
        return {
            model: {}, // 当前编辑的表单对象
        }
    },
    created () {
        this.form = this.$form.createForm(this, {
            name: 'IvzForm',
            mapPropsToFields: () => { // 将model对象同步到表单
                return this.syncModelToForm(this.model)
            },
            onValuesChange: this.onValuesChange
        })
    },
    mounted () { },
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
        mergeEditModel () {
            let fieldsValue = this.form.getFieldsValue();
            this.$utils.assignVueProperty(this.model, fieldsValue)
        },
        getOriFormModel () {
            return this.$utils.assignVueProperty({}, this.oriModel, this)
        },
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
         * 此方法将会触发change事件
         * @param param
         */
        setFieldsValue(param) {
            // 如果是双向绑定, 则此方法无效
            if(param && this.bindType == 'void') {
                this.form.setFieldsValue(param);
            }
        },
        /**
         * 同步model数据到表单
         */
        syncModelToForm (newModel) {
            if (!newModel) return
            return this.doSyncModelToForm(newModel, this.oriModel, null, {})
        },
        doSyncModelToForm (newModel, oriModel, preField, formValues) {
            if (!oriModel) return
            Object.keys(oriModel).forEach(field => {
                let newValue = newModel[field]
                if (!preField) preField = field
                else preField += field

                let meta = this.fieldMetaMap[preField]
                if (!newValue) {

                } else if (this.isArray(newValue)) { // 如果是数组说明field不是a.b格式
                    if (this.$utils.isDate(meta['type'])) { // 属于日期格式, 需要转成moment
                        let temp = []
                        newValue.forEach(item => {
                            temp.push(moment(item))
                        })
                        newValue = temp
                    }
                } else if (moment.isMoment(newValue)) { // 属于日期格式, 默认

                } else if (this.isObject(newValue)) {
                    this.doSyncModelToForm(newModel[field], oriModel[field], preField + '.', formValues)
                } else if (meta && this.$utils.isDate(meta['type'])) { // 字段是时间格式
                    newValue = moment(newValue)
                }
                formValues[preField] = this.$form.createFormField({value: newValue})
                preField = ''
            })
            return formValues
        },
        /**
         * 同步表单的值到编辑的model
         * @param model
         * @param values
         * @param field 初始值为null
         */
        syncFormToModel (model, values, field) {
            // 用来处理{aa: {bb: {cc: 5}}}嵌套对象的值
            Object.keys(values).forEach(key => {
                if (!field) field = key
                else field += key

                let value = values[key]
                let meta = this.fieldMetaMap[field];
                let onChange = (e, v) => {};
                if(meta && meta.event && meta.event.change)
                    onChange = meta.event.change;
                let params = {model: this.model, meta, bind: this.setFieldsValue};
                if (!value) {
                    this.$utils.deepSetValue(key, value, model);
                    onChange(value, params)
                } else if (this.isArray(value)) { // 如果是数组说明field不是a.b格式
                    if (this.$utils.isDate(meta['type'])) { // 属于日期格式, 需要格式化
                        let temp = [], format = meta['config'].format;
                        value.forEach(item => {
                            if(moment.isMoment(item))
                                temp.push(item.format(format));
                            else temp.push(item);
                        });
                        value = temp
                    }
                    this.$utils.deepSetValue(key, value, model);
                    onChange(value, params)
                } else if (moment.isMoment(value)) { // 属于日期格式, 格式化
                    let format = meta['config'].format
                    this.$utils.deepSetValue(key, value.format(format), model);
                    onChange(model[key], params)
                } else if (this.isObject(value)) { // 如果是对象说明field是a.b格式
                    if (!model[key]) this.$set(model, key, {}) // 1. 值不存在, 直接赋值为{}, 然后继续迭代
                    this.syncFormToModel(model[key], value, field + '.') // 2. 值存在, 继续迭代设置值
                } else {
                    this.$utils.deepSetValue(key, value, model);
                    onChange(value, params)
                }
                field = ''
            })
        }
    }
}
