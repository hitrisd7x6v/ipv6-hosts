/**
 * 基础表单
 * @type {{data(): *, created(), methods: {}, mounted(), props: {}}}
 */
import moment from "moment";

export const MixBasicModel = {
    props: {
        metas: {type: Array, required: true},
        formConfig: {type: Object, required: true}, // 配置
    },
    data () {
        return {
            model: {}, // 当前编辑的表单对象
            oriModel: {}, // 原始表单model对象
            dateMetas: [], // 日期格式元数据
            fieldMetaMap: {},
        }
    },
    created () {
        this.metas.forEach(meta=>{
            let defaultValue = meta['default'];
            if(this.$utils.isDate(meta.type)) {
                this.dateMetas.push(meta);
            }

            this.fieldMetaMap[meta.field] = meta;
            this.oriModel[meta.field] = meta['decorate']['initialValue'];
        });
    },
    mounted () {
        this.$emit("mountedFinished", this);
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
        setEditModel(model) {
            this.model = model;
            this.dateMetas.forEach(meta=>{
                let value = model[meta.field];
                if(value) {
                    model[meta.field] = moment(value);
                }
            })
        },
        getEditModel() {
            return this.model;
        },
        getOriModel() {
            return this.$utils.clone(this.oriModel);
        },
        resetForm (model) {
            this.model = model || this.getOriModel();
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
        changeHandle(val, col) {
            let onChange = col.event['change'];
            if(onChange) onChange(val, this.model, col);
        },
        // 验证表单
        validate () {
            return this.$refs['formModelRef'].validate();
        },
    }
};
