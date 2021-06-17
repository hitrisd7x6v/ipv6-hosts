<template>
    <a-form class="ivz-slot-form" :form="form"
            :hide-required-mark="config.hideRequiredMark" :layout="config.layout">
        <slot></slot>
    </a-form>
</template>
<!--自定义表单页-->
<script>
    import {MixBasicForm} from "@/components/mixins/MixBasicForm";

    export default {
        name: 'IvzDiyForm',
        components: {},
        mixins: [MixBasicForm],
        props: {},
        watch: {
            model: {
                handler (newVal, oldVal) {
                    if (this.bindType === 'both') { // 如果是双向数据绑定, 则会始终更新
                        this.form.updateFields()
                    }
                },
                deep: true
            }
        },
        data () {
            return {
                model: null, // 当前编辑的表单对象
                oriModel: null // 原始表单字段对象
            }
        },
        created () {
            this.$page.resolverGroup(this.formGroup, this, meta => {
                this.fieldMetaMap[meta.field] = meta;
                this.$utils.assignProperty(this.oriModel, this.getMetaDefaultValue(meta))
            })
        },
        mounted () {
            this.oriModel = this.form.getFieldsValue()
        },
        methods: {
            // 修改表单值对象
            modifyModelValue (model, values) {
                // 用来处理{aa: {bb: {cc: 5}}}嵌套对象的值
                Object.keys(values).forEach(key => {
                    let value = values[key];
                    if (value instanceof Object) { // 如果值还是一个对象可以分为以下两种情况：
                        if (!model[key]) model[key] = value; // 1. 值不存在, 直接赋值
                        else this.modifyModelValue(model[key], value) // 2. 值存在, 继续递归设置值
                    } else {
                        model[key] = value
                    }
                })
            },
            // 重置表单值对象
            setEditModel (newModel) {
                this.model = newModel;
                this.form.updateFields()
            },
            // 验证表单
            validate () {
                return this.form.validateFields()
            }
        }
    }
</script>

<style>
</style>
